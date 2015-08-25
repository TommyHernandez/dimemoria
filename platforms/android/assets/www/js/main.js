/**
 * di memoria its a simple webapp developed using Cordova take notes with custom color and priority
 * 
 * @name dimemoria
 * @version 0.5
 * @requires jQuery v2.1.4+
 * @author Pedro Tomás Hernández
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * http://github.com/
 *
 * Copyright (c) 2015, Pedro T. Hernandez (http://pthernandes.es)
 */
/*
 * Recibe la clave que tiene en el localStorege y el objetod e la nota recueparado, la funcion lo añade al listado de notas
 */
function addStickyToDOM(key, objeto) {
    var notas = document.getElementById("notas");
    var nota = document.createElement("div");
    /*En caso de que el fondo sea Blanco o muy claro el titulo debera de aparecer en negro o en gris oscuro, esto tambien hay que pulirlo*/
    if (objeto.fondo == "#ffffff" || objeto.fondo == "#eeeeee" || objeto.fondo == "#fffffe" || objeto.fondo == "#fffefe") {
        var title = document.createElement("h2");
    } else {
        var title = document.createElement("h3");
    }
    var span = document.createElement("span");
    var prior = document.createElement("div");
    var footer = document.createElement("div");
    prior.setAttribute("class", comprobarPrioridad(objeto.prioridad));
    /* En caso de que el fondo sea negro pondremos la letra en color blanco, esto va a haber que pulirlo...*/
    nota.setAttribute("style", "background-color:" + objeto.fondo);
    if (objeto.fondo == "#000000" || objeto.fondo == "#111111") {
        span.classList.add("letra-w");
    } else if (objeto.fondo == "#333333" || objeto.fondo == "#555555") {
        span.classList.add("letra-w");
    }
    /*En caso de que el fondo sea Blanco o muy claro el titulo debera de aparecer en negro o en gris oscuro, esto tambien hay que pulirlo*/
    if (objeto.fondo == "#FFFFFF" || objeto.fondo == "#EEEEEE") {

    } else if (objeto.fondo == "#FFFFFE" || objeto.fondo == "#FFEEEE") {

    } // fin if
    nota.setAttribute("class", "nota");
    nota.setAttribute("id", key);
    span.textContent = objeto.nota;
    title.textContent = objeto.titulo;
    nota.appendChild(title);
    nota.appendChild(span);
    nota.appendChild(prior);
    notas.appendChild(nota);
    /*Para poder aplicar la funcion de Jquery*/
    $('#' + key).on('doubletap', editNote);
    $('#' + key).dblclick(editNote);
    $('#' + key).longpress(menuDelete);

}
/* Creamos la nota la añadimos al LocalStorage y al dom*/
function createSticky() {
    var note = document.getElementById("contenido").value;
    var titulo = document.getElementById('titulo').value;
    var fondo = document.getElementById('backColor').value;
    var prioridad = $("#prioridad").val();
    var key = "nota_" + localStorage.length * 2;
    var objeto = {
        titulo: titulo,
        nota: note,
        prioridad: prioridad,
        fondo: fondo
    }
    localStorage.setItem(key, JSON.stringify(objeto));
    addStickyToDOM(key, objeto);
}
/*Funciones asociadas al movil de momento vacio*/
function onDeviceReady() {

}
/*Selección Edicion o borrado*/
function menuDelete() {
    var id = $(this).attr('id');
    if (confirm("¿Quieres eliminar realmenta la " + id + "?")) {
        localStorage.removeItem(id);
        navigator.notification.alert(
            'Se ha borrado' + id,
            function () {},
            'Borrar nota',
            'OK'
        );
        location.reload(true);
        destroyDOM();
        loadDOM();
    }
}

function editNote() {
    var id = this.id;
    var value = localStorage.getItem(id);
    var objeto = JSON.parse(value);
    $('#titulo-e').val(objeto.titulo);
    $('#contenido-e').val(objeto.nota);
    $('#backColor-e').val(objeto.fondo);
    $("#prioridad-e").val(objeto.prioridad);
    formEditNota();
    $("#editar").on('click', function () {
        var note = document.getElementById("contenido-e").value;
        var titulo = document.getElementById('titulo-e').value;
        var fondo = document.getElementById('backColor-e').value;
        var prioridad = $("#prioridad-e").val();
        var key = $("#" + id).attr('id');
        var objeto = {
            titulo: titulo,
            nota: note,
            prioridad: prioridad,
            fondo: fondo
        }
        localStorage.setItem(key, JSON.stringify(objeto));
        addStickyToDOM(key, objeto);
    })
}
/* El dialogo para los valores de la nota*/
function dialogNota() {
    $('#formNota').slideDown();
}

function formEditNota() {
    $('#formEdit').show();
}
// Cerrar el formulario de editar y añadir
function dismisForm() {
    $('#formNota').hide();
}

function cerrarFormEdit() {
    $('#formEdit').hide();
}
/*Funcion que elimina todas las notas del Storage, tras hacerlo reinicia el DOM*/


function clearStorage() {
    if (confirm("Se eliminarán todas las notas ¿Estas seguro?")) {
        localStorage.clear();
        destroyDOM(); // borra el DOM
    }
}
/* navigator alert para el About*/
function aboutDialog() {
    navigator.notification.alert(
        "Di memoria Desarrollado por Pedro Tomás Hernández   Logotipo by Mockva",
        function () {},
        "Sobre la app",
        "Moola"
    );
}
// Funcion que rellena el DOM
/*
    Esta funcion solo rellena el DOM por lo que antes de invocarla siempre debe de estar el nodo NOTAS limpio, para no duplicar
    vease funcion destroyDOM();
*/
function loadDOM() {
    if (localStorage.length != 0) {
        //Leemos localStorage siempre que no este vacio parsearemos el objeto JSON
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 4) == "nota") {
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                var objeto = JSON.parse(value);
                addStickyToDOM(key, objeto);
            }
        }
    }
}
/* Solo la invocamos cuando hay que limpiar el nodo NOTAS*/
function destroyDOM() {
    document.getElementById('notas').innerHTML = "";
}
//Fin funciones DOM
/*
 * Este metodo comprieba la prioridad de la nota y nos devuelve el conjuntonde clases
Baja
Normal
Alta
A tope
 */
function comprobarPrioridad(prioridad) {
    switch (prioridad) {

    case "baja":
        return "prioridad green";
        break;
    case "normal":
        return "prioridad grey";
        break;
    case "alta":
        return "prioridad orange";
        break;

    case "a tope":
        return "prioridad red"
        break;
    case "trivial":
        return "prioridad blue";
        break;

    }
}
/*Funciones para archivar, en prioncipio solo se va a guardar el tutorial, y no se guarda en realidad*/
function archivar() {
    if (confirm("Esta nota se va a archivar y podrá verla accediendo al menú lateral")) {
        $('#tutorial').addClass('oculto');
        localStorage.setItem("tutorial", 1);
    }
}

function desarchivar() {
    $("#tutorial").removeClass('oculto');
    localStorage.setItem("tutorial", 0);
}
//
//Funcion inicial para cuando el dom este listo
function init() {
    $('#tuto').on('click', desarchivar);
    /*Comprovamos si el tutorial esta archivado*/
    if (localStorage.getItem("tutorial") == 1) {
        $("#tutorial").addClass('oculto');

    } else {
        $("#tutorial").on('click', archivar);
    }
    $('#formNota').hide();
    $('#formEdit').hide();
    /*Escuchadores y sus funciones asociadas*/
    document.addEventListener('deviceready', onDeviceReady, false);
    var button = document.getElementById("add_button").addEventListener("click", dialogNota, false);
    document.getElementById('rmAll').addEventListener("click", clearStorage, false);
    //Botones del formulario de añadir
    document.getElementById("add").addEventListener("click", createSticky);
    document.getElementById("cancel").addEventListener("click", dismisForm, false);
    document.getElementById('about').addEventListener('click', aboutDialog, false);
    $("#cancelarEdit").on('click', cerrarFormEdit);
    //Cargamos notas al dom si storage != 0
    loadDOM();

}
window.onload = init;