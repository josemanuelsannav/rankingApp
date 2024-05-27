let isSearching = false;
document.addEventListener('DOMContentLoaded', function () {
    const listaJuegosContainer = document.getElementById('lista-juegos');

    // Obtener la lista de juegos del almacenamiento local
    const duelos = JSON.parse(localStorage.getItem('duelos')) || [];

    // Mostrar cada juego y los jugadores dentro de cada juego
    
    duelos.forEach(function (duelo) {


        const dueloElement = document.createElement('div');
        dueloElement.classList.add('juego');
        dueloElement.innerHTML = `
                <h2>${duelo.nombre}</h2>
                <div class="jugadores">
                    Ganador: ${duelo.ganador}
                    <br>
                    Perdedor: ${duelo.perdedor}
                    <br>
                    Apuesta: ${duelo.apuesta}
                </div>
                <br>
                <button class="borrar-btn">Borrar</button>
     

            `;
        // Añadir evento de click al botón de borrar
        const borrarBtn = dueloElement.querySelector('.borrar-btn');
        borrarBtn.addEventListener('click', function () {
            // Mostrar ventana de confirmación
            const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

            // Verificar si se ha confirmado la eliminación
            if (confirmacion) {
                // Eliminar el dueloElement del DOM
                dueloElement.remove();
                // Eliminar el duelo de la lista de duelos
                const index = duelos.indexOf(duelo);
                if (index !== -1) {
                    borrarPuntuacionDuelo(duelo);
                    duelos.splice(index, 1);
                    localStorage.setItem('duelos', JSON.stringify(duelos));
                }
            }
        });

        listaJuegosContainer.appendChild(dueloElement);

    });


    function borrarPuntuacionDuelo(duelo) {
        // Obtener la lista de puntuaciones del almacenamiento local
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

        const indexGanador = jugadores.findIndex(j => duelo.ganador === j.nombre);
        const indexPerdedor = jugadores.findIndex(j => duelo.perdedor === j.nombre);

        if (indexGanador !== -1 && indexPerdedor !== -1) {
            jugadores[indexGanador].puntuacion -= parseInt(duelo.apuesta);
            jugadores[indexPerdedor].puntuacion += parseInt(duelo.apuesta);

        }



        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }

    document.getElementById('buscar').addEventListener('click', function () {
        const jugador1 = document.getElementById('buscar-jugador1').value.trim();
        const jugador2 = document.getElementById('buscar-jugador2').value.trim();
        const duelosGanados = [];
        const duelosPerdidos = [];
        const duelosResultado = [];

        if (jugador1 == null || jugador1 == "") {
            alert("Introduce un nombre de jugador 1");
            return;
        }

        if (jugador2 == null || jugador2 == "") {
            duelos.forEach(function (duelo) {
                if (duelo.ganador == jugador1) {
                    //duelosGanados.push(duelo);
                    duelosResultado.push({ duelo: duelo, resultado: 'Ganador' });
                }
                if (duelo.perdedor == jugador1) {
                    //duelosPerdidos.push(duelo);
                    duelosResultado.push({ duelo: duelo, resultado: 'Perdedor' });

                }
            });

        } else {
            duelos.forEach(function (duelo) {
                if (duelo.ganador == jugador1 && duelo.perdedor == jugador2) {
                    //duelosGanados.push(duelo);
                    duelosResultado.push({ duelo: duelo, resultado: 'Ganador' });
                } else if (duelo.ganador == jugador2 && duelo.perdedor == jugador1) {
                    //duelosPerdidos.push(duelo);
                    duelosResultado.push({ duelo: duelo, resultado: 'Perdedor' });
                }
            });
        }
        
        //eliminamos los duelos que estaban puestos 
        while (listaJuegosContainer.firstChild) {
            listaJuegosContainer.removeChild(listaJuegosContainer.firstChild);
        }
        

        duelosResultado.forEach(function (dueloResultado) {

            if (dueloResultado.resultado == 'Ganador') {

                const dueloElement = document.createElement('div');
                dueloElement.classList.add('dueloGanado');
                dueloElement.innerHTML = `
                    <h2>${dueloResultado.duelo.nombre}</h2>
                    <div class="jugadores">
                        Ganador: ${dueloResultado.duelo.ganador}
                        <br>
                        Perdedor: ${dueloResultado.duelo.perdedor}
                        <br>
                        Apuesta: ${dueloResultado.duelo.apuesta}
                    </div>
                    <br>
                    <button class="borrar-btn">Borrar</button>
         
    
                `;
                // Añadir evento de click al botón de borrar
                const borrarBtn = dueloElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el dueloElement del DOM
                        dueloElement.remove();
                        // Eliminar el duelo de la lista de duelos
                        const index = duelos.indexOf(dueloResultado.duelo);
                        if (index !== -1) {
                            borrarPuntuacionDuelo(dueloResultado.duelo);
                            duelos.splice(index, 1);
                            localStorage.setItem('duelos', JSON.stringify(duelos));
                        }
                    }
                });

                listaJuegosContainer.appendChild(dueloElement);

            } else if(dueloResultado.resultado == 'Perdedor'){
                console.log(dueloResultado);
                const dueloElement = document.createElement('div');
                dueloElement.classList.add('dueloPerdido');
                dueloElement.innerHTML = `
                    <h2>${dueloResultado.duelo.nombre}</h2>
                    <div class="jugadores">
                        Ganador: ${dueloResultado.duelo.ganador}
                        <br>
                        Perdedor: ${dueloResultado.duelo.perdedor}
                        <br>
                        Apuesta: ${dueloResultado.duelo.apuesta}
                    </div>
                    <br>
                    <button class="borrar-btn">Borrar</button>
         
    
                `;
                // Añadir evento de click al botón de borrar
                const borrarBtn = dueloElement.querySelector('.borrar-btn');
                borrarBtn.addEventListener('click', function () {
                    // Mostrar ventana de confirmación
                    const confirmacion = window.confirm('¿Estás seguro de que deseas borrar este elemento?');

                    // Verificar si se ha confirmado la eliminación
                    if (confirmacion) {
                        // Eliminar el dueloElement del DOM
                        dueloElement.remove();
                        // Eliminar el duelo de la lista de duelos
                        const index = duelos.indexOf(dueloResultado.duelo);
                        if (index !== -1) {
                            borrarPuntuacionDuelo(dueloResultado.duelo);
                            duelos.splice(index, 1);
                            localStorage.setItem('duelos', JSON.stringify(duelos));
                        }
                    }
                });
                listaJuegosContainer.appendChild(dueloElement);

            }

        });



    });

});
