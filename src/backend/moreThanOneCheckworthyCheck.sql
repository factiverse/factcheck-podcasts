SELECT 
    COUNT(CASE WHEN agent = 'Factiverse' THEN 1 END) as Factiverse_count,
    COUNT(CASE WHEN agent = 'ClaimBuster-BBA' THEN 1 END) as ClaimBuster_BBA_count
FROM api_classification;

SELECT utterance_id, COUNT(*) as count
FROM api_classification
WHERE agent = 'ClaimBuster-BBA'
GROUP BY utterance_id
HAVING COUNT(*) > 1;