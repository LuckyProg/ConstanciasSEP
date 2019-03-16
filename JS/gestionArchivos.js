
const storage = require('electron-json-storage');

const {shell} = require('electron');

var fs = require('fs');

var rutas;
var csvAlumnos;
var csvAsignaturas;
var xml;
var carreras;
  
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
        var x;

        var archalum = "";
        for(x=0; x<rutas.alumnos.length; x++){

            archalum = archalum + 
            "<tr>"+
                "<td>"+rutas.alumnos[x]+".csv</td>"+
                "<td id='especial'><button id='mod' onclick='editarAlumnos("+x+");'><i class='material-icons'>create</i></button>"+
                "<button id='eli' onclick='eliminarAlumnos("+x+");'><i class='material-icons'>restore_from_trash</i></button></td>"+
            "</tr>";

        }

        document.getElementById('tableAlum').innerHTML = 
        "<tr class='header'>"+
            "<th colspan='2'>Datos de alumnos</th>"+
        "</tr>"+
        "<tr>"+
            "<td id='especial'><input type='text' id='nuevoAlum' placeholder='Nuevo archivo'></td>"+
            "<td id='especial'><button id='agregar' onclick='agregarAlumnos();'><i class='material-icons'>add</i></button></td>"+
        "</tr>"+archalum;

        var archasig = "";
        for(x=0; x<rutas.asignaturas.length; x++){

            archasig = archasig + 
            "<tr>"+
                "<td>"+rutas.asignaturas[x]+".csv</td>"+
                "<td id='especial'><button id='mod' onclick='editarAsignaturas("+x+");'><i class='material-icons'>create</i></button>"+
                "<button id='eli' onclick='eliminarAsignaturas("+x+");'><i class='material-icons'>restore_from_trash</i></button></td>"+
            "</tr>";

        }

        document.getElementById('tableAsig').innerHTML = 
        "<tr class='header'>"+
            "<th colspan='2'>Asignaturas de alumnos</th>"+
        "</tr>"+
        "<tr>"+
            "<td id='especial'><input type='text' id='nuevaAsig' placeholder='Nuevo archivo'></td>"+
            "<td id='especial'><button id='agregar' onclick='showModal();'><i class='material-icons'>add</i></button></td>"+
        "</tr>"+archasig;

    }
});

function agregarAlumnos(){

    var nomar = document.getElementById('nuevoAlum').value;
    rutas.alumnos.unshift(nomar);
    storage.set('rutas', rutas, function(error) {
      if (error) console.log(error);
    });
    var content = 'idCarrera,idTipoPeriodo,clavePlan,numeroControl,curp,nombre,primerApellido,segundoApellido,idGenero,fechaNacimiento\n'+
                ' , , , , , , , , , ';
    fs.writeFileSync(rutas.csvAlumnos+'/'+nomar+'.csv', content, 'utf-8');
    location.replace("gestion.html");

}

function editarAlumnos(x){

    shell.openItem(rutas.csvAlumnos+"/"+rutas.alumnos[x]+".csv");

}

function eliminarAlumnos(x){

    console.log(x);

    shell.moveItemToTrash(rutas.csvAlumnos+'/'+rutas.alumnos[x]+'.csv');
    rutas.alumnos.splice(x,1);
    storage.set('rutas', rutas, function(error) {
      if (error) console.log(error);
    });
    location.replace("gestion.html");

}

function buscarAlumnos() {

    var input, filter, table, tr, td, i;
    input = document.getElementById("busalu");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableAlum");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }

}

storage.has('carreras', function(error, hasKey) {
  if (error) console.log(error);
 
  if (hasKey) {
    console.log('There is data stored as `carreras`');
  }else{
    storage.set('carreras', { carrera:[{nombre: '', id:''}], asignatura:[{nombre: '', id:''}] }, function(error) {
      if (error) console.log(error);
    });
  }

});

storage.get('carreras', function(error, data) {
    if (error) console.log(error);
    else{
        carreras = data;
        var x;

        var datosAsig = "";
        for(x=0; x<carreras.asignatura.length; x++){

            datosAsig = datosAsig + 
            "<li><input type='checkbox' id='"+x+"'>&nbsp;"+carreras.asignatura[x].nombre+"</li>"

        }
        document.getElementById('Mcontent').innerHTML = 
        "<span class='close'>&times;</span><h4>Seleccionar asignaturas del alumno:</h4>"+
        "<ul>"+datosAsig+"</ul>"+
        "<button onclick='agregarAsignaturas();'>Agregar</button>";
    }
});

function agregarAsignaturas(){

    var nomas = document.getElementById('nuevaAsig').value;
    rutas.asignaturas.unshift(nomas);
    storage.set('rutas', rutas, function(error) {
      if (error) console.log(error);
    });
    var content = 'nombreAsignatura,idAsignatura,ciclo,calificacion,idObservaciones\n';
    var x;
    for(x = 0; x < carreras.asignatura.length; x++){
        if(document.getElementById(''+x+'').checked) 
            content = content+carreras.asignatura[x].nombre+','+carreras.asignatura[x].id+',,,\n';
    }
    fs.writeFileSync(rutas.csvAsignaturas+'/'+nomas+'.csv', content, 'utf-8');
    location.replace("gestion.html");

}

function editarAsignaturas(x){

    shell.openItem(rutas.csvAsignaturas+"/"+rutas.asignaturas[x]+".csv");

}

function eliminarAsignaturas(x){

    console.log(x);

    shell.moveItemToTrash(rutas.csvAsignaturas+'/'+rutas.asignaturas[x]+'.csv');
    rutas.asignaturas.splice(x,1);
    storage.set('rutas', rutas, function(error) {
      if (error) console.log(error);
    });
    location.replace("gestion.html");

}

function buscarAsignaturas() {

    var input, filter, table, tr, td, i;
    input = document.getElementById("busasig");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableAsig");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }

}

var modal = document.getElementById('myModal');

var span = document.getElementsByClassName("close")[0];

function showModal() {
    modal.style.display = 'block';
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

















