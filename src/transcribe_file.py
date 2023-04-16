import os
import datetime
import time
import copy
import requests
import whisper
import pandas as pd
# for pyannote diarization
from pyannote.audio import Pipeline

def add_diarization(dz, utterances):
    speaker_list = []
    for speech_turn, track, speaker in dz.itertracks(yield_label=True):
        speaker_list.append((speech_turn.start, speech_turn.end, speaker))
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
        df_dz_filt["overlap"] = df_dz_filt.apply(lambda x: min(x[1], utterance["end"]) - max(x[0], utterance["start"]), axis=1)
        df_dz_filt = df_dz_filt.sort_values(by="overlap", ascending=False)
        speaker = df_dz_filt.iloc[0][2]
    return speaker

# convert time in seconds to time in hours, minutes, seconds, 
#including leading zeros and rounding seconds
def convert_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = round(seconds % 60)
    return "{:02d}:{:02d}:{:02d}".format(hours, minutes, seconds)


def get_transcription(filename, language, model_size):

    #print("starting episode:", episode)
    #guid = episode.get("guid")
    #slug = episode.get("slug")
    #filename = f"{media_dir}/{slug}_{guid}.wav"

    model = whisper.load_model(model_size)
    decode_options = dict(best_of=5, beam_size=5, language=language)#episode.get("language"))
    transcribe_options = dict(word_timestamps=True, fp16=False, **decode_options)

    # run Whisper
    start_time = time.time()
    output = model.transcribe(filename, **transcribe_options)
    running_time = time.time() - start_time

    list_of_word_list = [seg_dict.pop("words") for seg_dict in output.get("segments")]
    words = [words for seglist in list_of_word_list for words in seglist]

    # diarization
    pipeline = Pipeline.from_pretrained('pyannote/speaker-diarization', use_auth_token="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")
    dz = pipeline({"audio":filename})

    speech2txt = {
        "model": "OpenAI Whisper",
        "size": model_size,
        "version": whisper.__version__,
        "weights": whisper._MODELS.get(model_size),
        "hyperparams": transcribe_options,
    }


    transcription_dict = {
    #    'guid': guid,
        'name': f"Whisper-{model_size}",
        'runtime': convert_time(running_time),
        'created': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'text': output.get("text"),
        'language': output.get("language"),
        'speech2txt': speech2txt,
        'words': words,
        'diarization': dz.for_json()
    }

    #res = requests.post(f"http://127.0.0.1:8008/api/transcriptions/", json=transcription_dict)

    #trans_uuid = res.json().get("uuid")
    utterance_set = add_diarization(dz, copy.deepcopy(output.get("segments")))

    segmentation_dict = {
    #    "uuid": trans_uuid,
        "name": "Whisper-default",
        "segmentor": speech2txt,
        "utterance_set": [utterance for utterance in utterance_set if utterance.get("text") != ""]
    }

    #res = requests.post(f"http://127.0.0.1:8008/api/podcasts/{slug}/{guid}/utterances/", json=segmentation_dict)

    return {"transcription": transcription_dict, "segmentation": segmentation_dict}


