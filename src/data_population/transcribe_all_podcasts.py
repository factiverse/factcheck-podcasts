"""Script to transcribe all audio files in a directory using Whisper and save the results to JSON files.

Usage:
    python data_population/transcribe_all_podcasts.py --language=no --directory=media/no --device_index=1 --model_size=large-v3
    python data_population/transcribe_all_podcasts.py --language=en --directory=media/en --device_index=1 --model_size=large-v3
"""
import os
import json
import whisper
import time
import datetime
from pyannote.audio import Pipeline
from tqdm import tqdm
import copy
import torch
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Process audio files for transcription.")

    # Add arguments with default values
    parser.add_argument(
        '--directory',
        type=str,
        default="/mnt/harddrive/vsetty/repos/factcheck-podcasts/src/media/test_audio",
        help='Directory containing the audio files.'
    )
    
    parser.add_argument(
        '--language',
        type=str,
        default="en",
        help='Language code for the transcription (e.g., "en" for English, "no" for Norwegian).'
    )
    
    parser.add_argument(
        '--model_size',
        type=str,
        default="large-v3",
        help='Size of the Whisper model to use (e.g., "small", "medium", "large").'
    )
    
    parser.add_argument(
        '--device_index',
        type=int,
        default=1,
        help='Index of the GPU to use (0 for the first GPU, 1 for the second, etc.).'
    )

    # Parse the arguments
    return parser.parse_args()

def convert_time(seconds):
    return str(datetime.timedelta(seconds=int(seconds)))

def add_diarization(dz, segments):
    diarized_segments = []
    for segment in segments:
        start_time = segment["start"]
        end_time = segment["end"]
        text = segment["text"]
        for turn, _, speaker in dz.itertracks(yield_label=True):
            if start_time >= turn.start and end_time <= turn.end:
                diarized_segments.append({"start": start_time, "end": end_time, "text": text, "speaker": speaker})
    return diarized_segments

def annotation_to_json(annotation):
    """Convert pyannote.Annotation to a JSON serializable format."""
    diarization_json = []
    for segment, _, speaker in annotation.itertracks(yield_label=True):
        diarization_json.append({
            "start": segment.start,
            "end": segment.end,
            "speaker": speaker
        })
    return diarization_json

def get_transcription(model, model_size, diarization_pipeline, filename, language, initial_prompt="", device=1):
    print(f"Processing file: {filename}")
    
    decode_options = dict(best_of=5, beam_size=5, language=language)
    transcribe_options = dict(word_timestamps=True, fp16=False, initial_prompt=initial_prompt if len(initial_prompt) > 0 else None, **decode_options)

    start_time = time.time()
    output = model.transcribe(filename, **transcribe_options)
    running_time = time.time() - start_time
    print(f"Transcription done for file: {filename}")

    segments = output.get("segments")
    words = []

    # Progress bar for processing segments
    with tqdm(total=len(segments), desc="Processing segments") as pbar:
        for seg_dict in segments:
            words.extend(seg_dict.pop("words"))
            pbar.update(1)

    
    dz = diarization_pipeline({"audio": filename})
    

    speech2txt = {
        "model": "OpenAI Whisper",
        "size": model_size,  # Access model size from the loaded model
        "version": whisper.__version__,
        "weights": whisper._MODELS.get(model_size),
        "hyperparams": transcribe_options,
    }

    transcription_dict = {
        'name': f"Whisper-{model_size}",
        'runtime': convert_time(running_time),
        'created': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'text': output.get("text"),
        'language': output.get("language"),
        'speech2txt': speech2txt,
        'words': words,
        'diarization': annotation_to_json(dz)  # Manually converting annotation to JSON
    }

    utterance_set = add_diarization(dz, copy.deepcopy(output.get("segments")))
    print(f"Diarization done for file: {filename}")
    
    segmentation_dict = {
        'name': "Whisper-default",
        'segmentor': speech2txt,
        'utterance_set': [utterance for utterance in utterance_set if utterance.get("text") != ""]
    }

    return {"transcription": transcription_dict, "segmentation": segmentation_dict}

def process_audio_files(directory, language, model_size, device_index=1):
    # Load the model once
    
    device = device_index if torch.cuda.is_available() else -1
    
    diarization_pipeline = Pipeline.from_pretrained('pyannote/speaker-diarization')
    device = torch.device(f'cuda:{device}' if torch.cuda.is_available() else 'cpu')
    model = whisper.load_model(model_size)
    diarization_pipeline = diarization_pipeline.to(device)
    
    print(f"Model {model_size} loaded once for all files.")

    for filename in os.listdir(directory):
        if filename.endswith(".wav"):
            file_path = os.path.join(directory, filename)
            print(f"Processing file: {file_path}")
            
            # Perform transcription and diarization
            try:
                result = get_transcription(model, model_size, diarization_pipeline, file_path, language, initial_prompt="", device=device)
            except Exception as e:
                print(f"Error processing file: {file_path}")
                print(e)
                continue
            
            # Save the result to a JSON file
            json_filename = os.path.splitext(file_path)[0] + ".json"
            with open(json_filename, 'w') as json_file:
                json.dump(result, json_file, indent=4)
            
            print(f"Saved transcription and diarization to {json_filename}")

if __name__ == "__main__":
    args = parse_args()
    directory = args.directory
    language = args.language
    model_size = args.model_size
    device_index = args.device_index

    print(f"Directory: {directory}")
    print(f"Language: {language}")
    print(f"Model Size: {model_size}")
    print(f"Device Index: {device_index}")

    process_audio_files(directory, language, model_size, device_index=device_index)
