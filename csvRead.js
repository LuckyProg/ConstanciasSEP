
document.getElementById('fileInputCSV').focus();
var fileInputCSV = document.getElementById('fileInputCSV'); 

var file;
                  
fileInputCSV.addEventListener('change', function (e) {
    
    // parse as CSV
    file = e.target.files[0];

    document.getElementById('labelin').innerHTML = "<i class='material-icons'>cloud_upload</i>&nbsp;"+file.name;

    var ext = "csv";

    if(!ext.localeCompare(file.name.substring(file.name.length-3, file.name.length))){
        document.getElementById('fileExport').innerHTML = "<i class='material-icons'>check_circle</i>&nbsp;Generar XML</button>";
        document.getElementById('fileExport').style.background = "#1b5e20";
    }
    else{
        document.getElementById('fileExport').innerHTML = "<i class='material-icons'>highlight_off</i>&nbsp;Archivo no compatible</button>";
    }

});

const csvFilePath='/XML/prueba.xml';
const csv=require('csvtojson');

function leer(){

    console.log(file.path);
    csv()
    .fromFile(file.path)
    .then((jsonObj)=>{
        console.log(jsonObj);
        
    });

}


