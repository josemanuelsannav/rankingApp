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
                    <br>                    <br>

                    ${formatearFecha(duelo.fecha)}
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
                    
                    duelos.splice(index, 1);
                    localStorage.setItem('duelos', JSON.stringify(duelos));
                }
                // Eliminar el duelo del historico
                let historico = JSON.parse(localStorage.getItem('historico')) || [];
                let indiceJuego = historico.findIndex(j => j.id === duelo.id && j.nombre === duelo.nombre);
                if (indiceJuego !== -1) {
                    historico.splice(indiceJuego, 1);
                    localStorage.setItem('historico', JSON.stringify(historico));
                }
            }
        });

        listaJuegosContainer.appendChild(dueloElement);

    });


    

    function formatearFecha(fecha) {
        console.log(fecha);
        fecha = new Date(fecha);

        let dia = String(fecha.getDate()).padStart(2, '0');
        let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
        let año = fecha.getFullYear();

        let fechaFormateada = dia + '/' + mes + '/' + año;

        return fechaFormateada;
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
                        <br><br>
                        ${formatearFecha(dueloResultado.duelo.fecha)}
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
                        <br><br>

                        ${formatearFecha(dueloResultado.duelo.fecha)}
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
