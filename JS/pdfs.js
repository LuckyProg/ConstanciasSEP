
const storage = require('electron-json-storage');

const csv=require('csvtojson');

var fs = require('fs');

const {shell} = require('electron');

const {dialog} = require('electron').remote;

var infoinstitucion;
var inforesponsable;
var rutas;
var select = document.getElementById('alumnos');

var alumnos;

storage.has('infoinstitucionpdf', function(error, hasKey) {

  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `infoinstitucionpdf`');
  }else{
    storage.set('infoinstitucionpdf', { NombreInstitucion: '', LugarExpedicion: '' }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('infoinstitucionpdf', function(error, data) {

    infoinstitucion = data;

    console.log(infoinstitucion);
    document.getElementById('NombreInstitucion').value = infoinstitucion.NombreInstitucion;
    document.getElementById('LugarExpedicion').value = infoinstitucion.LugarExpedicion;

});

storage.has('inforesponsablepdf', function(error, hasKey) {

  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `inforesponsablepdf`');
  }else{
    storage.set('inforesponsablepdf', { nombre: '', Cargo: '' }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('inforesponsablepdf', function(error, data) {

    inforesponsable = data;

    console.log(inforesponsable);
    document.getElementById('nombre').value = inforesponsable.nombre;
    document.getElementById('Cargo').value = inforesponsable.Cargo;

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
        storage.set('infoinstitucionpdf', infoinstitucion, function(error) {
          if (error) console.log(error);
        });

    }
    else{

        console.log("Responsable "+campo+": "+nuevo);
        inforesponsable[campo] = nuevo;
        storage.set('inforesponsablepdf', inforesponsable, function(error) {
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
        datos = datos+"<td>"+alumnos[x].nombre+"</td>";
        datos = datos+"<td>"+alumnos[x].primerApellido+"</td>";
        datos = datos+"<td>"+alumnos[x].segundoApellido+"</td>";
        datos = datos+"<td>Psicologia</td>";
        datos = datos+"<td id='asig'><button id='confi' onclick='generar("+x+");'>Confirmar</button></td>"+"</tr>";

    }

    document.getElementById('archivero').innerHTML = 
    "<a href='generacionPDF.html'><i class='material-icons'>arrow_back_ios</i></a>"+
    "<center>"+
    "   <table>"+
    "       <tr>"+
    "           <th></th>"+
    "           <th>Nombre</th>"+
    "           <th>Primer apellido</th>"+
    "           <th>Segundo apellido</th>"+
    "           <th>Carrera</th>"+
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

function generar(x){

    try{

        content = "hola";
        var PDFDocument, doc;
        var fs = require('fs');
        PDFDocument = require('pdfkit');
        doc = new PDFDocument;
        doc.pipe(fs.createWriteStream(rutas.xml+'/'+alumnos[x].nombre+alumnos[x].primerApellido+alumnos[x].segundoApellido+'.pdf'));
        // PDF Creation logic goes here
        // Set a title and pass the X and Y coordinates
        doc.font('Times-BoldItalic');
        doc.fontSize(20).text(infoinstitucion.NombreInstitucion, {align: 'center'});
        doc.moveDown(1);
        doc.font('Times-Italic');
        doc.fontSize(16).text('otorga a', {align: 'center'});
        doc.moveDown(0.5);
        doc.font('Times-BoldItalic');
        doc.fontSize(18).text(alumnos[x].nombre+' '+alumnos[x].primerApellido+' '+alumnos[x].segundoApellido, {align: 'center'});
        doc.moveDown(0.5);
        doc.font('Times-Italic');
        doc.fontSize(16).text('el título de', {align: 'center'});
        doc.moveDown(0.5);
        doc.font('Times-BoldItalic');
        doc.fontSize(18).text('Psicología', {align: 'center'});
        doc.moveDown(0.5);
        doc.font('Times-Italic');
        doc.fontSize(16).text('Por haber acreditado todas las asignaturas de la Licenciatura en Psicología de esta Universidad.', {align: 'center'});
        doc.moveDown(8);
        doc.font('Times-Italic');
        doc.fontSize(18).text(inforesponsable.nombre, {align: 'center'});
        doc.moveDown(0.3);
        doc.fontSize(16).text(inforesponsable.Cargo, {align: 'center'});
        /*
        doc.text('otorga a \n\n '+alumnos[x].nombre+' '+alumnos[x].primerApellido+' '+alumnos[x].segundoApellido+
            '\n\n el titulo de \n\n Psicología \n\n\n\n\n\n\n\n'+inforesponsable.nombre+'\n'+inforesponsable.Cargo, {
            width: 500,
            align: 'center'
        });*/
        doc.end();
        alert('Archivo generado exitosamente.');
                
    }catch(e){
        console.log('Failed to save the file ! '+e); 
        dialog.showErrorBox("Falla en la generacion de archivos XML.", err.message);
    }

}