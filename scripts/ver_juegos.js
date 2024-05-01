document.addEventListener('DOMContentLoaded', function() {
    const listaJuegosContainer = document.getElementById('lista-juegos');

    // Obtener la lista de juegos del almacenamiento local
    const juegos = JSON.parse(localStorage.getItem('juegos')) || [];

    // Mostrar cada juego y los jugadores dentro de cada juego
    juegos.forEach(function(juego) {
        console.log(juego);
        if(!juego.equipos){
            
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
     

            `;
            listaJuegosContainer.appendChild(juegoElement);
        }else{
            
            const juegoElement = document.createElement('div');
            juegoElement.classList.add('juego');
            juegoElement.innerHTML = `
                <h2>${juego.nombre}</h2>
                <div class="equipos">
                    ${juego.equipos.map((equipo, index) => `
                        <div class="jugador">
                            <span>${equipo.posicion}. <b>${equipo.nombre}</b>:</span>
                            <span>${equipo.integrantes}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            listaJuegosContainer.appendChild(juegoElement);
        }
});
});
