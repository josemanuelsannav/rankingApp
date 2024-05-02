document.addEventListener('DOMContentLoaded', function () {
    const listaJuegosContainer = document.getElementById('lista-juegos');

    // Obtener la lista de juegos del almacenamiento local
    const juegos = JSON.parse(localStorage.getItem('juegos')) || [];

    // Mostrar cada juego y los jugadores dentro de cada juego
    juegos.forEach(function (juego) {
        console.log(juego);
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

    function borrarPuntuacionJuegoEquipo(juego){
        // Obtener la lista de puntuaciones del almacenamiento local
        const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
        juego.equipos.forEach(function (equipo) {
            equipo.integrantes.forEach(function (integrante) {
                const index = jugadores.findIndex(j => j.nombre === integrante);
                if (index !== -1) {
                    jugadores[index].puntuacion -= juego.equipos.length - equipo.posicion ;
                }
            });
        });
        

        localStorage.setItem('jugadores', JSON.stringify(jugadores));
    }
});
