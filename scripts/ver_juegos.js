let isSearching = false;
document.addEventListener('DOMContentLoaded', function () {
    const listaJuegosContainer = document.getElementById('lista-juegos');
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    juegos = [...juegos].slice().reverse();
    juegos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));


    showGames();
    crearSelect_Busqueda();


    function showAll() {
        //console.log("Funcion. ", juegos);
        juegos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        juegos.forEach(function (juego) {
            if (!juego.equipos) {

                juegoStruct(juego);
            } else {

                juegoEquipoStruct(juego);
            }
        });
    }

    function formatearFecha(fecha) {
        fecha = new Date(fecha);

        let dia = String(fecha.getDate()).padStart(2, '0');
        let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
        let año = fecha.getFullYear();

        let fechaFormateada = dia + '/' + mes + '/' + año;

        return fechaFormateada;
    }


    document.getElementById('buscar').addEventListener('click', function () {
        event.preventDefault();
        isSearching = true;
        var lista_juegos = JSON.parse(localStorage.getItem('juegos')) || [];
        var nombre = document.getElementById('miSelectId-juego-normal').value;

        var juegos_filtrados = lista_juegos.filter(function (juego) {
            return juego.nombre.toLowerCase().includes(nombre.toLowerCase());
        });


        while (listaJuegosContainer.firstChild) {
            listaJuegosContainer.removeChild(listaJuegosContainer.firstChild);
        }

        juegos_filtrados.forEach(function (juego) {
            if (!juego.equipos) {

                juegoStruct(juego);
            } else {
                juegoEquipoStruct(juego);

            }
        });
    });

    document.getElementById("mas_reciente").addEventListener('click', function () {
        juegos = [...juegos].slice().reverse();
        juegos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        console.log(juegos);
        while (listaJuegosContainer.firstChild) {
            listaJuegosContainer.removeChild(listaJuegosContainer.firstChild);
        }
        showGames();
    });

    function juegoStruct(juego) {
        const juegoElement = document.createElement('div');
        juegoElement.classList.add('juego');
        juegoElement.innerHTML = `
                    <h2>${juego.nombre}</h2>
                    <div class="jugadores">
                        ${juego.jugadores.map((jugador, index) => `
                            <div class="jugador">
                                <span>${index + 1}. ${jugador.nombre}</span> 
                            </div>
                        `).join('')}
                    </div>
                    <br>
                    <label for="fecha">${formatearFecha(juego.fecha)}</label>
                    <br><br>
                    <button class="borrar-btn">Borrar</button>
                    <button class="Stats-btn">Stats</button>
                    <button class="editar-btn">Editar</button>
    
                `;
        // Añadir evento de click al botón de borrar
        borrarBotonStruct(juegoElement, juego);
        //Añadir  evento de click al boton de stats
        statsBotonStruct(juegoElement, juego);
        //Añadir evento de click al boton de editar
        editarBotonStruct(juegoElement, juego);

        listaJuegosContainer.appendChild(juegoElement);
    }

    function juegoEquipoStruct(juego) {
        const juegoElement = document.createElement('div');
        juegoElement.classList.add('juego');
        juegoElement.innerHTML = `
            <h2>${juego.nombre}</h2>
            <div class="equipos">
        ${juego.equipos
                .sort((a, b) => a.posicion - b.posicion) // Ordenar por posición
                .map((equipo, index) => `
        <div class="jugador">
            <span>${equipo.posicion}. <b>${equipo.nombre}</b>: </span>
           <span>${equipo.integrantes}  ${equipo.puntos !== undefined ? `<b style="color:red">    Puntos:</b> ${equipo.puntos}` : ''}</span>
        </div>
         `)
                .join('')}
        </div>
        <br>
        <label for="fecha">${formatearFecha(juego.fecha)}</label>
        <br><br>
        <button class="borrar-btn">Borrar</button>
        <button class="Stats-btn">Stats</button>
        <button class="editar-btn">Editar</button>
        `;

        // Añadir evento de click al botón de borrar
        borrarBotonStruct(juegoElement, juego);
        //Añadir  evento de click al boton de stats
        statsBotonStruct(juegoElement, juego);
        //Añadir evento de click al boton de editar
        editarBotonStruct(juegoElement, juego);
        listaJuegosContainer.appendChild(juegoElement);
    }

    function borrarBotonStruct(juegoElement, juego) {
        const borrarBtn = juegoElement.querySelector('.borrar-btn');
        borrarBtn.addEventListener('click', function () {

            // Mostrar ventana de confirmación
            const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

            // Verificar si se ha confirmado la eliminación
            if (confirmacion) {
                // Eliminar el juegoElement del DOM
                juegoElement.remove();

                //Buscar juego en historico
                let historico = JSON.parse(localStorage.getItem('historico')) || [];

                historico.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                let indiceJuego2 = historico.findIndex(j => j.id === juego.id);

                if (indiceJuego2 !== -1) {

                    reCalcularPuntuacionesHistorico(historico, indiceJuego2);
                    historico.splice(indiceJuego2, 1);

                    localStorage.setItem('historico', JSON.stringify(historico));
                }

                //borrar juego de la lista de juegos
                const indiceJuego = juegos.findIndex(j => j.id === juego.id);
                if (indiceJuego !== -1) {
                    juegos.splice(indiceJuego, 1);
                    localStorage.setItem('juegos', JSON.stringify(juegos));
                }
            }

        });
    }

    function reCalcularPuntuacionesHistorico(historico, indiceJuego) {
        console.log(historico);

        const elemento = historico[indiceJuego];
        console.log("Juego a borrar", elemento);

        let juegoAux = juegos.find(j => j.id === elemento.id);
        console.log("Juego auxiliar de la lista de juegos", juegoAux);

        if (indiceJuego > 0 && indiceJuego < historico.length - 1) {

            for (let i = indiceJuego; i < historico.length; i++) {

                for (jugador of historico[i].jugadores) {
                    if (juegoAux.equipos) {
                        for (equipo of juegoAux.equipos) {
                            if (equipo.integrantes.includes(jugador.nombre)) {
                                let jugadorAux = historico[i].jugadores.find(j => j.nombre === jugador.nombre);
                                if (jugadorAux) {
                                    if(equipo.puntos){
                                        jugador.puntuacion = parseInt(jugador.puntuacion) - parseInt(equipo.puntos);
                                    }else{
                                        jugador.puntuacion = parseInt(jugador.puntuacion) - parseInt(equipo.posicion);
                                    }
                                }
                            }
                        }
                    } else {
                        let jugadorAux = juegoAux.jugadores.find(j => j.nombre === jugador.nombre);
                        if (jugadorAux) {
                            jugador.puntuacion = parseInt(jugador.puntuacion) - parseInt(jugadorAux.puntuacion);
                        }
                    }

                }
            }
        } else if (indiceJuego === 0) {

        }
    }

    function statsBotonStruct(juegoElement, juego) {
        const statsBtn = juegoElement.querySelector('.Stats-btn');
        statsBtn.addEventListener('click', function () {

            const modal = document.createElement('div');
            modal.classList.add('modal');
            const modalContenido = document.createElement('div');
            modalContenido.classList.add('modal-contenido');
            const titulo = document.createElement('h1');

            titulo.textContent = juego.nombre;

            const cerrarModal = document.createElement('a');
            cerrarModal.classList.add('cerrar-modal');
            cerrarModal.innerHTML = '&times;'; // Usar una "x" para representar el botón de cierre
            cerrarModal.addEventListener('click', () => {
                modal.remove();
            });
            modalContenido.appendChild(cerrarModal);
            modalContenido.appendChild(titulo);

            // Crear lienzo para la gráfica
            const canvas = document.createElement('canvas');
            canvas.id = 'grafica';
            modalContenido.appendChild(canvas);

            // Graficar las estadísticas
            let lista_jugadores = [];
            const partidas = JSON.parse(localStorage.getItem('juegos')) || [];
            const partidas_del_juego = partidas.filter(partida => partida.nombre === juego.nombre);
            console.log("partidas del juego: ", partidas_del_juego);
            let num_partidas = partidas_del_juego.length;

            for (const partida of partidas_del_juego) {
                if (!partida.equipos) {
                    for (const jugador of partida.jugadores) {
                        const player = lista_jugadores.find(j => j.nombre === jugador.nombre);
                        if (!player) {
                            lista_jugadores.push(jugador);
                        } else {
                            player.puntuacion = parseInt(player.puntuacion) + parseInt(jugador.puntuacion);
                        }
                    }
                } else {
                    for (const equipo of partida.equipos) {
                        for (const jugador of equipo.integrantes) {
                            const player = lista_jugadores.find(j => j.nombre === jugador);
                            const partidasAux = JSON.parse(localStorage.getItem('jugadores')) || [];
                            const player2 = partidasAux.find(j => j.nombre === jugador);

                            if (!player && player2) {
                                let jugador2 = null;
                                if (!equipo.puntos) {
                                    jugador2 = {
                                        nombre: jugador,
                                        puntuacion: parseInt(partida.equipos.length) - parseInt(equipo.posicion)
                                    };
                                } else {
                                    jugador2 = {
                                        nombre: jugador,
                                        puntuacion: equipo.puntos
                                    };
                                }

                                lista_jugadores.push(jugador2);

                            } else if (player2) {
                                if (!equipo.puntos) {
                                    debugger;
                                    player.puntuacion = parseInt(player.puntuacion) + parseInt(partida.equipos.length - equipo.posicion);
                                } else {
                                    player.puntuacion = parseInt(player.puntuacion) + parseInt(equipo.puntos);
                                }

                            }
                        }
                    }
                }
            }
            console.log("jugadores: ", lista_jugadores);
            lista_jugadores.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));

            modal.appendChild(modalContenido);
            document.body.appendChild(modal);
            modal.style.display = 'block';

            // Configurar la gráfica
            var ctx = canvas.getContext('2d');
            let nombres = lista_jugadores.map(jugador => jugador.nombre);
            var maximo = lista_jugadores[0].puntuacion; // Utilizar el numero de mayor puntos conseguidos
            let valores = lista_jugadores.map(jugador => jugador.puntuacion);
            console.log(valores);
            var porcentajes = valores.map(valor => (valor / maximo) * 100);

            // Crear la gráfica de barras
            var grafica = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Partidas jugadas : ' + num_partidas,
                        data: valores,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: { // Cambia yAxes por y
                            ticks: {
                                beginAtZero: true, // o false, dependiendo de tus necesidades
                                max: 100 // o cualquier otro valor máximo válido
                            }
                        }
                    }
                }

            });
        });
    }

    function editarBotonStruct(juegoElement, juego) {
        const editar_btn = juegoElement.querySelector('.editar-btn');
        editar_btn.addEventListener('click', function () {

            const modal = document.createElement('div');
            modal.classList.add('modal');
            const modalContenido = document.createElement('div');
            modalContenido.classList.add('modal-contenido');
            const titulo = document.createElement('h1');

            titulo.textContent = juego.nombre;

            const cerrarModal = document.createElement('a');
            cerrarModal.classList.add('cerrar-modal');
            cerrarModal.innerHTML = '&times;'; // Usar una "x" para representar el botón de cierre
            cerrarModal.addEventListener('click', () => {
                modal.remove();
                location.reload();//////////////////////////////////Para que no se guarden los cambios que no se quieren guardar
            });
            modalContenido.appendChild(cerrarModal);
            modalContenido.appendChild(titulo);

            modal.appendChild(modalContenido);
            document.body.appendChild(modal);
            modal.style.display = 'block';

            // Crear y configurar el elemento de texto "Nombre"
            const labelNombre = document.createElement('label');
            labelNombre.setAttribute('for', 'nombre');
            labelNombre.textContent = 'Nombre';
            labelNombre.style.marginRight = '10px';
            modalContenido.appendChild(labelNombre);

            const input_nombre = document.createElement('input');
            input_nombre.setAttribute('type', 'text');
            input_nombre.setAttribute('placeholder', 'Nombre');
            input_nombre.setAttribute('id', 'nombre');
            input_nombre.setAttribute('value', juego.nombre);
            modalContenido.appendChild(input_nombre);

            const espacio1 = document.createElement('br');
            modalContenido.appendChild(espacio1);


            const espacio6 = document.createElement('br');
            modalContenido.appendChild(espacio6);

            /*  let jugadores = juego.jugadores || [];
              const jugadoresContainer = document.createElement('div');
              modalContenido.appendChild(jugadoresContainer);
              mostrarJugadores(jugadores, jugadoresContainer);*/

            const espacio3 = document.createElement('br');
            modalContenido.appendChild(espacio3);
            const espacio4 = document.createElement('br');
            modalContenido.appendChild(espacio4);

            const guardar_btn = document.createElement('button');
            guardar_btn.textContent = 'Guardar';

            modalContenido.appendChild(guardar_btn);

            guardar_btn.addEventListener('click', function () {

                // Mostrar ventana de confirmación
                const confirmacion = window.confirm('¿Estás seguro de que deseas editar este elemento?');
                // Verificar si se ha confirmado la eliminación
                if (confirmacion) {
                    // Editar el juegoElement del DOM
                    const juegoEncontrado = juegos.find(juego2 => juego2.id === juego.id);
                    if (juegoEncontrado) {
                        juegoEncontrado.nombre = input_nombre.value;
                        juegoEncontrado.jugadores = jugadores;
                        localStorage.setItem('juegos', JSON.stringify(juegos));
                    }

                }
                //Buscar juego en historico
                /* let historico = JSON.parse(localStorage.getItem('historico')) || [];
                 let indiceJuego = historico.findIndex(j => j.id === juego.id && j.nombre === juego.nombre);
                 if (indiceJuego !== -1) {
                     historico.splice(indiceJuego, 1);
                     localStorage.setItem('historico', JSON.stringify(historico));
                 }*/
                location.reload();
            });

        });
    }

    // Función para mostrar jugadores en el contenedor
    function mostrarJugadores(jugadores, jugadoresContainer) {
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

        // Añadir event listeners para los botones "Subir" y "Bajar"
        const subirButtons = jugadoresContainer.querySelectorAll('.subir-btn');
        const bajarButtons = jugadoresContainer.querySelectorAll('.bajar-btn');

        subirButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                if (index > 0) {
                    [jugadores[index], jugadores[index - 1]] = [jugadores[index - 1], jugadores[index]];
                    mostrarJugadores(jugadores, jugadoresContainer);
                }
            });
        });

        bajarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                if (index < jugadores.length - 1) {
                    [jugadores[index], jugadores[index + 1]] = [jugadores[index + 1], jugadores[index]];
                    mostrarJugadores(jugadores, jugadoresContainer);
                }
            });
        });
    }

    function showGames() {
        if (!isSearching) {
            showAll();
        }
    }

    function obtenerJuegos() {
        let juegos = JSON.parse(localStorage.getItem('nombre-juegos')) || [];
        juegos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        let opciones = [];
        for (const juego of juegos) {
            if (!opciones.includes(juego.nombre)) {
                opciones.push(juego.nombre);
            }
        }
        return opciones;
    }

    function crearSelect_Busqueda() {
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
    }




});
