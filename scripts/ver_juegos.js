let isSearching = false;
document.addEventListener('DOMContentLoaded', function () {
    const listaJuegosContainer = document.getElementById('lista-juegos');
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    juegos= [...juegos].slice().reverse();

    function showAll() {
        console.log("Funcion. ",juegos);
        juegos.forEach(function (juego) {
            if (!juego.equipos) {

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
         
    
                `;
                // Añadir evento de click al botón de borrar
                const borrarBtn = juegoElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el juegoElement del DOM
                        juegoElement.remove();
                        // Eliminar el juego de la lista de juegos
                        const index = juegos.indexOf(juego);
                        if (index !== -1) {
                            borrarPuntuacionJuego(juego);
                            juegos.splice(index, 1);
                            localStorage.setItem('juegos', JSON.stringify(juegos));
                        }
                    }
                });

                listaJuegosContainer.appendChild(juegoElement);
            } else {

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
                <br>
                <br>
                <button class="borrar-btn">Borrar</button>
                `;

                const borrarBtn = juegoElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el juegoElement del DOM
                        juegoElement.remove();
                        // Eliminar el juego de la lista de juegos
                        const index = juegos.indexOf(juego);
                        if (index !== -1) {
                            borrarPuntuacionJuegoEquipo(juego);
                            juegos.splice(index, 1);
                            localStorage.setItem('juegos', JSON.stringify(juegos));
                        }
                    }
                });
                listaJuegosContainer.appendChild(juegoElement);
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
         
    
                `;
                // Añadir evento de click al botón de borrar
                const borrarBtn = juegoElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el juegoElement del DOM
                        juegoElement.remove();
                        // Eliminar el juego de la lista de juegos
                        const index = juegos.indexOf(juego);
                        if (index !== -1) {
                            borrarPuntuacionJuego(juego);
                            juegos.splice(index, 1);
                            localStorage.setItem('juegos', JSON.stringify(juegos));
                        }
                    }
                });

                listaJuegosContainer.appendChild(juegoElement);
            } else {

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
                <br>
                <button class="borrar-btn">Borrar</button>
                `;

                const borrarBtn = juegoElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el juegoElement del DOM
                        juegoElement.remove();
                        // Eliminar el juego de la lista de juegos
                        const index = juegos.indexOf(juego);
                        if (index !== -1) {
                            borrarPuntuacionJuegoEquipo(juego);
                            juegos.splice(index, 1);
                            localStorage.setItem('juegos', JSON.stringify(juegos));
                        }
                    }
                });
                listaJuegosContainer.appendChild(juegoElement);
            }
        });
    });

    document.getElementById("mas_reciente").addEventListener('click',function(){
        juegos = [...juegos].slice().reverse();
        console.log(juegos);
        while (listaJuegosContainer.firstChild) {
            listaJuegosContainer.removeChild(listaJuegosContainer.firstChild);
        }
        showGames();
    });

    function showGames() {
        if (!isSearching) {
            showAll();
        }
    }

    showGames();
});
