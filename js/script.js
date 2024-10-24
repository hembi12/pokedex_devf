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
    }
}

// Variables globales para la paginación
let currentPage = 1;
const itemsPerPage = 12; // Mostrar 12 Pokémon por página

document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemonContainer');
    const paginationContainer = document.getElementById('paginationContainer');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const numberFilter = document.getElementById('numberFilter');
    const weaknessFilter = document.getElementById('weaknessFilter');
    const abilityFilter = document.getElementById('abilityFilter');

    let pokemons = [];

    // Cargar datos del archivo JSON
    fetch('data/pokemons.json')
        .then(response => response.json())
        .then(data => {
            pokemons = data
                .filter(pokemon => pokemon.weight !== 9999)
                .map(pokemonData => new Pokemon(pokemonData));
            renderPokemons(pokemons);
            renderPagination(pokemons);
        })
        .catch(error => console.error('Error al cargar los datos de Pokémon:', error));

    // Función para renderizar Pokémon en la página actual
    function renderPokemons(pokemonsList) {
        pokemonContainer.innerHTML = ''; // Limpiar contenedor

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPokemons = pokemonsList.slice(startIndex, endIndex);

        paginatedPokemons.forEach(pokemon => createPokemonCard(pokemon));
    }

    // Función para crear y añadir una tarjeta de Pokémon
    function createPokemonCard(pokemon) {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card', 'pokemon-card', 'h-100', 'text-center');
        card.setAttribute('data-id', pokemon.id);

        const img = document.createElement('img');
        img.src = pokemon.ThumbnailImage;
        img.classList.add('card-img-top', 'mx-auto', 'mt-3');
        img.alt = pokemon.ThumbnailAltText;
        img.style.maxWidth = '150px';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'mb-2');
        cardTitle.innerHTML = `<strong>${pokemon.number}</strong> ${pokemon.name}`;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerHTML = `<strong>Tipo:</strong> ${pokemon.type.join(', ')}`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        pokemonContainer.appendChild(col);

        card.addEventListener('click', () => showPokemonDetails(pokemon));
    }

    // Función para mostrar detalles en el modal
    function showPokemonDetails(pokemon) {
        document.getElementById('modalImage').src = pokemon.ThumbnailImage;
        document.getElementById('modalImage').alt = pokemon.ThumbnailAltText;
        document.getElementById('pokemonModalLabel').textContent = `${pokemon.number} ${pokemon.name}`;
        document.getElementById('modalNameDetail').textContent = pokemon.name;
        document.getElementById('modalNumberDetail').textContent = pokemon.number;
        document.getElementById('modalType').textContent = pokemon.type.join(', ');
        document.getElementById('modalWeight').textContent = pokemon.weight;
        document.getElementById('modalHeight').textContent = pokemon.height;
        document.getElementById('modalAbilities').textContent = pokemon.abilities.join(', ');
        document.getElementById('modalWeakness').textContent = pokemon.weakness.join(', ');

        const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        pokemonModal.show();
    }

    // Función para renderizar la paginación
    function renderPagination(pokemonsList) {
        paginationContainer.innerHTML = ''; // Limpiar contenedor de paginación

        const totalPages = Math.ceil(pokemonsList.length / itemsPerPage);

        // Botón "Previous"
        const prevItem = document.createElement('li');
        prevItem.classList.add('page-item', currentPage === 1 ? 'disabled' : '');
        const prevLink = document.createElement('a');
        prevLink.classList.add('page-link');
        prevLink.textContent = 'Previous';
        prevLink.href = '#';
        prevLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPokemons(pokemonsList);
                renderPagination(pokemonsList);
            }
        });
        prevItem.appendChild(prevLink);
        paginationContainer.appendChild(prevItem);

        // Botones de páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item', i === currentPage ? 'active' : '');
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.textContent = i;
            pageLink.href = '#';
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderPokemons(pokemonsList);
                renderPagination(pokemonsList);
            });
            pageItem.appendChild(pageLink);
            paginationContainer.appendChild(pageItem);
        }

        // Botón "Next"
        const nextItem = document.createElement('li');
        nextItem.classList.add('page-item', currentPage === totalPages ? 'disabled' : '');
        const nextLink = document.createElement('a');
        nextLink.classList.add('page-link');
        nextLink.textContent = 'Next';
        nextLink.href = '#';
        nextLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPokemons(pokemonsList);
                renderPagination(pokemonsList);
            }
        });
        nextItem.appendChild(nextLink);
        paginationContainer.appendChild(nextItem);
    }

    // Función para aplicar filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const number = numberFilter.value;
        const weaknessTerm = weaknessFilter.value.toLowerCase();
        const abilityTerm = abilityFilter.value.toLowerCase();

        const filteredPokemons = pokemons.filter(pokemon => {
            const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType ? pokemon.type.includes(selectedType) : true;
            const matchesNumber = number ? pokemon.number === number : true;
            const matchesWeakness = weaknessTerm
                ? pokemon.weakness.some(w => w.toLowerCase().includes(weaknessTerm))
                : true;
            const matchesAbility = abilityTerm
                ? pokemon.abilities.some(a => a.toLowerCase().includes(abilityTerm))
                : true;

            return matchesName && matchesType && matchesNumber && matchesWeakness && matchesAbility;
        });

        currentPage = 1; // Reiniciar a la primera página
        renderPokemons(filteredPokemons);
        renderPagination(filteredPokemons);
    }

    // Eventos para filtros
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    numberFilter.addEventListener('input', applyFilters);
    weaknessFilter.addEventListener('input', applyFilters);
    abilityFilter.addEventListener('input', applyFilters);
});