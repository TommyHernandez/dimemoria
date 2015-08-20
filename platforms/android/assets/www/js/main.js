/*
 * En esta funcion le pasamos la key del locals storage, el titulo de la nota y su contenido para crear los nodos del dom
 */
function addStickyToDOM(key, objeto) {
    var notas = document.getElementById("notas");
    var nota = document.createElement("div");
    var title = document.createElement("h3");
    var span = document.createElement("span");
    var footer = document.createElement("div");
    nota.setAttribute("style", "background-color:" + objeto.fondo);
    nota.setAttribute("class", "nota");
    nota.setAttribute("id", key);
    span.textContent = objeto.nota;
    title.textContent = objeto.titulo;
    nota.appendChild(title);
    nota.appendChild(span);
    notas.appendChild(nota);
    /*Para poder aplicar la funcion de Jquery*/
    $('#' + key).on('doubletap', editNote);
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
    if (confirm("Quieres Eliminar realmenta la" + id + "?")) {
        localStorage.removeItem(id);
        navigator.notification.alert(
            'Se ha borrado' + id,
            function () {},
            'Borrar nota',
            'OK'
        );
        // navigator.notification.beep(2);
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
    localStorage.clear();
    destroyDOM(); // borra el DOM
}
/* navigator alert para el About*/
function aboutDialog() {
    navigator.notification.alert(
        "Di memoria Desarrollado por Pedro Tomás Hernández",
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
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var objeto = JSON.parse(value);
            addStickyToDOM(key, objeto);

        }
    }
}
/* Solo la invocamos cuando hay que limpiar el nodo NOTAS*/
function destroyDOM() {
    document.getElementById('notas').innerHTML = "";
}
//Fin funciones DOM
//Funcion inicial para cuando el dom este listo
function init() {
    $('#formNota').hide();
    $('#formEdit').hide();
    /*Escuchadores y sus funciones asociadas*/
    document.addEventListener('deviceready', onDeviceReady, false);
    var button = document.getElementById("add_button").addEventListener("click", dialogNota);
    document.getElementById('rmAll').addEventListener("click", clearStorage);
    //Botones del formulario de añadir
    document.getElementById("add").addEventListener("click", createSticky);
    document.getElementById("cancel").addEventListener("click", dismisForm);
    document.getElementById('about').addEventListener('click', aboutDialog);
    $("#cancelarEdit").on('click', cerrarFormEdit);
    //Cargamos notas al dom si storage != 0
    loadDOM();

}
window.onload = init;