
const storage = require('electron-json-storage');

const csv=require('csvtojson');

var js2xmlparser = require("js2xmlparser");

var fs = require('fs');

const {shell} = require('electron');

const {dialog} = require('electron').remote;

var infoinstitucion;
var inforesponsable;
var rutas;
var select = document.getElementById('alumnos');

var alumnos;

storage.has('infoinstitucion', function(error, hasKey) {

  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `infoinstitucion`');
  }else{
    storage.set('infoinstitucion', { idNombreInstitucion: '', idCampus: '', idEntidadFederativa: '', idLugarExpedicion: '' }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('infoinstitucion', function(error, data) {

    infoinstitucion = data;

    console.log(infoinstitucion);
    document.getElementById('idNombreInstitucion').value = infoinstitucion.idNombreInstitucion;
    document.getElementById('idCampus').value = infoinstitucion.idCampus;
    document.getElementById('idEntidadFederativa').value = infoinstitucion.idEntidadFederativa;
    document.getElementById('idLugarExpedicion').value = infoinstitucion.idLugarExpedicion;

});

storage.has('inforesponsable', function(error, hasKey) {

  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `inforesponsable`');
  }else{
    storage.set('inforesponsable', { nombre: '', primerApellido: '', segundoApellido: '', curp: '', idCargo: '' }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('inforesponsable', function(error, data) {

    inforesponsable = data;

    console.log(inforesponsable);
    document.getElementById('nombre').value = inforesponsable.nombre;
    document.getElementById('primerApellido').value = inforesponsable.primerApellido;
    document.getElementById('segundoApellido').value = inforesponsable.segundoApellido;
    document.getElementById('curp').value = inforesponsable.curp;
    document.getElementById('idCargo').value = inforesponsable.idCargo;

});

storage.has('rutas', function(error, hasKey) {

  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `rutas`');
  }else{
    storage.set('rutas', { csvAlumnos: '', csvAsignaturas: '', xml: '', alumnos:[], asignaturas:[] }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('rutas', function(error, data) {

    if (error) console.log(error);
    else{

        rutas = data;
        console.log(rutas);

        var archalum = "<option value='default' default>-- Seleccionar archivo de alumnos --</option>";

        var x;
        for(x=0; x<rutas.alumnos.length; x++){

            archalum = archalum + "<option value='"+rutas.alumnos[x]+"'>"+rutas.alumnos[x]+"</option>"

        }

        select.innerHTML = archalum;

    }
});

                  
select.addEventListener('change', function (e) {

    if(select.value != "default"){
    
        document.getElementById('generar').innerHTML = "<i class='material-icons'>check_circle</i>&nbsp;Generar XML</button>";
        document.getElementById('generar').style.background = "#1b5e20";
        document.getElementById('generar').disabled = false;

    }

});

function actualizar(campo, tipo){

    var nuevo = document.getElementById(campo).value;
    
    if(tipo){

        console.log("institucion "+campo+": "+nuevo);
        infoinstitucion[campo] = nuevo;
        storage.set('infoinstitucion', infoinstitucion, function(error) {
          if (error) console.log(error);
        });

    }
    else{

        console.log("Responsable "+campo+": "+nuevo);
        inforesponsable[campo] = nuevo;
        storage.set('inforesponsable', inforesponsable, function(error) {
          if (error) console.log(error);
        });

    }

}

//leer CSV

function leer(){

    console.log(rutas.csvAlumnos+"/"+select.value+".csv");
    csv()
    .fromFile(rutas.csvAlumnos+"/"+select.value+".csv")
    .then((jsonObj)=>{
        alumnos = jsonObj;
        tabla();
    });

}

function tabla(){

    var datos = "";

    for(x=0;x<alumnos.length;x++){

        datos = datos+"<tr>"+"<td><input type='checkbox'></td>";
        datos = datos+"<td>"+alumnos[x].numeroControl+"</td>";
        datos = datos+"<td>"+alumnos[x].curp+"</td>";
        datos = datos+"<td>"+alumnos[x].nombre+"</td>";
        datos = datos+"<td>"+alumnos[x].primerApellido+"</td>";
        datos = datos+"<td>"+alumnos[x].segundoApellido+"</td>";
        datos = datos+"<td>"+alumnos[x].idGenero+"</td>";
        datos = datos+"<td>"+alumnos[x].fechaNacimiento+"</td>";
        datos = datos+"<td id='asig'><input type='file' class='fileInput' id='fileInput"+x+"' onchange=\"ponerNombre('labe"+x+"','fileInput"+x+"')\";/><label for='fileInput"+x+"' id='labe"+x+"' class='labelin2'><i class='material-icons'>cloud_upload</i>&nbsp;Elegir archivo</label></td>";
        datos = datos+"<td id='asig'><button id='confi' onclick='generar("+x+");'>Confirmar</button></td>"+"</tr>";

    }

    document.getElementById('archivero').innerHTML = 
    "<a href='generacionXML.html'><i class='material-icons'>arrow_back_ios</i></a>"+
    "<center>"+
    "   <table>"+
    "       <tr>"+
    "           <th></th>"+
    "           <th>numeroControl</th>"+
    "           <th>curp</th>"+
    "           <th>nombre</th>"+
    "           <th>primerApellido</th>"+
    "           <th>segundoApellido</th>"+
    "           <th>idGenero</th>"+
    "           <th>fechaNacimiento</th>"+
    "           <th>Asignaturas</th>"+
    "           <th></th>"+
    "       </tr>"+
    datos+
    "   </table>"
    "</center>";

}

function ponerNombre(labe, f){

    var fullPath = document.getElementById(f).value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        document.getElementById(labe).style.background = "#e8f5e9";
        document.getElementById(labe).innerHTML = "<i class='material-icons'>insert_drive_file</i>&nbsp;"+filename;
    }

}

//generar XML

var content;

var options = {"include": true, "version": "1.0", "encoding": "utf-8", "standalone": "yes"};

function generar(x){

    try{

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
                    "idNombreInstitucion": infoinstitucion.idNombreInstitucion,
                    "idCampus": infoinstitucion.idCampus,
                    "idEntidadFederativa": infoinstitucion.idEntidadFederativa
                },
                "Responsable": {
                    "@":{
                        "nombre": inforesponsable.nombre,
                        "primerApellido": inforesponsable.primerApellido,
                        "segundoApellido": inforesponsable.segundoApellido,
                        "curp": inforesponsable.curp,
                        "idCargo": inforesponsable.idCargo
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
                    "idLugarExpedicion": infoinstitucion.idLugarExpedicion
                }
            },
            "Asignaturas": {
                "@": {
                    "total": "#",
                    "asignadas": "#",
                    "promedio":"#"
                },
                "Asignatura": [
                    
                ]
            }

        };

        var asigns;
        var asign;

        var fullPath = document.getElementById('fileInput'+x).value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            csv()
            .fromFile(rutas.csvAsignaturas+"/"+filename)
            .then((jsonObj)=>{
                asigns = jsonObj;
                var i;
                for(i=0;i<asigns.length;i++){

                    asign = {
                        "@": {
                            "idAsignatura": asigns[i].idAsignatura,
                            "ciclo": asigns[i].ciclo,
                            "calificacion": asigns[i].calificacion,
                            "idObservaciones": asigns[i].idObservaciones
                        }
                    };

                      obj.Asignaturas.Asignatura.push(asign);
                }

                content = js2xmlparser.parse("Dec", obj, {declaration: {encoding: 'utf-8', standalone: 'yes'}});
                console.log(content);
                guardar(x);
            });
        }
        
    }catch(e){
        console.log('Failed to save the file ! '+e); 
        dialog.showErrorBox("Falla en la generacion de archivos XML.", err.message);
    }

}

function guardar(x){

    try { 
        fs.writeFileSync(rutas.xml+'/'+alumnos[x].nombre+alumnos[x].primerApellido+alumnos[x].segundoApellido+'.xml', content, 'utf-8'); 
        console.log('Guardado exitoso');
        terminar(x);
    }
    catch(e){
        console.log('Failed to save the file ! '+e); 
        dialog.showErrorBox("Falla en la generacion de archivos XML.", err.message);
    }

}

function terminar(x){

    shell.showItemInFolder(rutas.xml+'/'+alumnos[x].nombre+alumnos[x].primerApellido+alumnos[x].segundoApellido+'.xml');

    const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'], message: 'Archivo XML generado correctamente.'};

    dialog.showMessageBox(dialogOptions, i => console.log(i));

}







