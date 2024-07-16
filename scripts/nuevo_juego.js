document.addEventListener('DOMContentLoaded', function () {
    const jugadoresContainer = document.getElementById('jugadores');
    let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    const gameForm = document.getElementById('game-form');
    const addEquipoBtn = document.getElementById("addEquipo");
    const saveEquipoBtn = document.getElementById("save-juego-equipo");

    mostrarJugadores();
    crearSelects();

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

    function actualizarPuntuacion() {
        // Obtener los jugadores del almacenamiento local
        const jugadoresAlmacenados = JSON.parse(localStorage.getItem('jugadores')) || [];
        const cantidadJugadores = jugadoresAlmacenados.length;
        const numeroCheckboxMarcados = contarCheckboxMarcados();
        console.log(jugadores);
        // Recorrer los jugadores y actualizar su puntuación
        jugadores.forEach(function (jugador, index) {
            // Buscar al jugador en el almacenamiento local por su nombre
            const checkbox = document.querySelector(`input[data-nombre="${jugador.nombre}"]`);
            if (checkbox && !checkbox.checked) {
                let x = cantidadJugadores - numeroCheckboxMarcados - index - 1;
                const newJugador = { nombre: jugador.nombre, puntuacion: x, foto: jugador.foto, id: jugador.id };
                jugadoresDeJuego.push(newJugador);

            }
        });
    }

    function obtenerIdUnico() {
        const juegos = JSON.parse(localStorage.getItem('juegos')) || [];
        const duelos = JSON.parse(localStorage.getItem('duelos')) || [];

        const idsJuegos = juegos.map(juego => juego.id);
        const idsDuelos = duelos.map(duelo => duelo.id);

        const todosLosIds = idsJuegos.concat(idsDuelos);
        const nuevoId = todosLosIds.length > 0 ? Math.max(...todosLosIds) + 1 : 1;

        return nuevoId;
    }


    function guardarJuegoEnLocalStorage() {
        const nuevoJuego = {
            nombre: document.getElementById('miSelectId-juego-normal').value,
            jugadores: jugadoresDeJuego,
            fecha: new Date(),
            id: obtenerIdUnico()
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
        guardarHistorico(nuevoJuego);
    }

    //al guardar un juego ynormal
    gameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        actualizarPuntuacion();
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

    saveEquipoBtn.addEventListener("click",// Función para guardar los datos del juego de equipo en localStorage
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
                fecha: new Date(),
                id: obtenerIdUnico()
            };


            let juegos = JSON.parse(localStorage.getItem('juegos')) || [];

            juegos.push(juego);

            localStorage.setItem('juegos', JSON.stringify(juegos));
            guardarHistorico(juego);

            alert('El juego ha sido guardado en localStorage.');
            window.location.href = '/ranking';
        }
    );


    document.getElementById('duelo-form').addEventListener('submit', function (event) {
        // Prevenir la acción por defecto del formulario
        event.preventDefault();

        // Obtener los valores de los campos de entrada
        var nombreDuelo = document.getElementById('miSelectId-juego-duelo').value;
        var apuesta = document.getElementById('apuesta').value;
        var ganador = document.getElementById('Ganador').value.trim();
        var perdedor = document.getElementById('Perdedor').value.trim();

        // Ahora puedes usar los valores obtenidos
        //console.log(nombreDuelo, apuesta, jugador1, jugador2);
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        for (const jugador of jugadores) {

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
        const duelo = { nombre: nombreDuelo, apuesta: apuesta, ganador: ganador, perdedor: perdedor, fecha: fechaActual, id: obtenerIdUnico() };
        duelos.push(duelo);
        localStorage.setItem('duelos', JSON.stringify(duelos));

        guardarHistorico(duelo);
        alert('Puntuaciones actualizadas y duelo guardado con éxito.');
        window.location.href = '/ranking';
    });

    function crearSelects() {//Crear los desplegables con los nombres de los juegos y ponerlos en la pagina
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
        juegos.sort((a, b) => a.nombre.localeCompare(b.nombre));

        //console.log(juegos);
        let opciones = [];
        for (const juego of juegos) {
            if (!opciones.includes(juego.nombre)) {
                opciones.push(juego.nombre);
            }
        }
        //console.log(opciones);
        return opciones;
    }

    document.getElementById('new-game').addEventListener("submit", function (event) {//crear nombre de juego
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


    function guardarHistorico(juego) {
        let historico = JSON.parse(localStorage.getItem('historico')) || [];
        const nuevoRegistro = {
            jugadores: obtenerRanking(),
            fecha: juego.fecha,
            id: juego.id,
            nombre: juego.nombre
        };
        historico.push(nuevoRegistro);
        localStorage.setItem('historico', JSON.stringify(historico));
    }

    function obtenerRanking() {
        jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        calcularPuntuaciones(jugadores);
        //jugadores.sort((a, b) => b.puntuacion - a.puntuacion);

        jugadores.sort((a, b) => {
            // Primero compara por puntuación
            if (b.puntuacion !== a.puntuacion) {
              return b.puntuacion - a.puntuacion;
            }
            // Si las puntuaciones son iguales, compara por winrate
            return calcularWinrate(b) - calcularWinrate(a);
          });

        return jugadores;
    }

    function calcularWinrate(jugador) {
        let num_juegos = 0;
        let victorias = 0;
        const juegos = JSON.parse(localStorage.getItem('juegos')) || [];
        juegos.forEach(juego => {
            if (juego.equipos) {
                juego.equipos.forEach(equipo => {
                    const found = equipo.integrantes.find((element) => element == jugador.nombre);
                    if (found) {
                        num_juegos++;
                        if (equipo.posicion == 1) {
                            victorias++;
                        }
                    }
                })
            } else {
                const found = juego.jugadores.find((element) => element.nombre == jugador.nombre);
                if (found) {
                    num_juegos++;
                    if (found.puntuacion == juego.jugadores.length - 1) {
                        victorias++;
                    }
                }
            }
        });
        let winrate = 0;
        if (num_juegos != 0) {
            winrate = (victorias / num_juegos) * 100;
        }
        return winrate;
    }

    function calcularPuntuaciones(listajugadores) {

        const juegos = JSON.parse(localStorage.getItem('juegos')) || [];
        const duelos = JSON.parse(localStorage.getItem('duelos')) || [];
        for (const jugador of listajugadores) {
            jugador.puntuacion = 0;
            //Mirar en los juegos
            for (const juego of juegos) {
                //juego por equipos
                if (juego.equipos) {
                    for (const equipo of juego.equipos) {
                        for (const integrante of equipo.integrantes) {
                            if (integrante == jugador.nombre) {
                                if (equipo.puntos) {
                                    jugador.puntuacion = parseInt(jugador.puntuacion) + parseInt(equipo.puntos);
                                } else {
                                    jugador.puntuacion = parseInt(jugador.puntuacion) + parseInt(juego.equipos.length) - parseInt(equipo.posicion);
                                }
                            }
                        }

                    }
                } else {//juego por individuales
                    for (const jugadorJuego of juego.jugadores) {
                        if (jugadorJuego.nombre == jugador.nombre) {
                            jugador.puntuacion = parseInt(jugador.puntuacion) + parseInt(jugadorJuego.puntuacion);
                        }
                    }
                }
            }
            //Mirar en los duelos
            for (const duelo of duelos) {
                if (duelo.ganador == jugador.nombre) {
                    jugador.puntuacion = parseInt(jugador.puntuacion) + parseInt(duelo.apuesta);
                } else if (jugador.nombre == duelo.perdedor) {
                    jugador.puntuacion = parseInt(jugador.puntuacion) - parseInt(duelo.apuesta);
                }
            }

        }
    }

});
