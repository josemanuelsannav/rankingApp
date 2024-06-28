document.addEventListener('DOMContentLoaded', function () {
    const jugadoresContainer = document.getElementById('jugadores');
    let jugadores = JSON.parse(localStorage.getItem('jugadores')) || []; // Array para almacenar la lista de jugadores
    const gameForm = document.getElementById('game-form');
    const addEquipoBtn = document.getElementById("addEquipo");
    const saveEquipoBtn = document.getElementById("save-juego-equipo");


    // Función para mostrar los jugadores en la lista
    function mostrarJugadores() {
        jugadoresContainer.innerHTML = '';
        jugadores.forEach(function (jugador, index) {
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
    jugadoresContainer.addEventListener('click', function (event) {
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
    crearSelects();

    function contarCheckboxMarcados() {
        // Seleccionar todos los elementos checkbox con la clase "no-juega"
        const checkboxes = document.querySelectorAll('.no-juega');

        let contador = 0;

        // Recorrer todos los checkboxes y contar los marcados
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                contador++;
            }
        });

        return contador;
    }

    let jugadoresDeJuego = [];

    function actualizarPuntuacion() {//creo que esto ya no hace falta tenerlo aqui
        // Obtener los jugadores del almacenamiento local
        const jugadoresAlmacenados = JSON.parse(localStorage.getItem('jugadores')) || [];
        const cantidadJugadores = jugadoresAlmacenados.length;
        const numeroCheckboxMarcados = contarCheckboxMarcados();
        // Recorrer los jugadores y actualizar su puntuación
        jugadores.forEach(function (jugador, index) {
            // Buscar al jugador en el almacenamiento local por su nombre
            const checkbox = document.querySelector(`input[data-nombre="${jugador.nombre}"]`);
            if (checkbox && !checkbox.checked) {
                const jugadorAlmacenado = jugadoresAlmacenados.find(j => j.nombre === jugador.nombre);
                let x = cantidadJugadores - numeroCheckboxMarcados - index - 1;

                const newJugador = { nombre: jugador.nombre, puntuacion: x, foto: jugador.foto };
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
    }

    function guardarJugadoresEnLocalStorage() {

        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    function guardarJuegoEnLocalStorage() {
        const nuevoJuego = {
            nombre: document.getElementById('miSelectId-juego-normal').value,
            jugadores: jugadoresDeJuego,
            fecha: new Date()
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
        actualizarListaHistorico();
    }

    function actualizarListaHistorico() {
        const historico = JSON.parse(localStorage.getItem("historico")) || [];
        console.log(historico);
        if (historico == null || historico == undefined || historico == "") {
            localStorage.setItem('historico', JSON.stringify(historico));
            const dato = {
                fecha: new Date(),
                jugadores: JSON.parse(localStorage.getItem('jugadores')).sort((a, b) => b.puntuacion - a.puntuacion)
            }
            historico.push(dato);
            localStorage.setItem('historico', JSON.stringify(historico));
        } else {
            console.log("entro");

            const dato = {
                fecha: new Date(),
                jugadores: JSON.parse(localStorage.getItem('jugadores')).sort((a, b) => b.puntuacion - a.puntuacion)
            }
            console.log(dato);
            historico.push(dato);
            localStorage.setItem('historico', JSON.stringify(historico));


        }
    }

    gameForm.addEventListener('submit', function (event) {
     debugger;    event.preventDefault();
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

            //Crear input para la puntuacion
            const puntosInput = document.createElement('input');
            puntosInput.type = 'number';
            puntosInput.placeholder = 'Puntos para Equipo ';
            puntosInput.classList.add('puntos');

            // Crear botón para borrar el equipo
            const borrarEquipoBtn = document.createElement('button');
            borrarEquipoBtn.textContent = 'Borrar';
            borrarEquipoBtn.classList.add('borrar-equipo-btn');
            borrarEquipoBtn.addEventListener('click', function () {
                equipoDiv.remove(); // Eliminar el div del equipo al hacer clic en el botón de borrar
            });
            // Agregar los inputs al div del equipo
            equipoDiv.appendChild(equipoInput);
            equipoDiv.appendChild(integrantesInput);
            equipoDiv.appendChild(puestoInput);
            equipoDiv.appendChild(puntosInput);

            equipoDiv.appendChild(borrarEquipoBtn);
            equipoDiv.appendChild(document.createElement('br'));

            // Agregar el div del equipo al contenedor de equipos
            equiposContainer.appendChild(equipoDiv);
        }
    );

    saveEquipoBtn.addEventListener("click",// Función para guardar los datos del juego en localStorage
        function guardarJuego() {
            // Obtener el nombre del juego
            const nombreJuego = document.getElementById('miSelectId-juego-equipo').value;

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
                const integrantes = div.querySelector('.integrantes').value.split(',').map(item => item.trim());
                const puesto = div.querySelector('.posicion').value;
                const puntos = div.querySelector('.puntos').value;
                equipos.push({ nombre: equipoNombre, integrantes: integrantes, posicion: puesto, puntos: puntos });
            });


            // Crear objeto con los datos del juego
            const juego = {
                nombre: nombreJuego,
                equipos: equipos,
                fecha: new Date()
            };


            let juegos = JSON.parse(localStorage.getItem('juegos')) || [];

            juegos.push(juego);

            localStorage.setItem('juegos', JSON.stringify(juegos));

            añadirPuntos(juego);
            alert('El juego ha sido guardado en localStorage.');
            window.location.href = '/ranking';
        }
    );

    function añadirPuntos(juego) {//esto creo que no hace falta
        //jugadores
        for (const equipo of juego.equipos) {
            for (const integrante of equipo.integrantes) {
                const jugador = jugadores.find(jugador => jugador.nombre === integrante);
                if (jugador) {
                    if (!equipo.puntos || equipo.puntos == null) {
                        jugador.puntuacion = jugador.puntuacion + (juego.equipos.length - equipo.posicion);
                    } else {
                        jugador.puntuacion = parseInt(jugador.puntuacion) + parseInt(equipo.puntos);

                    }
                }
            }
        }
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    };

    document.getElementById('duelo-form').addEventListener('submit', function (event) {
        // Prevenir la acción por defecto del formulario
        event.preventDefault();

        // Obtener los valores de los campos de entrada
        var nombreDuelo = document.getElementById('miSelectId-juego-duelo').value;
        var apuesta = document.getElementById('apuesta').value;
        var ganador = document.getElementById('Ganador').value.trim();
        var perdedor = document.getElementById('Perdedor').value.trim();

        // Ahora puedes usar los valores obtenidos
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        for (const jugador of jugadores) {//esto creo que no hace falta

            if (jugador.nombre === ganador) {
                jugador.puntuacion = jugador.puntuacion + parseInt(apuesta);
            }
            if (jugador.nombre === perdedor) {
                jugador.puntuacion = jugador.puntuacion - parseInt(apuesta);
            }
        }
        localStorage.setItem('jugadores', JSON.stringify(jugadores));
        let fechaActual = new Date();
        const duelos = JSON.parse(localStorage.getItem('duelos')) || [];
        duelos.push({ nombre: nombreDuelo, apuesta: apuesta, ganador: ganador, perdedor: perdedor, fecha: fechaActual });
        localStorage.setItem('duelos', JSON.stringify(duelos));
        actualizarListaHistorico();
        alert('Puntuaciones actualizadas y duelo guardado con éxito.');
        window.location.href = '/ranking';
    });

    function crearSelects() {


        //Desplegable de los nombres y tal
        let selectContainer = document.querySelector(".select-container-juego-normal");
        let selectElement = document.createElement("select");
        let opciones = obtenerJuegos();
        ;
        opciones.forEach((opcion) => {
            let optionElement = document.createElement("option");
            optionElement.text = opcion;
            optionElement.value = opcion;
            selectElement.appendChild(optionElement);
        });
        selectContainer.appendChild(selectElement)
        selectElement.setAttribute("name", "miSelect-juego-normal");
        selectElement.setAttribute("id", "miSelectId-juego-normal");

        let selectContainer2 = document.querySelector(".select-container-juego-equipo");
        let selectElement2 = document.createElement("select");
        opciones.forEach((opcion) => {
            let optionElement = document.createElement("option");
            optionElement.text = opcion;
            optionElement.value = opcion;
            selectElement2.appendChild(optionElement);
        });
        selectContainer2.appendChild(selectElement2)
        selectElement2.setAttribute("name", "miSelect-juego-equipo");
        selectElement2.setAttribute("id", "miSelectId-juego-equipo");

        let selectContainer3 = document.querySelector(".select-container-juego-duelo");
        let selectElement3 = document.createElement("select");
        opciones.forEach((opcion) => {
            let optionElement = document.createElement("option");
            optionElement.text = opcion;
            optionElement.value = opcion;
            selectElement3.appendChild(optionElement);
        });
        selectContainer3.appendChild(selectElement3)
        selectElement3.setAttribute("name", "miSelect-juego-duelo");
        selectElement3.setAttribute("id", "miSelectId-juego-duelo");
    }

    function obtenerJuegos() {
        let juegos = JSON.parse(localStorage.getItem('nombre-juegos')) || [];
        let opciones = [];
        for (const juego of juegos) {
            if (!opciones.includes(juego.nombre)) {
                opciones.push(juego.nombre);
            }
        }
        opciones.sort();
        return opciones;
    }

    document.getElementById('new-game').addEventListener("submit", function (event) {
        var nombre2 = document.getElementById("nombre-juego-nuevo").value;
        const nuevoJuego = {
            nombre: nombre2
        };

        let juegos = JSON.parse(localStorage.getItem('nombre-juegos')) || [];

        // Verificar si juegos es un array
        if (Array.isArray(juegos)) {
            // Agregar el nuevo juego a la lista
            juegos.push(nuevoJuego);

            // Guardar la lista actualizada de juegos en el almacenamiento local
            localStorage.setItem('nombre-juegos', JSON.stringify(juegos));
        } else {
            // Si no es un array, crear una nueva lista de juegos con el nuevo juego
            juegos = [nuevoJuego];
            localStorage.setItem('nombre-juegos', JSON.stringify(juegos));
        }
    });
});
