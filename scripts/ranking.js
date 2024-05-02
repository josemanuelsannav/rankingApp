document.addEventListener('DOMContentLoaded', function () {
    const nuevoJuegoBtn = document.getElementById('nuevo-juego-btn');
    const verJuegoBtn = document.getElementById('ver-juegos-btn');
    const downloadDataBtn = document.getElementById("download");

    const modal = document.getElementById('modal');
    const infoUsuario = document.getElementById('informacion-usuario');
    const cerrarModal = document.querySelector('.cerrar-modal');



    verJuegoBtn.addEventListener('click', function () {
        // Redireccionar a la otra vista
        window.location.href = '/ver_juegos'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    nuevoJuegoBtn.addEventListener('click', function () {
        // Redireccionar a la otra vista
        window.location.href = '/nuevo_juego'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    downloadDataBtn.addEventListener("click", function () {
        try {
            // Obtener los datos almacenados en el localStorage
            const jugadores = JSON.parse(localStorage.getItem('jugadores'));
            const juegos = JSON.parse(localStorage.getItem('juegos'));

            // Combinar los datos en un objeto JSON
            const datosJSON = { jugadores, juegos };

            // Convertir el objeto JSON a una cadena JSON
            const jsonString = JSON.stringify(datosJSON, null, 2);

            // Crear un Blob con la cadena JSON
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Crear un enlace de descarga para el archivo JSON
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'datos_del_localstorage.json';
            a.click();
        } catch (error) {
            console.error('Error al descargar datos del localStorage:', error);
        }
    });

    function mostrarJugadores(jugadores) {
        const contenedorJugadores = document.getElementById('jugadores');

        // Limpiar el contenido anterior
        contenedorJugadores.innerHTML = '';

        // Ordenar los jugadores por puntuación
        jugadores.sort((a, b) => {
            // Comparar por puntuación
            if (b.puntuacion !== a.puntuacion) {
                return b.puntuacion - a.puntuacion; // Orden descendente por puntuación
            } else {
                // Si la puntuación es la misma, comparar por winrate
                return calcularWinrate(b) - calcularWinrate(a); // Orden descendente por winrate
            }
        });


        // Recorrer todos los jugadores y crear una tarjeta para cada uno

        jugadores.forEach(function (jugador, index) {
            if (index != 0 && index != 1 && index != 2) {
                const card = document.createElement('div');
                card.classList.add('card');

                const numeroPosicion = document.createElement('span');
                numeroPosicion.textContent = (index + 1) + '.';
                numeroPosicion.classList.add('numero-posicion');
                card.appendChild(numeroPosicion);
                // Contenido de la tarjeta
                const imagen = document.createElement('img');
                imagen.src = jugador.foto;
                imagen.alt = jugador.nombre;
                card.appendChild(imagen);

                imagen.addEventListener('click', () => {
                    abrirModal(jugador);
                });

                const contenido = document.createElement('div');
                contenido.classList.add('contenido');

                const nombre = document.createElement('h2');
                nombre.textContent = jugador.nombre;
                contenido.appendChild(nombre);

                const puntuacion = document.createElement('p');
                puntuacion.textContent = 'Puntuación: ' + jugador.puntuacion;
                contenido.appendChild(puntuacion);

                const winrate = document.createElement('p');
                parseFloat(calcularWinrate(jugador).toFixed(2));
                winrate.textContent = 'Winrate: ' + parseFloat(calcularWinrate(jugador).toFixed(2)) + "%";
                contenido.appendChild(winrate);

                card.appendChild(contenido);

                // Agregar la tarjeta al contenedor de jugadores
                contenedorJugadores.appendChild(card);
            }

        });
        document.getElementById('segundo').innerText = jugadores[1].nombre;
        winrate = parseFloat(calcularWinrate(jugadores[1]).toFixed(2));
        document.getElementById('puntos-segundo').innerText = jugadores[1].puntuacion + " pts.   Wr: " + winrate + "%";
        const imagen2 = document.createElement('img');
        imagen2.src = jugadores[1].foto;
        document.getElementById("foto-segundo").appendChild(imagen2);
        imagen2.addEventListener('click', () => {
            abrirModal(jugadores[1]);
        });

        document.getElementById('primero').innerText = jugadores[0].nombre;
        winrate = parseFloat(calcularWinrate(jugadores[0]).toFixed(2));
        document.getElementById('puntos-primero').innerText = jugadores[0].puntuacion + " pts.   Wr: " + winrate + "%";
        const imagen1 = document.createElement('img');
        imagen1.src = jugadores[0].foto;
        document.getElementById("foto-primero").appendChild(imagen1);
        imagen1.addEventListener('click', () => {
            abrirModal(jugadores[0]);
        });

        document.getElementById('tercero').innerText = jugadores[2].nombre;
        winrate = parseFloat(calcularWinrate(jugadores[2]).toFixed(2));
        document.getElementById('puntos-tercero').innerText = jugadores[2].puntuacion + " pts.   Wr: " + winrate + "%";
        const imagen3 = document.createElement('img');
        imagen3.src = jugadores[2].foto;
        document.getElementById("foto-tercero").appendChild(imagen3);
        imagen3.addEventListener('click', () => {
            abrirModal(jugadores[2]);
        });

    }

    const juegos = JSON.parse(localStorage.getItem("juegos")) || [];

    function calcularWinrate(jugador) {
        let num_juegos = 0;
        let victorias = 0;
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


    const jugadoresGuardados = JSON.parse(localStorage.getItem('jugadores')) || [];
    mostrarJugadores(jugadoresGuardados);


    function abrirModal(jugador) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContenido = document.createElement('div');
        modalContenido.classList.add('modal-contenido');
        const titulo = document.createElement('h1');
        titulo.textContent = jugador.nombre;
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
        let partidas_jugadas = 0;

        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        let posiciones = new Array(jugadores.length).fill(0);
        let nombre_posiciones = [];
        for (let i = 0; i < jugadores.length; i++) {
            nombre_posiciones.push("Posicion " + (i + 1));
        }
        juegos.forEach(juego => {
            console.log(juego);
            if (juego.equipos) {
                juego.equipos.forEach(equipo => {
                    const found = equipo.integrantes.find((element) => element == jugador.nombre);
                    if (found) {
                        console.log(equipo);
                        partidas_jugadas++;
                        posiciones[equipo.posicion - 1]++;
                        console.log(posiciones);
                    }
                })
            } else {
                const found = juego.jugadores.find((element) => element.nombre == jugador.nombre);
                if (found) {
                    partidas_jugadas++;
                    console.log("Partida normal " + (juego.jugadores.length - found.puntuacion - 1));
                    posiciones[juego.jugadores.length - found.puntuacion - 1]++;
                    console.log(posiciones);
                }
            }
        });

        modal.appendChild(modalContenido);
        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Configurar la gráfica
        var ctx = canvas.getContext('2d');
        var maximo = partidas_jugadas; // Utilizar el número total de partidas jugadas como máximo
        var valores = posiciones;//[primera_posicion, segunda_posicion, tercera_posicion, cuarta_posicion];
        var porcentajes = valores.map(valor => (valor / maximo) * 100);
        console.log(valores, porcentajes);
        console.log(maximo);
        // Crear la gráfica de barras
        var grafica = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nombre_posiciones,//['Primera posición', 'Segunda posición', 'Tercera posición', 'Cuarta posición'],
                datasets: [{
                    label: 'Partidas jugadas: ' + partidas_jugadas,
                    data: valores,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true, // o false, dependiendo de tus necesidades
                            max: 100 // o cualquier otro valor máximo válido
                        }
                    }]
                }
            }

        });
    }




});
