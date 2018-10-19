
const csv=require('csvtojson');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
const {dialog} = require('electron').remote;

document.getElementById('fileInputCSV').focus();
var fileInputCSV = document.getElementById('fileInputCSV'); 
var file;
                  
fileInputCSV.addEventListener('change', function (e) {
    
    //obtener documento
    file = e.target.files[0];

    document.getElementById('labelin').innerHTML = "<i class='material-icons'>cloud_upload</i>&nbsp;"+file.name;

    var ext = "csv";

    if(!ext.localeCompare(file.name.substring(file.name.length-3, file.name.length))){
        document.getElementById('fileExport').innerHTML = "<i class='material-icons'>check_circle</i>&nbsp;Generar XML</button>";
        document.getElementById('fileExport').style.background = "#1b5e20";
    }
    else{
        const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'], message: 'Archivos XML generados correctamente.'};
        dialog.showMessageBox(dialogOptions, i => console.log(i));
    }

});

//leer CSV

var alumnos;

function leer(){

    console.log(file.path);
    csv()
    .fromFile(file.path)
    .then((jsonObj)=>{
        alumnos = jsonObj;
        generar();
    });

}

//generar XML

var content;

var options = {"include": true, "version": "1.0", "encoding": "utf-8", "standalone": "yes"};

function generar(){

    var x;

    try{
        for(x=0;x<alumnos.length;x++){
     
            console.log(x);
            var obj = {

                "@": {
                    "version": "1.0",
                    "tipoCertificado": "5",
                    "folioControl": "517816281",
                    "sello": "#",
                    "certificadoResponsable": "#",
                    "noCertificadoResponsable": "#",
                    "xmlns": "https://www.siged.sep.gob.mx/certificados/"
                },
                "Ipes": {
                    "@":{
                        "idNombreInstitucion": "vda6bahs8j",
                        "idCampus": "dvahjds6bj8",
                        "idEntidadfederativa": "bdjhada767"
                    },
                    "Responsable": {
                        "@":{
                            "nombre": "#",
                            "primerApellido": "#",
                            "segundoApellido": "#",
                            "curp": "#",
                            "idCargo": "dvdja6687"
                        }
                    }
                },
                "Rvoe": {
                    "@": {
                        "numero": "#",
                        "fechaExpedicion": "2018-01-10T00:00:00"
                    }
                },
                "Carrera": {
                    "@": {
                        "idCarrera": alumnos[x].idCarrera,
                        "idTipoPeriodo": alumnos[x].idTipoPeriodo,
                        "clavePlan": alumnos[x].clavePlan
                    }
                },
                "Alumno": {
                    "@": {
                        "numeroControl": alumnos[x].numeroControl,
                        "curp": alumnos[x].curp,
                        "nombre": alumnos[x].nombre,
                        "primerApellido": alumnos[x].primerApellido,
                        "segundoApellido": alumnos[x].segundoApellido,
                        "idGenero": alumnos[x].idGenero,
                        "fechaNacimiento": alumnos[x].fechaNacimiento+"T00:00:00"
                    }
                },
                "Expedicion": {
                    "@": {
                        "idTipoCertificado": "#",
                        "fecha": "1999-09-18T11:00:00",
                        "idLugarExpedicion":"#"
                    }
                },
                "Asignaturas": {
                    "@": {
                        "total": "#",
                        "asignadas": "#",
                        "promedio":"#"
                    },
                    "Asignatura": [
                        {
                            "@": {
                                "idAsignatura": "#",
                                "ciclo": "2012-4",
                                "calificacion": "#",
                                "idObservaciones": "#"
                            }
                        },
                        {
                            "@": {
                                "idAsignatura": "#",
                                "ciclo": "2012-4",
                                "calificacion": "#",
                                "idObservaciones": "#"
                            }
                        },
                        {
                            "@": {
                                "idAsignatura": "#",
                                "ciclo": "2012-4",
                                "calificacion": "#",
                                "idObservaciones": "#"
                            }
                        }
                    ]
                }

            };

            content = js2xmlparser.parse("Dec", obj, {declaration: {encoding: 'utf-8', standalone: 'yes'}});
            console.log(content);
            guardar(alumnos[x].nombre+" "+alumnos[x].primerApellido+" "+alumnos[x].segundoApellido);
        }
    }catch(e){
        console.log('Failed to save the file ! '+e); 
        dialog.showErrorBox("Falla en la generacion de archivos XML.", err.message);
    }

    terminar();

}

function guardar(nombreAlumno){

    try { 
        fs.writeFileSync('XML/'+nombreAlumno+'.xml', content, 'utf-8'); 
        console.log('Guardado exitoso');
    }
    catch(e){
        console.log('Failed to save the file ! '+e); 
        dialog.showErrorBox("Falla en la generacion de archivos XML.", err.message);
    }

}

function terminar(){

    const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'], message: 'Archivos XML generados correctamente.'};

    dialog.showMessageBox(dialogOptions, i => console.log(i));

}







