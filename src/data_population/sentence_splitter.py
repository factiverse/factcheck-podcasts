import spacy
from spacy.tokens import Span
import copy
import pandas as pd

def add_diarization(dz, utterances):
    speaker_list = []
    for seg in dz:
        speaker_list.append((seg["segment"]["start"], seg["segment"]["end"], seg["label"]))
    df_dz = pd.DataFrame(speaker_list)

    for utt in utterances:
        utt["speaker"] = find_speaker(utt, df_dz)
    return utterances

def find_speaker(utterance, df_dz):
    # find speaker - filter diarization to find utterances close in time to the current segment
    df_dz_filt = df_dz[(df_dz[1] >= utterance["start"] - 5) & (df_dz[0] <= utterance["end"] + 5)]
    if len(df_dz_filt) == 0:
        speaker = "unknown"
    elif len(df_dz_filt) == 1:
        speaker = df_dz_filt.iloc[0][2]
    else:
        # find the diarization segment that overlaps the most with the current segment
        df_dz_filt = df_dz_filt.copy()  # Create an explicit copy of the DataFrame
        df_dz_filt.loc[:, "overlap"] = df_dz_filt.apply(lambda x: min(x[1], utterance["end"]) - max(x[0], utterance["start"]), axis=1)
        df_dz_filt = df_dz_filt.sort_values(by="overlap", ascending=False)
        speaker = df_dz_filt.iloc[0][2]
    return speaker


def sentence_splitter(transcript, spacy_model):
    # Load the spaCy model
    nlp = spacy.load(spacy_model)

    # Set the custom attributes for start and end times on Span objects
    Span.set_extension('start_time', default=None, force=True)
    Span.set_extension('end_time', default=None, force=True)

    # load the words with start and end times
    words = copy.deepcopy(transcript['words'])
    # Concatenate the words into a text string
    text = "".join([word["word"] for word in words])
    # Process the text
    doc = nlp(text.strip())
    # load the diarization
    dz = transcript["diarization"]["content"]

    utterances = []
    sentence_list = list(doc.sents)
    idx = 0
    # Iterate over the sentences
    while idx < len(sentence_list):
        sent = sentence_list[idx]
        # Initialize start and end times
        start_time = words[0]["start"]
        sent_concat = ""
        while sent.text.strip() != sent_concat.strip():
            word = words.pop(0)
            sent_concat += word["word"]
            # if sent.text.strip() doesn't end with period, question mark or exclamation mark
            # check if sent_concat matches sent.text.strip() + following sent.text.strip()
            # special rare case when spaCy is not able to split the sentence correctly
            if sent.text.strip()[-1] not in [".", "?", "!"] and idx < len(sentence_list) - 1:
                if sent.text.strip() + sentence_list[idx+1].text.strip() == sent_concat.strip():
                    idx += 1
                    break
        idx += 1

        end_time = word["end"]
        # Assign start and end times to the sentence
        sent._.start_time = start_time
        sent._.end_time = end_time
        # Append the sentence to the list of utterances
        utterances.append({"text": sent.text, "start": sent._.start_time, "end": sent._.end_time})

    utterance_set = add_diarization(dz, utterances)
    return utterance_set