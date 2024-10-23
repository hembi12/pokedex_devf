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
        this.moves = data.moves || [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemonContainer');
    const searchInput = document.getElementById('searchInput');
    const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'), {});

    let pokemons = [];

    // Cargar los datos del archivo JSON
    fetch('data/pokemons.json')
        .then(response => response.json())
        .then(data => {
            // Filtramos los Pokémon con weight 9999 al cargar los datos
            const validPokemons = data.filter(pokemon => pokemon.weight !== 9999);
            pokemons = validPokemons.map(pokemonData => new Pokemon(pokemonData));
            renderPokemons(pokemons);
        })
        .catch(error => console.error('Error al cargar los datos de Pokémon:', error));

    // Renderizar la lista de Pokémon
    function renderPokemons(pokemonsList) {
        // Limpiar el contenedor antes de renderizar nuevos resultados
        pokemonContainer.innerHTML = '';

        // Usar un Set para evitar duplicados
        const renderedIds = new Set();

        pokemonsList.forEach((pokemon) => {
            if (!renderedIds.has(pokemon.id)) {
                renderedIds.add(pokemon.id);

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

                // Evento para abrir el modal con detalles
                card.addEventListener('click', () => {
                    showPokemonDetails(pokemon);
                });
            }
        });
    }

// Mostrar detalles del Pokémon en el modal
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

    // Mostramos el modal
    pokemonModal.show();
}

    // Funcionalidad de búsqueda de Pokémon
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // Filtrar los Pokémon por nombre y excluir los que tengan weight 9999
        const filteredPokemons = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm) && pokemon.weight !== 9999
        );

        // Renderizar los Pokémon filtrados
        renderPokemons(filteredPokemons);
    });
});