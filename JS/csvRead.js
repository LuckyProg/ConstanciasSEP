document.getElementById('fileInputCSV').focus();
var fileInputCSV = document.getElementById('fileInputCSV'); 
                  
fileInputCSV.addEventListener('change', function (e) {
    
    // parse as CSV
    var file = e.target.files[0];
    var csvParser = new SimpleExcel.Parser.CSV();
    csvParser.setDelimiter(',');
    csvParser.loadFile(file, function () {
        
        // draw HTML table based on sheet data
        /*var sheet = csvParser.getSheet();
        var table = document.getElementById('result');
        table.innerHTML = "";
        sheet.forEach(function (el, i) {                    
            var row = document.createElement('tr');
            el.forEach(function (el, i) {
                var cell = document.createElement('td');
                cell.innerHTML = el.value;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });   */                 
        
        // export when button clicked
        document.getElementById('fileExport').addEventListener('click', function (e) {                
            var tsvWriter = new SimpleExcel.Writer.TSV();
            tsvWriter.insertSheet(csvParser.getSheet(1));
            tsvWriter.saveFile();
        });

        // print to console just for quick testing
        /*console.log(csvParser.getSheet(1));
        console.log(csvParser.getSheet(1).getRow(1));
        console.log(csvParser.getSheet(1).getColumn(2));
        console.log(csvParser.getSheet(1).getCell(3, 1));
        console.log(csvParser.getSheet(1).getCell(2, 3).value); */
    });
});