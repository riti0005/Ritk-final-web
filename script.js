document.addEventListener('DOMContentLoaded', () => {
    const Gallery = document.getElementById('Gallery_pokemon');
    const load_More_Pokemons_Button = document.getElementById('load-more-btn');
    let next_20_url = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
    let caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons')) || [];


    //Model for getting pokemons from the Main Screen
    const modal = document.getElementById('pokemon-modal');
    const modalContent = document.getElementById('model_pokemon_details');
    const closeModal = document.getElementsByClassName('close')[0];
  
  
  //Fetch records
    const fetch_Pokemons_Records = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            next_20_url = data.next;
            show_pokemons(data.results);
        } catch (error) {
            console.error('Error fetching pokemons:', error);
        }
    };

    //show Pokemons
    const show_pokemons = (pokemons) => {
        pokemons.forEach(pokemon => {
            const id = parseUrl(pokemon.url);
            const isCaught = caughtPokemons.includes(id);
            const card = document.createElement('div');
            card.classList.add('pokemon-card', isCaught ? 'caught' : 'uncaught');
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}" data-id="${id}">
                <h5>${pokemon.name}</h5>
                <button class="catch-button" data-id="${id}">${isCaught ? 'Release' : 'Catch'}</button>
            `;
            card.querySelector('img').addEventListener('click', () => show_pokemons_Details(id));
            card.querySelector('.catch-button').addEventListener('click', (e) => change_Status(e, id));
            Gallery.appendChild(card);
        });
    };

    load_More_Pokemons_Button.addEventListener('click', () => {
        fetch_Pokemons_Records(next_20_url);
    });

    fetch_Pokemons_Records(next_20_url);


    //Change Status
    const change_Status = (event, id) => {
        const button = event.target;
        if (caughtPokemons.includes(id)) {
            caughtPokemons = caughtPokemons.filter(pokemonId => pokemonId !== id);
            button.textContent = 'Catch';
        } else {
            caughtPokemons.push(id);
            button.textContent = 'Release';
        }
        localStorage.setItem('caughtPokemons', JSON.stringify(caughtPokemons));
        update_pokemons(id);
    };

    //Update Pokemons
    const update_pokemons = (id) => {
        const card = document.querySelector(`.pokemon-card img[data-id="${id}"]`).parentElement;
        if (caughtPokemons.includes(id)) {
            card.classList.add('caught');
            card.classList.remove('uncaught');
        } else {
            card.classList.add('uncaught');
            card.classList.remove('caught');
        }
    };


    //Show Pokemons Details
    const show_pokemons_Details = async (id) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
            const data = await response.json();
            const details = `
                <div class="model_pokemon_details">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${data.name}">
                    <h2>${data.name}</h2>
                    <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}</p>
                    <p><strong>Types:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                    
                </div>
            `;
            modalContent.innerHTML = details;
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
        }
    };

    //Extract the Pokémon ID from a given URL
    const parseUrl = (url) => {
        return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
    };

    //Close the model
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    //Closes the modal if the user clicks outside of it.
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
