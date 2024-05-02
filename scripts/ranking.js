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
                    console.log("--------------------");
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

        document.getElementById('primero').innerText = jugadores[0].nombre;
        winrate = parseFloat(calcularWinrate(jugadores[0]).toFixed(2));
        document.getElementById('puntos-primero').innerText = jugadores[0].puntuacion + " pts.   Wr: " + winrate + "%";
        const imagen1 = document.createElement('img');
        imagen1.src = jugadores[0].foto;
        document.getElementById("foto-primero").appendChild(imagen1);

        document.getElementById('tercero').innerText = jugadores[2].nombre;
        winrate = parseFloat(calcularWinrate(jugadores[2]).toFixed(2));
        document.getElementById('puntos-tercero').innerText = jugadores[2].puntuacion + " pts.   Wr: " + winrate + "%";
        const imagen3 = document.createElement('img');
        imagen3.src = jugadores[2].foto;
        document.getElementById("foto-tercero").appendChild(imagen3);

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
        //grafica de las estadisticas
        let partidas_jugadas=0;
        let primera_posicion =0;
        let segunda_posicion=0;
        let tercera_posicion=0;
        let cuarta_posicion=0;
       
        juegos.forEach(juego => {
            if (juego.equipos) {
                juego.equipos.forEach(equipo => {
                    const found = equipo.integrantes.find((element) => element == jugador.nombre);
                    if (found) {
                        partidas_jugadas++;
                        if (equipo.posicion == 1) {
                            primera_posicion++;
                        }else if(equipo.posicion==2){
                            segunda_posicion++;
                        }else if(equipo.posicion==3){
                            tercera_posicion++;
                        }else if(equipo.posicion==4){
                            cuarta_posicion++;
                        }
                    }
                })
            } else {
                const found = juego.jugadores.find((element) => element.nombre == jugador.nombre);
                if (found) {
                    partidas_jugadas++;
                    if (found.puntuacion == juego.jugadores.length - 1) {
                        victorias++;
                    }
                }
            }
        });

        modal.appendChild(modalContenido);
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
    
    
    
});
