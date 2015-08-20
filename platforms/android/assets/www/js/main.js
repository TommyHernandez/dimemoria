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
    nota.setAttribute("data-title", objeto.titulo);
    nota.setAttribute("data-content", objeto.nota);
    span.textContent = objeto.nota;
    title.textContent = objeto.titulo;
    nota.appendChild(title);
    nota.appendChild(span);
    notas.appendChild(nota);
    /*Para poder aplicar la funcion de Jquery*/
    $('#' + key).dblclick(editNote);
    var pressTimer;
    $('#' + key).longpress(menuDelete);
}
/* Creamos la nota la añadimos al LocalStorage y al dom*/
function createSticky() {
    var note = document.getElementById("contenido").value;
    var titulo = document.getElementById('titulo').value;
    var fondo = document.getElementById('backColor').value;
    var prioridad = $("#prioridad").val();
    var key = "nota_" + localStorage.length;
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
            alertDismissed,
            'Borrar nota',
            'OK'
        );

        destroyDOM();
        loadDOM();
    }
}

function editNote() {
    var id = this.id;
    $('#titulo-e').val($("#" + id).data('title'));
    $('#contenido-e').val($("#" + id).data('content'));
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
    var formulario = document.getElementById('formNota');
    formulario.classList.remove('oculto');
    formulario.classList.add('tocenter');
    $('#formNota').addClass('animated slideInUp');
}

function formEditNota() {
    var formulario = document.getElementById('formEdit');
    formulario.classList.remove('oculto');
    formulario.classList.add('tocenter');
    $('#formEdit').addClass('animated slideInUp');
}
// Cerrar el formulario de editar y añadir
function dismisForm() {
    $('#formNota').addClass('animated slideOutDown');
    $('#formNota').removeClass('tocenter');
    $('#formNota').addClass('oculto');
}

function cerrarFormEdit() {
    $('#formEdit').addClass('animated slideOutDown');
    $('#formEdit').removeClass('tocenter');
    $('#formEdit').addClass('oculto');
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
        alertDismissed,
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