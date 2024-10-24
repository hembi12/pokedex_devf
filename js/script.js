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

    // Función para eliminar duplicados basados en el número del Pokémon
    function removeDuplicates(pokemonList) {
        const uniquePokemons = new Map();
        pokemonList.forEach(pokemon => {
            if (!uniquePokemons.has(pokemon.number)) {
                uniquePokemons.set(pokemon.number, pokemon);
            }
        });
        return Array.from(uniquePokemons.values());
    }

    function renderPage() {
        const filteredPokemons = applyFilters();
        const paginatedPokemons = paginate(filteredPokemons, currentPage, itemsPerPage);
        renderPokemons(paginatedPokemons);
        updatePaginationButtons(filteredPokemons.length);
    }

    function paginate(pokemonsList, page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        return pokemonsList.slice(start, start + itemsPerPage);
    }

    function renderPokemons(pokemonsList) {
        pokemonContainer.innerHTML = '';
        pokemonsList.forEach(pokemon => createPokemonCard(pokemon));
    }

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

    // Función para aplicar filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const number = numberFilter.value;
        const weaknessTerm = weaknessFilter.value.toLowerCase();
        const abilityTerm = abilityFilter.value.toLowerCase();

        return pokemons.filter(pokemon => {
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
    }

    function updatePaginationButtons(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        previousPageBtn.classList.toggle('disabled', currentPage === 1);
        nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
    }

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

    searchInput.addEventListener('input', renderPage);
    typeFilter.addEventListener('change', renderPage);
    numberFilter.addEventListener('input', renderPage);
    weaknessFilter.addEventListener('input', renderPage);
    abilityFilter.addEventListener('input', renderPage);
});