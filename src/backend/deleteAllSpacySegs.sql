--- DELETE ALL SPACY SEGMENTATIONS

-- First, delete related records in the 'api_classifications' table
DELETE FROM api_classification
WHERE utterance_id IN (
    SELECT id FROM api_utterance
    WHERE segmentation_id IN (
        SELECT id FROM api_segmentation WHERE name = 'spaCy-5% most CW'
    )
);

-- Next, delete related records in the 'api_queries' table
DELETE FROM api_query
WHERE utterance_id IN (
    SELECT id FROM api_utterance
    WHERE segmentation_id IN (
        SELECT id FROM api_segmentation WHERE name = 'spaCy-5% most CW'
    )
);

-- Now, delete related records in the 'api_utterances' table
DELETE FROM api_utterance
WHERE segmentation_id IN (
    SELECT id FROM api_segmentation WHERE name = 'spaCy-5% most CW'
);

-- Finally, delete the records in the 'api_segmentations' table
DELETE FROM api_segmentation
WHERE name = 'spaCy-5% most CW';