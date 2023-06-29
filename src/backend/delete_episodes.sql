DELETE FROM api_classification 
WHERE utterance_id IN (
    SELECT id FROM api_utterance WHERE segmentation_id IN (
        SELECT id FROM api_segmentation WHERE transcription_id IN (
            SELECT id FROM api_transcription WHERE item_id IN (
                SELECT id FROM api_audioitem WHERE channel_id = 27
            )
        )
    )
);
DELETE FROM api_utterance 
WHERE segmentation_id IN (
    SELECT id FROM api_segmentation WHERE transcription_id IN (
        SELECT id FROM api_transcription WHERE item_id IN (
            SELECT id FROM api_audioitem WHERE channel_id = 27
        )
    )
);

DELETE FROM api_agentsession 
WHERE segmentation_id IN (
    SELECT id FROM api_segmentation WHERE transcription_id IN (
        SELECT id FROM api_transcription WHERE item_id IN (
            SELECT id FROM api_audioitem WHERE channel_id = 27
        )
    )
);


DELETE FROM api_segmentation 
WHERE transcription_id IN (
    SELECT id FROM api_transcription WHERE item_id IN (
        SELECT id FROM api_audioitem WHERE channel_id = 27
    )
);

DELETE FROM api_transcription 
WHERE item_id IN (
    SELECT id FROM api_audioitem WHERE channel_id = 27
);

DELETE FROM api_audioitem 
WHERE channel_id = 27;
