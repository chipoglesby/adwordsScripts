var SPREADSHEET_URL = "YOUR URL HERE";
 
function main() {
  //These names are important. change them with caution
  var tabs = ['ABC123', 'ABC123 LM'];
  for(var i in tabs) {
    var results = runQuery(tabs[i]);
    writeToSpreadsheet(tabs[i],results);
  }
}
 
//Helper function to get or create the spreadsheet
function getSheet(tab) {
  var s_sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet;
  try {
    sheet = s_sheet.getSheetByName(tab);
    if(!sheet) {
      sheet = s_sheet.insertSheet(tab, 0);
    }
  } catch(e) {
    sheet = s_sheet.insertSheet(tab, 0);
  }
  return sheet
}
 
//Function to write the rows of the report to the sheet
function writeToSpreadsheet(tab,rows) {
  var to_write = convertRowsToSpreadsheetRows(tab,rows);
  var s_sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = getSheet(tab);
  sheet.clear();
   
  var numRows = sheet.getMaxRows();
  if(numRows < to_write.length) {
    sheet.insertRows(1,to_write.length-numRows); 
  }
  var range = sheet.getRange(1,1,to_write.length,to_write[0].length);
  range.setValues(to_write);
}
 
//A generic function used to build and run the report query
function runQuery(tab) {
  var API_VERSION = { includeZeroImpressions : false };
  var cols = getColumns(tab);
  var report = getReport(tab);
  var date_range = getDateRange(tab);
  var where = getWhereClause(tab);
  var query = ['select',cols.join(','),'from',report,where,'during',date_range].join(' ');
  var report_iter = AdWordsApp.report(query, API_VERSION).rows();
  var rows = [];
  while(report_iter.hasNext()) { 
    rows.push(report_iter.next());
  }
  return rows;
}
  
//This function will convert row data into a format easily pushed into a spreadsheet
function convertRowsToSpreadsheetRows(tab,rows) {
  var cols = getColumns(tab);
  var ret_val = [cols];
  for(var i in rows) {
    var r = rows[i];
    var ss_row = [];
    for(var x in cols) {
      ss_row.push(r[cols[x]]);
    }
    ret_val.push(ss_row);
  }
  return ret_val;
}
 
//Based on the tab name, this returns the report type to use for the query
function getReport(tab) {
  if(tab.indexOf('ABC123') == 0) {
    return 'BUDGET_PERFORMANCE_REPORT';
  }  
  throw new Exception('tab name not recognized: '+tab);
}
 
//Based on the tab name, this returns the where clause for the query
function getWhereClause(tab) {
  if(tab.indexOf('ABC123') == 0) {
    return 'where AssociatedCampaignName CONTAINS ABC_YOUTUBE AND Clicks > 1';
  }
  throw new Exception('tab name not recognized: '+tab);
}
 
//Based on the tab name, this returns the columns to add into the report
function getColumns(tab) {
  var ret_array = [];
  if(tab.indexOf('ABC123') == 0) {
    ret_array = ret_array.concat(['AssociatedCampaignName']);
  }
  return ret_array.concat(['Impressions',
                           'Clicks',
                           'Ctr',
                           'AverageCpc',
                           'Cost',
                           'ConvertedClicks',
                           'ViewThroughConversions']);
}
 
//Based on the tab name, this returns the date range for the data.
function getDateRange(tab) {
  if(tab.indexOf('LM') >= 0) {
    return 'LAST_MONTH';
  }
  if(tab.indexOf('ABC123') >= 0) {
    return 'THIS_MONTH';
  }
  throw new Exception('tab name not recognized: '+tab);
}
