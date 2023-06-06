SELECT 
    main.category,
    main.label,
    main.agent,
    main.text,
    main.text_coref,
    main.name,
    main.audioitem_title,
    main.audiochannel_title,
    main.study_category,
    main.language,
    sub_BBA.ClaimBuster_BBA,
    sub_BBA_COREF.ClaimBuster_BBA_COREF,
    sub_Motivation.Motivation,
    sub_ClaimSpan.ClaimSpan
FROM 
(
    SELECT 
        cl.utterance_id as utterance_id,
        cl.agent as agent,
        cl.category,
        cl.label,
        ut.text,
        ut.text_coref,
        sg.name,
        ai.title as audioitem_title,
        ac.title as audiochannel_title,
        ac.study_category,
        ac.language
    FROM 
        api_classification cl
    JOIN 
        api_utterance ut ON cl.utterance_id = ut.id
    JOIN 
        api_segmentation sg ON ut.segmentation_id = sg.id
    JOIN 
        api_transcription tr ON sg.transcription_id = tr.id
    JOIN 
        api_audioitem ai ON tr.item_id = ai.id
    JOIN 
        api_audiochannel ac ON ai.channel_id = ac.id
    WHERE 
        cl.qualifier = 'Checkworthiness' AND cl.agent NOT IN ('ClaimBuster-BBA', 'ClaimBuster-BBA-COREF')
) AS main
LEFT JOIN 
(
    SELECT 
        cl.utterance_id,
        cl.agent,
        MIN(cl.label) as ClaimBuster_BBA
    FROM 
        api_classification cl
    WHERE 
        cl.agent = 'ClaimBuster-BBA'
    GROUP BY 
        cl.utterance_id,
        cl.agent
) AS sub_BBA 
ON main.utterance_id = sub_BBA.utterance_id
LEFT JOIN 
(
    SELECT 
        cl.utterance_id,
        cl.agent,
        MIN(cl.label) as ClaimBuster_BBA_COREF
    FROM 
        api_classification cl
    WHERE 
        cl.agent = 'ClaimBuster-BBA-COREF'
    GROUP BY 
        cl.utterance_id,
        cl.agent
) AS sub_BBA_COREF 
ON main.utterance_id = sub_BBA_COREF.utterance_id
LEFT JOIN 
(
    SELECT 
        cl.utterance_id,
        cl.agent,
        MIN(cl.label) as Motivation
    FROM 
        api_classification cl
    WHERE 
        cl.qualifier = 'Motivation'
    GROUP BY 
        cl.utterance_id,
        cl.agent
) AS sub_Motivation 
ON main.utterance_id = sub_Motivation.utterance_id AND main.agent = sub_Motivation.agent
LEFT JOIN 
(
    SELECT 
        cl.utterance_id,
        cl.agent,
        MIN(cl.label) as ClaimSpan
    FROM 
        api_classification cl
    WHERE 
        cl.qualifier = 'ClaimSpan'
    GROUP BY 
        cl.utterance_id,
        cl.agent
) AS sub_ClaimSpan 
ON main.utterance_id = sub_ClaimSpan.utterance_id AND main.agent = sub_ClaimSpan.agent;
