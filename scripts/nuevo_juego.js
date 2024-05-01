document.addEventListener('DOMContentLoaded', function() {
    const jugadoresContainer = document.getElementById('jugadores');
    let jugadores = JSON.parse(localStorage.getItem('jugadores')) || []; // Array para almacenar la lista de jugadores
    const gameForm = document.getElementById('game-form');
    const addEquipoBtn = document.getElementById("addEquipo");
    const saveEquipoBtn= document.getElementById("save-juego-equipo");


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
                <input class="no-juega" type="checkbox" data-nombre="${jugador.nombre}">No juega
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

    function contarCheckboxMarcados() {
        // Seleccionar todos los elementos checkbox con la clase "no-juega"
        const checkboxes = document.querySelectorAll('.no-juega');
    
        let contador = 0;
    
        // Recorrer todos los checkboxes y contar los marcados
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                contador++;
            }
        });
    
        return contador;
    }

    let jugadoresDeJuego = [];

    function actualizarPuntuacion() {
        // Obtener los jugadores del almacenamiento local
        const jugadoresAlmacenados = JSON.parse(localStorage.getItem('jugadores')) || [];
        const cantidadJugadores = jugadoresAlmacenados.length;
        const numeroCheckboxMarcados = contarCheckboxMarcados();
        // Recorrer los jugadores y actualizar su puntuación
        jugadores.forEach(function(jugador, index) {
            // Buscar al jugador en el almacenamiento local por su nombre
            const checkbox = document.querySelector(`input[data-nombre="${jugador.nombre}"]`);
            if (checkbox && !checkbox.checked) {
                const jugadorAlmacenado = jugadoresAlmacenados.find(j => j.nombre === jugador.nombre);
                let x = cantidadJugadores - numeroCheckboxMarcados - index - 1;
                console.log(x);
                const newJugador = {nombre:jugador.nombre,puntuacion:x,foto:jugador.foto};
                jugadoresDeJuego.push(newJugador);
                if (jugadorAlmacenado) {
                    // Si se encuentra al jugador, sumar su puntuación anterior con la nueva puntuación calculada
                    jugador.puntuacion = jugadorAlmacenado.puntuacion + (cantidadJugadores - numeroCheckboxMarcados) - index - 1;
                } else {
                    // Si el jugador no se encuentra en el almacenamiento local, asignar la nueva puntuación directamente
                    jugador.puntuacion = (cantidadJugadores - numeroCheckboxMarcados) - index - 1;
                }
            }
        });
        console.log(jugadoresDeJuego);
    }

    function guardarJugadoresEnLocalStorage() {

        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    function guardarJuegoEnLocalStorage() {
        const nuevoJuego = {
            nombre: document.getElementById('nombre-juego').value,
            jugadores: jugadoresDeJuego
        };
        console.log(nuevoJuego);
    
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

    
addEquipoBtn.addEventListener("click",// Función para agregar un equipo al formulario
function agregarEquipo() {
    const equiposContainer = document.getElementById('equipos-container');

    // Crear un nuevo div para el equipo
    const equipoDiv = document.createElement('div');
    equipoDiv.classList.add('equipo');

    // Crear input para el nombre del equipo
    const equipoInput = document.createElement('input');
    equipoInput.type = 'text';
    equipoInput.placeholder = 'Nombre del Equipo';
    equipoInput.classList.add('equipo-nombre');

    // Crear input para los nombres de los integrantes
    const integrantesInput = document.createElement('input');
    integrantesInput.type = 'text';
    integrantesInput.placeholder = 'Integrantes del Equipo (Separados por comas)';
    integrantesInput.classList.add('integrantes');

    // Crear input para los nombres de los puestos
    const puestoInput = document.createElement('input');
    puestoInput.type = 'number';
    puestoInput.placeholder = 'Puesto del Equipo ';
    puestoInput.classList.add('posicion');

    // Crear botón para borrar el equipo
    const borrarEquipoBtn = document.createElement('button');
    borrarEquipoBtn.textContent = 'Borrar';
    borrarEquipoBtn.classList.add('borrar-equipo-btn');
    borrarEquipoBtn.addEventListener('click', function() {
        equipoDiv.remove(); // Eliminar el div del equipo al hacer clic en el botón de borrar
    });
    // Agregar los inputs al div del equipo
    equipoDiv.appendChild(equipoInput);
    equipoDiv.appendChild(integrantesInput);
    equipoDiv.appendChild(puestoInput);
    equipoDiv.appendChild(borrarEquipoBtn);
    equipoDiv.appendChild(document.createElement('br'));

    // Agregar el div del equipo al contenedor de equipos
    equiposContainer.appendChild(equipoDiv);
}
);

saveEquipoBtn.addEventListener("click",// Función para guardar los datos del juego en localStorage
function guardarJuego() {
    // Obtener el nombre del juego
    const nombreJuego = document.getElementById('nombre-juego-equipo').value;

    // Verificar si se ingresó un nombre de juego
    if (nombreJuego.trim() === '') {
        alert('Por favor, ingresa el nombre del juego.');
        return;
    }

    // Obtener los equipos
    const equipos = [];
    const equiposDivs = document.querySelectorAll('.equipo');
    equiposDivs.forEach(div => {
        const equipoNombre = div.querySelector('.equipo-nombre').value;
        const integrantes = div.querySelector('.integrantes').value.split(',');
        const puesto = div.querySelector('.posicion').value;
        equipos.push({ nombre: equipoNombre, integrantes: integrantes ,posicion:puesto});
    });

    // Crear objeto con los datos del juego
    const juego = {
        nombre: nombreJuego,
        equipos: equipos
    };

    
    let juegos = JSON.parse(localStorage.getItem('juegos')) || []; 
    
    juegos.push(juego);
   
    localStorage.setItem('juegos', JSON.stringify(juegos));

    añadirPuntos(juego);
    alert('El juego ha sido guardado en localStorage.');
    window.location.href = '/ranking';
}
);

function añadirPuntos(juego){
    //jugadores
    for (const equipo of juego.equipos) {
        for(const integrante of equipo.integrantes){
            const jugador = jugadores.find(jugador => jugador.nombre === integrante);
            if (jugador) {
                jugador.puntuacion= jugador.puntuacion + (juego.equipos.length - equipo.posicion);
            }
        }
    }
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
};
});
