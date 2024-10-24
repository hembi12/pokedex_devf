// Definición de la clase Pokemon
class Pokemon {
    constructor(data) {
        this.abilities = data.abilities || [];
        this.detailPageURL = data.detailPageURL || '';
        this.weight = data.weight || 0;
        this.weakness = data.weakness || [];
        this.number = data.number || '';
        this.height = data.height || 0;
        this.collectibles_slug = data.collectibles_slug || '';
        this.featured = data.featured || 'false';
        this.slug = data.slug || '';
        this.name = data.name || '';
        this.ThumbnailAltText = data.ThumbnailAltText || '';
        this.ThumbnailImage = data.ThumbnailImage || '';
        this.id = data.id || 0;
        this.type = data.type || [];
        // this.hp = data.hp || 0; // Eliminado según tu solicitud
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemonContainer');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const numberFilter = document.getElementById('numberFilter');
    const weaknessFilter = document.getElementById('weaknessFilter');
    const abilityFilter = document.getElementById('abilityFilter');
    const pagination = document.getElementById('pagination');
    const previousPageBtn = document.getElementById('previousPage');
    const nextPageBtn = document.getElementById('nextPage');

    let pokemons = [];
    let currentPage = 1;
    const itemsPerPage = 12;

    // Cargar datos del archivo JSON
    fetch('data/pokemons.json')
        .then(response => response.json())
        .then(data => {
            pokemons = removeDuplicates(
                data.filter(pokemon => pokemon.weight !== 9999)
                    .map(pokemonData => new Pokemon(pokemonData))
            );
            renderPage();
        })
        .catch(error => console.error('Error al cargar los datos de Pokémon:', error));

    // Eliminar duplicados basados en el número del Pokémon
    function removeDuplicates(pokemonList) {
        const uniquePokemons = new Map();
        pokemonList.forEach(pokemon => {
            if (!uniquePokemons.has(pokemon.number)) {
                uniquePokemons.set(pokemon.number, pokemon);
            }
        });
        return Array.from(uniquePokemons.values());
    }

    // Renderizar la página actual con filtros y paginación aplicados
    function renderPage() {
        const filteredPokemons = applyFilters();
        const paginatedPokemons = paginate(filteredPokemons, currentPage, itemsPerPage);
        renderPokemons(paginatedPokemons);
        renderPaginationButtons(filteredPokemons.length);
    }

    // Paginación: obtener los Pokémon para la página actual
    function paginate(pokemonsList, page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        return pokemonsList.slice(start, start + itemsPerPage);
    }

    // Renderizar las tarjetas de Pokémon en el contenedor
    function renderPokemons(pokemonsList) {
        pokemonContainer.innerHTML = '';
        pokemonsList.forEach(pokemon => createPokemonCard(pokemon));
    }

    // Crear y agregar una tarjeta de Pokémon al contenedor
    function createPokemonCard(pokemon) {
        // Crear el elemento de la columna
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        // Crear la tarjeta
        const card = document.createElement('div');
        card.classList.add('pokemon-card', 'card');

        // Asignar la clase de tipo pastel basada en el primer tipo del Pokémon
        if (pokemon.type.length > 0) {
            const primaryType = pokemon.type[0].toLowerCase();
            card.classList.add(`type-${primaryType}`);
        }

        // Configurar el atributo para activar el modal
        card.setAttribute('data-bs-toggle', 'modal');
        card.setAttribute('data-bs-target', '#pokemonModal');

        // Crear el encabezado de la tarjeta
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = pokemon.name;

        cardHeader.appendChild(cardTitle);
        // Eliminado el elemento cardHp

        // Crear la imagen de la tarjeta
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = pokemon.ThumbnailImage;
        image.alt = pokemon.ThumbnailAltText;

        cardImage.appendChild(image);

        // Crear el cuerpo de la tarjeta
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const typeText = document.createElement('p');
        typeText.classList.add('card-text');
        typeText.innerHTML = `<strong>Tipo:</strong> ${pokemon.type.join(' / ')}`;

        const abilityText = document.createElement('p');
        abilityText.classList.add('card-text');
        abilityText.innerHTML = `<strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}`;

        cardBody.appendChild(typeText);
        cardBody.appendChild(abilityText);

        // Armar la tarjeta
        card.appendChild(cardHeader);
        card.appendChild(cardImage);
        card.appendChild(cardBody);

        col.appendChild(card);
        pokemonContainer.appendChild(col);

        // Añadir evento para mostrar los detalles en el modal
        card.addEventListener('click', () => showPokemonDetails(pokemon));
    }

    // Mostrar los detalles del Pokémon en el modal
    function showPokemonDetails(pokemon) {
        // Asignar la imagen y el alt text
        const modalImage = document.getElementById('modalImage');
        modalImage.src = pokemon.ThumbnailImage;
        modalImage.alt = pokemon.ThumbnailAltText;

        // Asignar el título del modal
        const pokemonModalLabel = document.getElementById('pokemonModalLabel');
        pokemonModalLabel.textContent = `${pokemon.number} ${pokemon.name}`;

        // Asignar los detalles en el cuerpo del modal
        document.getElementById('modalNameDetail').textContent = pokemon.name;
        document.getElementById('modalNumberDetail').textContent = pokemon.number;
        document.getElementById('modalType').textContent = pokemon.type.join(', ');
        document.getElementById('modalWeight').textContent = pokemon.weight;
        document.getElementById('modalHeight').textContent = pokemon.height;
        document.getElementById('modalAbilities').textContent = pokemon.abilities.join(', ');
        document.getElementById('modalWeakness').textContent = pokemon.weakness.join(', ');

        // Mostrar el modal utilizando Bootstrap Modal API
        const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        pokemonModal.show();
    }

    // Aplicar los filtros seleccionados
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const number = numberFilter.value;
        const weaknessTerm = weaknessFilter.value.toLowerCase();
        const abilityTerm = abilityFilter.value.toLowerCase();

        return pokemons.filter(pokemon => {
            const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType ? pokemon.type.map(t => t.toLowerCase()).includes(selectedType.toLowerCase()) : true;
            const matchesNumber = number ? pokemon.number === number : true;
            const matchesWeakness = weaknessTerm
                ? pokemon.weakness.some(w => w.toLowerCase().includes(weaknessTerm))
                : true;
            const matchesAbility = abilityTerm
                ? pokemon.abilities.some(a => a.toLowerCase().includes(abilityTerm))
                : true;

            return matchesName && matchesType && matchesNumber && matchesWeakness && matchesAbility;
        });
    }

    // Renderizar los botones de paginación
    function renderPaginationButtons(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const maxVisiblePages = 3; // Número máximo de páginas visibles

        // Determinar el rango de páginas que se van a mostrar
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Ajustar el rango si estamos al final de la paginación
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Eliminar números de página existentes
        const pageNumbers = pagination.querySelectorAll('.page-number');
        pageNumbers.forEach(page => page.remove());

        // Generar nuevos números de página según el rango
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item', 'page-number');
            if (i === currentPage) pageItem.classList.add('active');

            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i;

            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderPage();
            });

            pageItem.appendChild(pageLink);
            nextPageBtn.before(pageItem); // Insertar antes del botón "Next"
        }

        // Deshabilitar botones "Previous" y "Next" según la página actual
        previousPageBtn.classList.toggle('disabled', currentPage === 1);
        nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
    }

    // Eventos para los botones de paginación
    previousPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(applyFilters().length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    // Eventos para los filtros para que actualicen la página al cambiar
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderPage();
    });
    typeFilter.addEventListener('change', () => {
        currentPage = 1;
        renderPage();
    });
    numberFilter.addEventListener('input', () => {
        currentPage = 1;
        renderPage();
    });
    weaknessFilter.addEventListener('input', () => {
        currentPage = 1;
        renderPage();
    });
    abilityFilter.addEventListener('input', () => {
        currentPage = 1;
        renderPage();
    });
});