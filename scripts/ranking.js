document.addEventListener('DOMContentLoaded', function() {
    const nuevoJuegoBtn = document.getElementById('nuevo-juego-btn');
    const verJuegoBtn = document.getElementById('ver-juegos-btn');
    const downloadDataBtn = document.getElementById("download");

    verJuegoBtn.addEventListener('click', function() {
        // Redireccionar a la otra vista
        window.location.href = '/ver_juegos'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    nuevoJuegoBtn.addEventListener('click', function() {
        // Redireccionar a la otra vista
        window.location.href = 'nuevo_juego.html'; // Reemplaza 'nueva_vista.html' con la URL de tu nueva vista
    });

    downloadDataBtn.addEventListener("click",function () {
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
        jugadores.sort((a, b) => b.puntuacion - a.puntuacion);
    
        // Recorrer todos los jugadores y crear una tarjeta para cada uno
     
        jugadores.forEach(function(jugador,index) {
           
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
    
            const contenido = document.createElement('div');
            contenido.classList.add('contenido');
    
            const nombre = document.createElement('h2');
            nombre.textContent = jugador.nombre;
            contenido.appendChild(nombre);
    
            const puntuacion = document.createElement('p');
            puntuacion.textContent = 'Puntuación: ' + jugador.puntuacion;
            contenido.appendChild(puntuacion);
    
            card.appendChild(contenido);
    
            // Agregar la tarjeta al contenedor de jugadores
            contenedorJugadores.appendChild(card);
        });
    }
    
    
    const jugadoresGuardados = JSON.parse(localStorage.getItem('jugadores')) || [];
    mostrarJugadores(jugadoresGuardados);

    

});
