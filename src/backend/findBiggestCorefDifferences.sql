SELECT 
  ut.id AS utterance_id, 
  seg.uuid AS segmentation_uuid,
  ut.text AS utterance_text,
  ut.text_coref AS utterance_text_coref, 
  CAST(diffs.BBA_label AS REAL) AS BBA_label,
  CAST(diffs.BBAC_label AS REAL) AS BBAC_label,
  CAST(diffs.BBA_label AS REAL) - CAST(diffs.BBAC_label AS REAL) AS diff
FROM (
  SELECT 
    a.utterance_id, 
    a.label AS BBA_label,
    b.label AS BBAC_label
  FROM (
    SELECT 
      label, 
      utterance_id
    FROM 
      api_classification 
    WHERE 
      agent = 'ClaimBuster-BBA'
  ) AS a 
  INNER JOIN (
    SELECT 
      label, 
      utterance_id
    FROM 
      api_classification 
    WHERE 
      agent = 'ClaimBuster-BBA-COREF'
  ) AS b 
  ON a.utterance_id = b.utterance_id
) AS diffs
JOIN api_utterance AS ut 
  ON ut.id = diffs.utterance_id
JOIN api_segmentation AS seg 
  ON seg.id = ut.segmentation_id
ORDER BY 
  ABS(diff) DESC;
