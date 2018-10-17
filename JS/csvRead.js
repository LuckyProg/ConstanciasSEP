
var csv = require('csv'); 
document.getElementById('fileInputCSV').focus();
var fileInputCSV = document.getElementById('fileInputCSV'); 
                  
fileInputCSV.addEventListener('change', function (e) {
    
    // parse as CSV
    var file = e.target.files[0];

    document.getElementById('labelin').innerHTML = "<i class='material-icons'>cloud_upload</i>&nbsp;"+file.name;

    var ext = "xml";

    if(!ext.localeCompare(file.name.substring(file.name.length-3, file.name.length))){
        document.getElementById('fileExport').innerHTML = "<i class='material-icons'>check_circle</i>&nbsp;Generar XML</button>";
        document.getElementById('fileExport').style.background = "#1b5e20";
    }
    else{
        document.getElementById('fileExport').innerHTML = "<i class='material-icons'>highlight_off</i>&nbsp;Archivo no compatible</button>";
    }

});
 