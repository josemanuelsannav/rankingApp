document.addEventListener('DOMContentLoaded', function () {
    const nuevoJuegoBtn = document.getElementById('nuevo-juego-btn');
    const verJuegoBtn = document.getElementById('ver-juegos-btn');
    const downloadDataBtn = document.getElementById("download");
    const dueloBtn = document.getElementById("ver-duelos-btn");
    const verHistoricoBtn = document.getElementById("ver-historico-btn");


    verHistoricoBtn.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContenido = document.createElement('div');
        modalContenido.classList.add('modal-contenido');
        const titulo = document.createElement('h1');

        titulo.textContent = "Evolución Ranking";

        const cerrarModal = document.createElement('a');
        cerrarModal.classList.add('cerrar-modal');
        cerrarModal.innerHTML = '&times;';
        cerrarModal.addEventListener('click', () => {
            modal.remove();
        });
        modalContenido.appendChild(cerrarModal);
        modalContenido.appendChild(titulo);

        // Crear lienzo para la gráfica
        const canvas = document.createElement('canvas');
        canvas.id = 'grafica_historico';
        modalContenido.appendChild(canvas);

        modal.appendChild(modalContenido);
        document.body.appendChild(modal);
        modal.style.display = 'block';

        const historicoPosicionesArray = JSON.parse(localStorage.getItem('historico')) || [];

        const nombres_jugadores = jugadoresGuardados.map(jugador => jugador.nombre);
        const dias = historicoPosicionesArray.map(historico => formatearFecha(historico.fecha) + ' ' + historico.nombre);

        const datos = [];
        for (const nombre of nombres_jugadores) {
            const posiciones = [];

            for (const dia of historicoPosicionesArray) {
                // Buscar el índice del jugador por nombre en la lista de jugadores del día
                let indice = dia.jugadores.findIndex(jugador => jugador.nombre === nombre);
                // Si el jugador no se encuentra, findIndex devuelve -1
                if (indice === -1) {
                    // Si no se encuentra, se asume que la posición es la última
                    indice = dia.jugadores.length;
                }
                indice = indice + 1;
                posiciones.push(indice);
            }

            datos.push({
                nombre: nombre,
                posiciones: posiciones
            });
        }

        // Paleta de colores predefinida
        const coloresPredefinidos = [
            '#FF0000', // Rojo
            '#00FF00', // Verde
            '#0000FF', // Azul
            '#FFFF00', // Amarillo
            '#FF00FF', // Magenta
            '#00FFFF', // Cian
            '#800000', // Marrón
            '#808000', // Oliva
            '#008080', // Verde azulado
            '#800080'  // Púrpura
        ];

        // Configurar la gráfica
        var ctx = canvas.getContext('2d');

        // Crear la gráfica de líneas
        var grafica = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: datos.map((persona, index) => ({
                    label: persona.nombre,
                    data: persona.posiciones,
                    borderColor: coloresPredefinidos[index % coloresPredefinidos.length],
                    fill: false
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Días'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Posiciones'
                        },
                        beginAtZero: true,
                        reverse: true
                    }
                }
            }
        });
    });



    /**
     * Evento para redireccionar a la vista de todos los duelos
     */
    dueloBtn.addEventListener('click', function () {

        window.location.href = '/ver_duelos';
    });

    /**
     * Evento para redireccionar a la vista de todos los juegos
     */
    verJuegoBtn.addEventListener('click', function () {
        // Redireccionar a la otra vista
        window.location.href = '/ver_juegos'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    /**
     * Evento para redireccionar a la vista de nuevo juego
     */
    nuevoJuegoBtn.addEventListener('click', function () {
        // Redireccionar a la otra vista
        window.location.href = '/nuevo_juego'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    /**
     * Evento para descargar los datos almacenados en el localStorage
     */
    downloadDataBtn.addEventListener("click", function () {
        try {
            // Obtener los datos almacenados en el localStorage
            const jugadores = JSON.parse(localStorage.getItem('jugadores'));
            const juegos = JSON.parse(localStorage.getItem('juegos'));
            const duelos = JSON.parse(localStorage.getItem('duelos'));
            const nombre_juegos = JSON.parse(localStorage.getItem('nombre-juegos'));
            const historico = JSON.parse(localStorage.getItem('historico'));
            // Combinar los datos en un objeto JSON
            const datosJSON = { jugadores, juegos, duelos, nombre_juegos, historico };

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
                if (calcularWinrate(b) !== calcularWinrate(a)) {
                    return calcularWinrate(b) - calcularWinrate(a); // Orden descendente por winrate
                } else {
                    // Si el winrate es el mismo, comparar por nombre alfabéticamente en orden contrario
                    return b.nombre.localeCompare(a.nombre); // Orden alfabético contrario por nombre
                }
            }
        });


        // Recorrer todos los jugadores y crear una tarjeta para cada uno
        jugadores.sort
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
        /////////////////////////////////////
        //Segunda grafica de duelos general
        ////////////////////////////////////
        /* const titulo2 = document.createElement('h1');
         titulo2.textContent = "Duelos";
         modalContenido.appendChild(titulo2);*/

        // Crear lienzo para la gráfica
        const canvas2 = document.createElement('canvas');
        canvas2.id = 'grafica';
        modalContenido.appendChild(canvas2);

        // Graficar las estadísticas
        let duelosJugados = 0;

        //const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        let posiciones2 = new Array(2).fill(0);
        let nombre_posiciones2 = ["Ganador", "Perdedor"];


        const duelos = JSON.parse(localStorage.getItem('duelos')) || [];
        for (const duelo of duelos) {
            if (duelo.ganador == jugador.nombre || duelo.perdedor == jugador.nombre) {
                duelosJugados++;
                if (duelo.ganador == jugador.nombre) {
                    posiciones2[0]++;
                } else {
                    posiciones2[1]++;
                }
            }
        }
        modal.appendChild(modalContenido);
        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Configurar la gráfica
        var ctx = canvas2.getContext('2d');
        var maximo = duelosJugados; // Utilizar el número total de partidas jugadas como máximo
        var valores = posiciones2;//[primera_posicion, segunda_posicion, tercera_posicion, cuarta_posicion];
        var porcentajes = valores.map(valor => (valor / maximo) * 100);

        // Crear la gráfica de barras
        /*  var grafica = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: nombre_posiciones2,
                  datasets: [{
                      label: 'Duelos jugados: ' + duelosJugados,
                      data: valores,
                      backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],        
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
  
          });*/

        ////////////////////////////
        //Tercera Grafica 
        ////////////////////////////

        const canvas3 = document.createElement('canvas');
        const titulo3 = document.createElement('h1');
        titulo3.textContent = "Duelos personas";
        modalContenido.appendChild(titulo3);

        canvas3.id = 'grafica';
        modalContenido.appendChild(canvas3);

        let contrincantes = [];
        /*const contrincante = {
            nombre : 
            ganadas://contra el
            perdidas://cntra el
        }*/

        // Graficar las estadísticas
        let duelos_ganados2 = 0;
        //creamos los contrincantes 
        for (const duelo of duelos) {
            if (duelo.ganador == jugador.nombre || duelo.perdedor == jugador.nombre) {
                duelos_ganados2++;
                if (duelo.ganador == jugador.nombre) {
                    let personaEncontrada = contrincantes.find(persona => persona.nombre === duelo.perdedor);
                    if (personaEncontrada) {
                        personaEncontrada.ganadas++;
                    } else {
                        const contrincante = {
                            nombre: duelo.perdedor,
                            ganadas: 1,
                            perdidas: 0
                        }
                        contrincantes.push(contrincante);
                    }
                } else {
                    let personaEncontrada = contrincantes.find(persona => persona.nombre === duelo.ganador);
                    if (personaEncontrada) {
                        personaEncontrada.perdidas++;
                    } else {
                        const contrincante = {
                            nombre: duelo.ganador,
                            ganadas: 0,
                            perdidas: 1
                        }
                        contrincantes.push(contrincante);
                    }
                }
            }
        }

        let nombres_contrincantes = contrincantes.map(persona => persona.nombre);
        let ganadas = contrincantes.map(persona => persona.ganadas);
        let perdidas = contrincantes.map(persona => persona.perdidas);
        console.log(nombres_contrincantes);

        modal.appendChild(modalContenido);
        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Configurar la gráfica
        var ctx = canvas3.getContext('2d');
        var maximo = duelos_ganados2; // Utilizar el número total de partidas jugadas como máximo
        var valores = posiciones2;//[primera_posicion, segunda_posicion, tercera_posicion, cuarta_posicion];
        var porcentajes = valores.map(valor => (valor / maximo) * 100);
        var grafica = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nombres_contrincantes, //nombres de las personas con las que hay duelo
                datasets: [{
                    label: 'Duelos ganados: ' + ganadas.reduce((acumulador, win) => acumulador + win, 0),
                    data: ganadas,
                    backgroundColor: ['rgba(75, 192, 192, 0.5)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1
                }, {
                    label: "Duelos perdidos: " + perdidas.reduce((acumulador, win) => acumulador + win, 0), // etiqueta para la segunda barra
                    data: perdidas, // valores para la segunda barra
                    backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                    borderColor: ['rgba(255, 99, 132, 0.5)'],
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

    function confeti() {

        let canvas = document.createElement("canvas");
        let container = document.getElementsByClassName("jss1040")[0];
        canvas.width = 600;
        canvas.height = 600;

        container.appendChild(canvas);

        let confetti_button = confetti.create(canvas);
        confetti_button().then(() => container.removeChild(canvas));
    }

    function formatearFecha(fecha) {
        fecha = new Date(fecha);

        let dia = String(fecha.getDate()).padStart(2, '0');
        let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
        let año = fecha.getFullYear();

        let fechaFormateada = dia + '/' + mes + '/' + año;

        return fechaFormateada;
    }

    const jugadoresGuardados = JSON.parse(localStorage.getItem('jugadores')) || [];
    calcularPuntuaciones(jugadoresGuardados);
    mostrarJugadores(jugadoresGuardados);
    confeti();






});
