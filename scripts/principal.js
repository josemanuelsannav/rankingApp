document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('player-form');
    const empezarButton = document.getElementById('go-to-view2');
    const upload_dataButton = document.getElementById("upload");
    const fileInput = document.getElementById('fileInput');



    /**
     * 
     * @returns {number} Devuelve un número único para el id de un jugador
     */
    function obtenerIdUnico() {
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        const ids = jugadores.map(jugador => jugador.id);
        const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        return nuevoId;
    }

    /*
    Crear un Jugador
    */
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const foto = document.getElementById('foto').value;

        // Crear un objeto jugador con los valores obtenidos
        const jugador = {
            id: obtenerIdUnico(),
            nombre: nombre,
            foto: foto,
            puntuacion: 0
        };

        // Guardar el jugador en el almacenamiento local
        guardarJugadorEnLocalStorage(jugador);

        // Limpiar los campos del formulario después de enviar
        form.reset();
    });

    /*
    Función para guardar el jugador en el almacenamiento local
    */
    function guardarJugadorEnLocalStorage(jugador) {
        let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        // Agregar el nuevo jugador a la lista
        jugadores.push(jugador);

        // Guardar la lista actualizada de jugadores en el almacenamiento local
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
        mostrarJugadores(jugadores);
    }

    /*
    Funcion para mostrar los jugadores en la vista
    */
    function mostrarJugadores(jugadores) {
        const contenedorJugadores = document.getElementById('jugadores');

        // Limpiar el contenido anterior
        contenedorJugadores.innerHTML = '';

        // Recorrer todos los jugadores y crear una tarjeta para cada uno
        jugadores.forEach(function (jugador) {
            const card = document.createElement('div');
            card.classList.add('card');

            // Contenido de la tarjeta
            const imagen = document.createElement('img');
            imagen.src = jugador.foto;
            imagen.alt = jugador.nombre;
            card.appendChild(imagen);

            const contenido = document.createElement('div');
            contenido.classList.add('contenido');

            const nombre = document.createElement('h3');
            nombre.textContent = jugador.nombre;
            contenido.appendChild(nombre);

            const puntuacion = document.createElement('p');
            puntuacion.textContent = 'Puntuación: ' + jugador.puntuacion;
            contenido.appendChild(puntuacion);

            card.appendChild(contenido);


            // Agregar la tarjeta al contenedor de jugadores
            contenedorJugadores.appendChild(card);
        });
    }

    const jugadoresGuardados = JSON.parse(localStorage.getItem('jugadores')) || [];
    mostrarJugadores(jugadoresGuardados);

    /*
    Boton para entrar en la vista de ranking
    */
    empezarButton.addEventListener('click', function () {
        // Redireccionar a otra vista
        window.location.href = '/ranking'; // Cambia 'otra_vista.html' por la URL de la otra vista
    });

    upload_dataButton.addEventListener("click", function () {
        localStorage.clear();
        const fileInput = document.getElementById('fileInput');
        console.log(fileInput.files);
        // Verificar si se ha seleccionado un archivo
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            // Manejar el evento onload para leer el archivo
            reader.onload = function (event) {
                try {
                    const jsonData = JSON.parse(event.target.result);

                    // Almacenar los datos de jugadores y juegos en el localStorage
                    almacenarDatosEnLocalStorage(jsonData.jugadores, 'jugadores');
                    almacenarDatosEnLocalStorage(jsonData.juegos, 'juegos');
                    almacenarDatosEnLocalStorage(jsonData.nombre_juegos, 'nombre-juegos');
                    almacenarDatosEnLocalStorage(jsonData.duelos, 'duelos');
                    almacenarDatosEnLocalStorage(jsonData.historico, 'historico');
                    window.location.reload();
                } catch (error) {
                    console.error('Error al parsear el archivo JSON:', error);
                }
            };

            // Leer el archivo como texto
            reader.readAsText(file);
        } else {
            console.error('No se ha seleccionado ningún archivo.');
        }
    });

    // Función para almacenar datos JSON en el localStorage
    function almacenarDatosEnLocalStorage(jsonData, key) {
        try {
            const jsonString = JSON.stringify(jsonData);
            // Almacenar la cadena JSON en el localStorage bajo la clave proporcionada
            localStorage.setItem(key, jsonString);
        } catch (error) {
            console.error('Error al almacenar datos en el localStorage:', error);
        }
    }

    fileInput.addEventListener('change', () => {
        upload_dataButton.classList.add('btn-success'); // Agregar la clase "btn-success" al botón
        upload_dataButton.classList.remove('btn-secondary'); // Remover la clase "btn-secondary" del botón  
    });
});

