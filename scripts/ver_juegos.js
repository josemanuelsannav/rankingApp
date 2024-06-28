let isSearching = false;
document.addEventListener('DOMContentLoaded', function () {
    const listaJuegosContainer = document.getElementById('lista-juegos');
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    juegos = [...juegos].slice().reverse();
    

    function showAll() {
        //console.log("Funcion. ", juegos);
        juegos.sort((a, b) => {
            // Convertir las fechas a objetos Date para comparar
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaB- fechaA; // Para orden ascendente, invierte para descendente
        });
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

    function borrarPuntuacionJuego(juego) {
        // Obtener la lista de puntuaciones del almacenamiento local
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        juego.jugadores.forEach(function (jugador) {
            const index = jugadores.findIndex(j => j.nombre === jugador.nombre);
            if (index !== -1) {
                jugadores[index].puntuacion -= jugador.puntuacion;
            }
        });


        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    function borrarPuntuacionJuegoEquipo(juego) {
        // Obtener la lista de puntuaciones del almacenamiento local
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        juego.equipos.forEach(function (equipo) {
            equipo.integrantes.forEach(function (integrante) {
                const index = jugadores.findIndex(j => j.nombre === integrante);
                if (index !== -1) {
                    if (!equipo.puntos || equipo.puntos == null) {
                        jugadores[index].puntuacion -= juego.equipos.length - equipo.posicion;
                    } else {
                        jugadores[index].puntuacion -= equipo.puntos;
                    }

                }
            });
        });


        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    document.getElementById('buscar').addEventListener('click', function () {
        event.preventDefault();
        isSearching = true;
        var lista_juegos = JSON.parse(localStorage.getItem('juegos')) || [];
        var nombre = document.getElementById("juego-busqueda").value;

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
            <span>${equipo.posicion}. <b>${equipo.nombre}</b>:</span>
            <span>${equipo.integrantes}</span>
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
            debugger
            // Mostrar ventana de confirmación
            const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

            // Verificar si se ha confirmado la eliminación
            if (confirmacion) {
                // Eliminar el juegoElement del DOM
                juegoElement.remove();
                // Eliminar el juego de la lista de juegos
                /*const index = juegos.indexOf(juego);
                if (index !== -1) {
                    borrarPuntuacionJuego(juego);
                    juegos.splice(index, 1);
                    localStorage.setItem('juegos', JSON.stringify(juegos));
                }*/
                const indiceJuego = juegos.findIndex(j => j.fecha === juego.fecha && j.nombre === juego.nombre);

                if (indiceJuego !== -1) {
                    if (!juego.equipos) {
                        borrarPuntuacionJuego(juego);
                    } else {
                        borrarPuntuacionJuegoEquipo(juego);
                    }

                    juegos.splice(indiceJuego, 1);
                    localStorage.setItem('juegos', JSON.stringify(juegos));
                }
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
                            const player2 = partidasAux.find(j=> j.nombre === jugador);

                            if (!player && player2) { //si el jugador no esta metido en el array de la grafica pero existe en la BD
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

                            } else if(player2) {
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
                        label: 'Partidas jugadas : '+num_partidas,
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

    showGames();

});
