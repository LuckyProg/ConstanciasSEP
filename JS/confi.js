
const storage = require('electron-json-storage');

const dataPath = storage.getDataPath();
console.log(dataPath);

var rutas;
var csvAlumnos;
var csvAsignaturas;
var xml;
var r1 = false, r2 = false, r3 = false;

var file;

  
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
  console.log(data);
  rutas = data;
  document.getElementById('lAlumnos').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+rutas.csvAlumnos;
  document.getElementById('lAsignaturas').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+rutas.csvAsignaturas;
  document.getElementById('lxml').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+rutas.xml;
});
                  
document.getElementById('csvAlumnos').addEventListener('change', function (e) {
    
    //obtener documento
    file = e.target.files[0];
    csvAlumnos = file.path;
    r1 = true;
    document.getElementById('lAlumnos').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+file.path;

});

document.getElementById('csvAsignaturas').addEventListener('change', function (e) {
    
    //obtener documento
    file = e.target.files[0];
    csvAsignaturas = file.path;
    r2 = true;
    document.getElementById('lAsignaturas').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+file.path;

});

document.getElementById('xml').addEventListener('change', function (e) {
    
    //obtener documento
    file = e.target.files[0];
    xml = file.path;
    r3 = true;
    document.getElementById('lxml').innerHTML = "<i class='material-icons'>folder</i>&nbsp;"+file.path;

});

function resetear(){

	rutas.csvAlumnos = "";
	rutas.csvAsignaturas = "";
	rutas.xml = "";

	storage.set('rutas', rutas, function(error) {
	  if (error) console.log(error);
	});

	location.replace("configuracion.html");

}

function guardar(){

	if(r1) rutas.csvAlumnos = csvAlumnos;
	if(r2) rutas.csvAsignaturas = csvAsignaturas;
	if(r3) rutas.xml = xml;
	console.log(rutas);
	storage.set('rutas', rutas, function(error) {
	  if (error) console.log(error);
	});

	location.replace("configuracion.html");

}

















