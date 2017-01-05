function bigQueryAdwordsTable() {
  projectId = "xxx";
  datasetId = "xxxx";
  tableId = 'xxx';
  table = {
    tableReference: {
      projectId: projectId,
      datasetId: datasetId,
      tableId: tableId
    },
    schema: {
      fields: [
        {name: 'impressions', type: 'INTEGER'},
        {name: 'keyword', type: 'STRING'},
        {name: 'campaignName', type: 'STRING'},
        {name: 'adGroupname', type: 'STRING'},
        {name: 'clicks', type: 'INTEGER'},
        {name: 'cost', type: 'FLOAT'},
        {name: 'conversions', type: 'INTEGER'},
        {name: 'qualityScore', type: 'INTEGER'},
        {name: 'searchPredictedCtr', type: 'FLOAT'},
        {name: 'creativeQualityScore', type: 'INTEGER'},
        {name: 'postClickQualityScore', type: 'INTEGER'},
        {name: 'conversionValue', type: 'FLOAT'}
        ]
    }
  };
  table = BigQuery.Tables.insert(table, projectId, datasetId);
  Logger.log('Table created: %s', table.id);
}
