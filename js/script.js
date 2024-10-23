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
    const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'), {});

    let pokemons = [];

    // Cargar los datos del archivo JSON
    fetch('data/pokemons.json')
        .then(response => response.json())
        .then(data => {
            // Filtramos Pokémon con peso distinto de 9999
            pokemons = data
                .filter(pokemon => pokemon.weight !== 9999)
                .map(pokemonData => new Pokemon(pokemonData));
            renderPokemons(pokemons);
        })
        .catch(error => console.error('Error al cargar los datos de Pokémon:', error));

    // Función para renderizar los Pokémon
    function renderPokemons(pokemonsList) {
        // Limpiar el contenedor antes de renderizar nuevos resultados
        pokemonContainer.innerHTML = '';

        // Usar un Set opcionalmente para asegurar que no haya duplicados
        const renderedIds = new Set();

        pokemonsList.forEach(pokemon => {
            if (!renderedIds.has(pokemon.id)) {
                renderedIds.add(pokemon.id); // Agregar ID al Set para evitar duplicados

                // Crear la tarjeta del Pokémon
                const col = document.createElement('div');
                col.classList.add('col-md-3', 'mb-4');

                const card = document.createElement('div');
                card.classList.add('card', 'pokemon-card', 'h-100');
                card.setAttribute('data-id', pokemon.id);

                const img = document.createElement('img');
                img.src = pokemon.ThumbnailImage;
                img.classList.add('card-img-top');
                img.alt = pokemon.ThumbnailAltText;

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = pokemon.name;

                const cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.innerHTML = `<strong>Tipo:</strong> ${pokemon.type.join(', ')}`;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                pokemonContainer.appendChild(col);

                // Agregar evento para mostrar detalles en el modal
                card.addEventListener('click', () => showPokemonDetails(pokemon));
            }
        });
    }

    // Función para mostrar los detalles en el modal
    function showPokemonDetails(pokemon) {
        document.getElementById('modalImage').src = pokemon.ThumbnailImage;
        document.getElementById('modalImage').alt = pokemon.ThumbnailAltText;
        document.getElementById('pokemonModalLabel').textContent = pokemon.name;
        document.getElementById('modalName').textContent = pokemon.name;
        document.getElementById('modalNumber').textContent = pokemon.number;
        document.getElementById('modalType').textContent = pokemon.type.join(', ');
        document.getElementById('modalWeight').textContent = pokemon.weight;
        document.getElementById('modalHeight').textContent = pokemon.height;
        document.getElementById('modalAbilities').textContent = pokemon.abilities.join(', ');
        document.getElementById('modalWeakness').textContent = pokemon.weakness.join(', ');

        pokemonModal.show();
    }

    // Función para aplicar los filtros
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
                ? pokemon.weakness.some(weakness => weakness.toLowerCase().includes(weaknessTerm))
                : true;
            const matchesAbility = abilityTerm
                ? pokemon.abilities.some(ability => ability.toLowerCase().includes(abilityTerm))
                : true;

            return matchesName && matchesType && matchesNumber && matchesWeakness && matchesAbility;
        });

        renderPokemons(filteredPokemons);
    }

    // Agregar eventos a los filtros
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    numberFilter.addEventListener('input', applyFilters);
    weaknessFilter.addEventListener('input', applyFilters);
    abilityFilter.addEventListener('input', applyFilters);
});