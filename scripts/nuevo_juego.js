document.addEventListener('DOMContentLoaded', function() {
    const jugadoresContainer = document.getElementById('jugadores');
    let jugadores = JSON.parse(localStorage.getItem('jugadores')) || []; // Array para almacenar la lista de jugadores
    const gameForm = document.getElementById('game-form');
    // Función para mostrar los jugadores en la lista
    function mostrarJugadores() {
        jugadoresContainer.innerHTML = '';
        jugadores.forEach(function(jugador, index) {
            const jugadorElement = document.createElement('div');
            jugadorElement.classList.add('jugador');
            jugadorElement.innerHTML = `
                <span>${index + 1}. ${jugador.nombre}</span>
                <button class="subir-btn" data-index="${index}">Subir</button>
                <button class="bajar-btn" data-index="${index}">Bajar</button>
            `;
            jugadoresContainer.appendChild(jugadorElement);
        });
    }

    // Función para mover un jugador hacia arriba en la lista
    function moverJugadorArriba(index) {
        if (index > 0) {
            const jugador = jugadores.splice(index, 1)[0];
            jugadores.splice(index - 1, 0, jugador);
            mostrarJugadores();
        }
    }

    // Función para mover un jugador hacia abajo en la lista
    function moverJugadorAbajo(index) {
        if (index < jugadores.length - 1) {
            const jugador = jugadores.splice(index, 1)[0];
            jugadores.splice(index + 1, 0, jugador);
            mostrarJugadores();
        }
    }

    // Añadir eventos de clic a los botones "Subir" y "Bajar"
    jugadoresContainer.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('subir-btn')) {
            const index = +target.getAttribute('data-index');
            moverJugadorArriba(index);
        } else if (target.classList.contains('bajar-btn')) {
            const index = +target.getAttribute('data-index');
            moverJugadorAbajo(index);
        }
    });

    // Ejemplo de carga inicial de jugadores
   
    mostrarJugadores();

    function actualizarPuntuacion() {
        // Obtener los jugadores del almacenamiento local
        const jugadoresAlmacenados = JSON.parse(localStorage.getItem('jugadores')) || [];
        const cantidadJugadores = jugadoresAlmacenados.length;
        
        // Recorrer los jugadores y actualizar su puntuación
        jugadores.forEach(function(jugador, index) {
            // Buscar al jugador en el almacenamiento local por su nombre
            const jugadorAlmacenado = jugadoresAlmacenados.find(j => j.nombre === jugador.nombre);
            if (jugadorAlmacenado) {
                // Si se encuentra al jugador, sumar su puntuación anterior con la nueva puntuación calculada
                jugador.puntuacion = jugadorAlmacenado.puntuacion + cantidadJugadores - index - 1;
            } else {
                // Si el jugador no se encuentra en el almacenamiento local, asignar la nueva puntuación directamente
                jugador.puntuacion = cantidadJugadores - index - 1;
            }
        });
    }
    function guardarJugadoresEnLocalStorage() {
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    function guardarJuegoEnLocalStorage() {
        const nuevoJuego = {
            nombre: document.getElementById('nombre-juego').value,
            jugadores: jugadores
        };
    
        let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    
        // Verificar si juegos es un array
        if (Array.isArray(juegos)) {
            // Agregar el nuevo juego a la lista
            juegos.push(nuevoJuego);
    
            // Guardar la lista actualizada de juegos en el almacenamiento local
            localStorage.setItem('juegos', JSON.stringify(juegos));
        } else {
            // Si no es un array, crear una nueva lista de juegos con el nuevo juego
            juegos = [nuevoJuego];
            localStorage.setItem('juegos', JSON.stringify(juegos));
        }
    }
    
    


    gameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        actualizarPuntuacion();
        guardarJugadoresEnLocalStorage();
        guardarJuegoEnLocalStorage();
        alert('Puntuaciones actualizadas y juego guardado con éxito.');
        window.location.href = '/ranking';
    });
});
