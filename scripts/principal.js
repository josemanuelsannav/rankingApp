document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('player-form');
    const goToView2Button = document.getElementById('go-to-view2');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const foto = document.getElementById('foto').value;

        // Crear un objeto jugador con los valores obtenidos
        const jugador = {
            nombre: nombre,
            foto: foto,
            puntuacion:0
        };

        // Guardar el jugador en el almacenamiento local
        guardarJugadorEnLocalStorage(jugador);

        // Limpiar los campos del formulario después de enviar
        form.reset();
    });

    // Función para guardar el jugador en el almacenamiento local
    function guardarJugadorEnLocalStorage(jugador) {
        // Verificar si ya hay jugadores almacenados en el almacenamiento local
        let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        // Agregar el nuevo jugador a la lista
        jugadores.push(jugador);

        // Guardar la lista actualizada de jugadores en el almacenamiento local
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
        mostrarJugadores(jugadores);
        console.log('Jugador guardado en el almacenamiento local:', jugador);
    }

    function mostrarJugadores(jugadores) {
        const contenedorJugadores = document.getElementById('jugadores');

        // Limpiar el contenido anterior
        contenedorJugadores.innerHTML = '';

        // Recorrer todos los jugadores y crear una tarjeta para cada uno
        jugadores.forEach(function(jugador) {
            const card = document.createElement('div');
            card.classList.add('card');

            // Contenido de la tarjeta
            const imagen = document.createElement('img');
            imagen.src = jugador.foto;
            imagen.alt = jugador.nombre;
            card.appendChild(imagen);

            const contenido = document.createElement('div');
            contenido.classList.add('contenido');

            const nombre = document.createElement('h2');
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

    goToView2Button.addEventListener('click', function() {
        // Redireccionar a otra vista
        window.location.href = 'ranking.html'; // Cambia 'otra_vista.html' por la URL de la otra vista
    });
});

