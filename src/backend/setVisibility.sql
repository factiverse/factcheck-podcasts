UPDATE api_utterance
SET visibility =  '["Transcription", "Advertising", "Diarization"]'
WHERE segmentation_id = 2281

UPDATE api_utterance 
SET visibility = '["Transcription", "Advertising", "Diarization"]'
WHERE id IN (
    SELECT api_utterance.id 
    FROM api_utterance 
    JOIN api_segmentation ON api_utterance.segmentation_id = api_segmentation.id
    WHERE api_segmentation.name = 'Medical TR/DI/AD'
);