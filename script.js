let pokeNameUrl = [];
let pokeDetails = [];
let start = 0;
let end = 3;

async function init() {
    await loadAllPoke(); 
    await loadPokeDetails(start, end);
    renderPokemons();
}

// lade alle pokemons und schreibe id, name und url in array "pokeNameUrl"
async function loadAllPoke() {
    let resPokemons = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    let resPokeJson = await resPokemons.json();
    resPokeJson.results.forEach((pokemon, index) => {
        pokeNameUrl.push({
        "id": index +1,
        "name": pokemon.name,
        "url": pokemon.url
        }); 
    });
}

// lade 20 Pokemondetails aus der url von Array pokeNameUrl und schreibe sie in ein Array
async function loadPokeDetails() {
    for (let i = start; i < end; i++) {
        let url = pokeNameUrl[i].url;
        let resPokeDetail = await fetch(url);
        let resPokeDetailJson = await resPokeDetail.json();
        pokeDetails.push({
            "abilities": resPokeDetailJson.abilities.map(a => a.ability.name),
            "types": resPokeDetailJson.types.map(t => t.type.name),
            "baseExperience": resPokeDetailJson.base_experience,
            "id": resPokeDetailJson.id,
            "height": resPokeDetailJson.height,
            "weight": resPokeDetailJson.weight,
            "imagePoke": resPokeDetailJson.sprites.other['official-artwork'].front_default,
            "id": resPokeDetailJson.id,
            "name": resPokeDetailJson.name,
            "hp": resPokeDetailJson.stats[0].base_stat,
            "attack": resPokeDetailJson.stats[1].base_stat,
            "defense": resPokeDetailJson.stats[2].base_stat,
            "specialAttack": resPokeDetailJson.stats[3].base_stat,
            "specialDefense": resPokeDetailJson.stats[4].base_stat,
            "speed": resPokeDetailJson.stats[5].base_stat,
        });
    };  
}

function renderPokemons() {
    let contentCards = document.getElementById('content-cards');
    contentCards.innerHTML = "";
    for (let i = 0; i < pokeDetails.length; i++) {
       contentCards.innerHTML += getCardsTemplate(i); 
    }    
}

function renderTypes(i) {
    let types = "";
    for (let typeIndex = 0; typeIndex < pokeDetails[i].types.length; typeIndex++) {
        types += getTypesTemplate(i, typeIndex);
    }
    return types;
}

async function loadMorePokemons() {
    start = start + 20;
    end = end + 20;
    await loadPokeDetails(start, end);
    renderPokemons();
    console.log(pokeDetails);
}

async function showDetailCard(i) {
    let contentOverlay = document.getElementById('content-overlay');
    contentOverlay.innerHTML = await getDetailCardTemplate(i);
    contentOverlay.classList.remove('dnone');
    document.body.classList.add('no-scroll');
}

function closeDetailCard() {
    let contentOverlay = document.getElementById('content-overlay');
    contentOverlay.classList.add('dnone');
    document.body.classList.remove('no-scroll');
}

function showLastPoke(i) {
    if (i == 0) {
        i = pokeDetails.length - 1;
        showDetailCard(i);
    } else {
        i = i - 1;
        showDetailCard(i);
    } 
}

function showNextPoke(i) {
    if (i == pokeDetails.length - 1) {
        i = 0;
        showDetailCard(i);
    } else {
        i = i + 1;
        showDetailCard(i);
    }
}

let evoChain = [];
let evoChainIdName = [];

async function createEvoChain(id) {

    try {
        let resEvoChain = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
        let resEvoChainJson = await resEvoChain.json();

        evoChain.push(resEvoChainJson);
        let evolutionNames = [evoChain[0].chain.species.name]; 

        if (evoChain[0].chain.evolves_to.length > 0) {
            evolutionNames.push(evoChain[0].chain.evolves_to[0].species.name); 
            if (evoChain[0].chain.evolves_to[0].evolves_to.length > 0) {
                evolutionNames.push(evoChain[0].chain.evolves_to[0].evolves_to[0].species.name);
            }
        } 
        evoChainIdName.push({
            "id": evoChain[0].id,
            "name": evolutionNames,
        })

    } catch (error) {
        console.error("Error fetching evolution chain:", error);
    }
}
