
const storage = require('electron-json-storage');

const {shell} = require('electron');

var fs = require('fs');

var rutas;
var csvAlumnos;
var csvAsignaturas;
var xml;
  
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

        var datosCarrera = "";
        for(x=0; x<carreras.carrera.length; x++){

            datosCarrera = datosCarrera + 
            "<tr>"+
                "<td>"+carreras.carrera[x].nombre+"</td>"+
                "<td>"+carreras.carrera[x].id+"</td>"+
                "<td id='especial'><button id='mod' onclick='editarCarrera("+x+");'><i class='material-icons'>create</i></button>"+
                "<button id='eli' onclick='eliminarCarrera("+x+");'><i class='material-icons'>restore_from_trash</i></button></td>"+
            "</tr>";

        }

        document.getElementById('tableCarreras').innerHTML = 
        "<tr class='header'>"+
            "<th colspan='3'>Carreras</th>"+
        "</tr>"+
        "<tr>"+
            "<td id='especial'><input type='text' id='nuevaCarreraNom' placeholder='Nombre'></td>"+
            "<td id='especial'><input type='text' id='nuevaCarreraId' placeholder='id'></td>"+
            "<td id='especial' colspan='2'><button id='agregar' onclick='agregarCarrera();'><i class='material-icons'>add</i></button></td>"+
        "</tr>"+datosCarrera;

        var datosAsig = "";
        for(x=0; x<carreras.asignatura.length; x++){

            datosAsig = datosAsig + 
            "<tr>"+
                "<td>"+carreras.asignatura[x].nombre+"</td>"+
                "<td>"+carreras.asignatura[x].id+"</td>"+
                "<td id='especial'><button id='mod' onclick='editarAsignaturas("+x+");'><i class='material-icons'>create</i></button>"+
                "<button id='eli' onclick='eliminarAsignaturas("+x+");'><i class='material-icons'>restore_from_trash</i></button></td>"+
            "</tr>";

        }

        document.getElementById('tableAsig').innerHTML = 
        "<tr class='header'>"+
            "<th colspan='3'>Asignaturas</th>"+
        "</tr>"+
        "<tr>"+
            "<td id='especial'><input type='text' id='nuevaAsigNom' placeholder='Nombre'></td>"+
            "<td id='especial'><input type='text' id='nuevaAsigId' placeholder='id'></td>"+
            "<td id='especial'><button id='agregar' onclick='agregarAsignaturas();'><i class='material-icons'>add</i></button></td>"+
        "</tr>"+datosAsig;

    }
});

function agregarCarrera(){

    var nomCar = document.getElementById('nuevaCarreraNom').value;
    var idCar = document.getElementById('nuevaCarreraId').value;
    carreras.carrera.unshift({nombre: nomCar, id: idCar});
    storage.set('carreras', carreras, function(error) {
      if (error) console.log(error);
    });
    location.replace("asignaturas.html");

}

function editarCarrera(x){

    //shell.openItem(rutas.csvAlumnos+"/"+rutas.alumnos[x]+".csv");

}

function eliminarCarrera(x){

    console.log(x);

    carreras.carrera.splice(x,1);
    storage.set('carreras', carreras, function(error) {
      if (error) console.log(error);
    });
    location.replace("asignaturas.html");

}

function buscarCarrera() {

    var input, filter, table, tr, td, i;
    input = document.getElementById("busCarrera");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableCarreras");
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

function agregarAsignaturas(){

    var nomAsig = document.getElementById('nuevaAsigNom').value;
    var idAsig = document.getElementById('nuevaAsigId').value;
    carreras.asignatura.unshift({nombre: nomAsig, id: idAsig});
    storage.set('carreras', carreras, function(error) {
      if (error) console.log(error);
    });
    location.replace("asignaturas.html");

}

function editarAsignaturas(x){

    //shell.openItem(rutas.csvAsignaturas+"/"+rutas.asignaturas[x]+".csv");

}

function eliminarAsignaturas(x){

    carreras.asignatura.splice(x,1);
    storage.set('carreras', carreras, function(error) {
      if (error) console.log(error);
    });
    location.replace("asignaturas.html");

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


















