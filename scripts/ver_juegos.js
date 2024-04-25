document.addEventListener('DOMContentLoaded', function() {
    const listaJuegosContainer = document.getElementById('lista-juegos');

    // Obtener la lista de juegos del almacenamiento local
    const juegos = JSON.parse(localStorage.getItem('juegos')) || [];

    // Mostrar cada juego y los jugadores dentro de cada juego
    juegos.forEach(function(juego) {
        const juegoElement = document.createElement('div');
        juegoElement.classList.add('juego');
        juegoElement.innerHTML = `
            <h2>${juego.nombre}</h2>
            <div class="jugadores">
                ${juego.jugadores.map((jugador, index) => `
                    <div class="jugador">
                        <span>${index + 1}. ${jugador.nombre}</span>
                        <span>Puntuación: ${jugador.puntuacion}</span>
                    </div>
                `).join('')}
            </div>
        `;
        listaJuegosContainer.appendChild(juegoElement);
    });
});
