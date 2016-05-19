function main(){
   projectId = "";
   datasetId = "";
   tableId = ""
   data = [];
   report = AdWordsApp.report(
    'SELECT Criteria, CampaignName, AdGroupName, Clicks, Impressions, Cost, Conversions, QualityScore, SearchPredictedCtr, CreativeQualityScore, PostClickQualityScore, ConversionValue ' +
    'FROM   KEYWORDS_PERFORMANCE_REPORT ' +
    'WHERE Status = ENABLED AND Impressions > 1 ' +
    'DURING YESTERDAY');
   rows = report.rows();
  while (rows.hasNext()) {
     row = rows.next();
    data.push (JSON.stringify({"impressions": parseInt(row.Impressions),
                               'postClickQualityScore': row.PostClickQualityScore,
                               'keyword': row.Criteria,
                               'campaignName': row.CampaignName,
                               'adGroupName': row.adGroupName,
                               'clicks': parseInt(row.Clicks),
                               'cost': parseInt(row.Cost),
                               'conversions': parseInt(row.Conversions),
                               'qualityScore': parseInt(row.QualityScore),
                               'searchPredictedCtr': row.SearchPredictedCtr,
                               'creativeQualityScore': row.CreativeQualityScore,
                               'postClickQualityScore': row.PostClickQualityScore,
                               'conversionValue': parseFloat(row.ConversionValue)}));
  }
   data = data.join("\n");
  blobData = Utilities.newBlob(data, "application/octet-stream");
  job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId
        },
        sourceFormat: "NEWLINE_DELIMITED_JSON",
        writeDisposition: "WRITE_TRUNCATE"
      }
    }
  }
  job = BigQuery.Jobs.insert(job, projectId, blobData);
   end =  new Date();
}
