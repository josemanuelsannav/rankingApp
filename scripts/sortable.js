// Función para habilitar la funcionalidad de ordenar mediante arrastrar y soltar
function enableSortable() {
    const sortableList = document.querySelector('.sortable-list');
    let dragStartIndex;

    // Obtener el índice del elemento en el que se ha iniciado el arrastre
    function dragStart() {
        dragStartIndex = +this.closest('.jugador').dataset.index;
    }

    // Cambiar el orden de los elementos al soltarlos
    function dragDrop() {
        const dragEndIndex = +this.dataset.index;
        const jugadores = document.querySelectorAll('.jugador');
        const dragEndElement = this;
        if (dragStartIndex < dragEndIndex) {
            for (let i = dragEndIndex; i > dragStartIndex; i--) {
                const jugador = jugadores[i];
                jugador.dataset.index = i - 1;
                jugador.style.order = i - 1;
            }
        } else {
            for (let i = dragEndIndex; i < dragStartIndex; i++) {
                const jugador = jugadores[i];
                jugador.dataset.index = i + 1;
                jugador.style.order = i + 1;
            }
        }
        dragEndElement.dataset.index = dragStartIndex;
        dragEndElement.style.order = dragStartIndex;
    }

    // Añadir eventos de arrastrar y soltar a los elementos de la lista
    const jugadores = document.querySelectorAll('.jugador');
    jugadores.forEach(jugador => {
        jugador.addEventListener('dragstart', dragStart);
        jugador.addEventListener('dragover', e => e.preventDefault());
        jugador.addEventListener('drop', dragDrop);
    });
}

// Habilitar la funcionalidad de ordenar al cargar la página
document.addEventListener('DOMContentLoaded', enableSortable);
