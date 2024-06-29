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
    
                `;
        // Añadir evento de click al botón de borrar
        borrarBotonStruct(juegoElement, juego);
        //Añadir  evento de click al boton de stats
        statsBotonStruct(juegoElement, juego);


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
        `;

        // Añadir evento de click al botón de borrar
        borrarBotonStruct(juegoElement, juego);
        //Añadir  evento de click al boton de stats
        statsBotonStruct(juegoElement, juego);

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

                // const indiceJuego = juegos.findIndex(j => j.fecha === juego.fecha && j.nombre === juego.nombre);
                const indiceJuego = juegos.findIndex(j => j.id === juego.id);
                if (indiceJuego !== -1) {
                    juegos.splice(indiceJuego, 1);
                    localStorage.setItem('juegos', JSON.stringify(juegos));
                }
            }
            //Buscar juego en historico
            let historico = JSON.parse(localStorage.getItem('historico')) || [];
            let indiceJuego = historico.findIndex(j => j.id === juego.id && j.nombre === juego.nombre);
            if (indiceJuego !== -1) {
                historico.splice(indiceJuego, 1);
                localStorage.setItem('historico', JSON.stringify(historico));
            }
        });
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
