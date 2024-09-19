let limit = 1;
let additionalLimit = 20;
let pokemons = [];
let evoChain = [];
let evolution = [];
let allPokemonNames = [];
let urls = [];
let findPokeNames = [];

async function loadAndShowPoke() {
    pokemons = [];
    evoChain = [];
    evolution = [];
    allPokemonNames = [];
    urls = [];
    
    showLoadMoreButton();
    showLoadingSpinner();
    await fetchAllPokemons(); 
    await fetchPokemons(); 
    renderCards(); 
    disableLoadingSpinner();
}

async function fetchPokemons() {
    for (let i = limit; i < limit + additionalLimit; i++) {
        try {
            let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            if (!resPoke.ok) {
                throw new Error(`Error fetching Pokémon with ID ${i}`);
            }
            let pokeJson = await resPoke.json();
            pokemons.push(pokeJson);
        } catch (error) {
            console.error(error);
        }
    }
}

async function loadEvoChain(i) {
    try {
        let id = pokemons[i].id;
        let resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        let resSpeciesJson = await resSpecies.json();
        let evoChainUrl = resSpeciesJson.evolution_chain.url;
        let resEvoChainUrl = await fetch(evoChainUrl);
        let evoChainJson = await resEvoChainUrl.json();        
        evoChain.push(evoChainJson); 
        pushArrayEvolutionData(evoChainJson);
    } catch (error) {
        console.error('Fehler beim Laden der Evolutionskette:', error);
    }
}

function pushArrayEvolutionData(evoChainJson) {
    evolution.push(evoChainJson.chain.species.name);
    if (evoChainJson.chain.evolves_to.length > 0) {
        evolution.push(evoChainJson.chain.evolves_to[0].species.name);
        if (evoChainJson.chain.evolves_to[0].evolves_to.length > 0) {
            evolution.push(evoChainJson.chain.evolves_to[0].evolves_to[0].species.name);
        }
    }
}

function renderCards() { 
    let contentCardsRef = document.getElementById('content-cards'); 
    contentCardsRef.innerHTML = "";
    for (let i = 0; i < pokemons.length; i++) {     
        contentCardsRef.innerHTML += getCardsTemplate(i); 
    }
}

function setBackgroundCardBody(i) {
    let typeNames = pokemons[i].types.map(typeObj => typeObj.type.name);
    return typeNames[0];
}

function renderTypes(i) { 
    let contentTypesName = "";
    let typeNames = pokemons[i].types.map(typeObj => typeObj.type.name);
    for (let j = 0; j < typeNames.length; j++) { 
        contentTypesName += getTypesTemplate(typeNames, j); 
    }
    return contentTypesName;
}

async function loadMorePokemons() {
    limit = limit + additionalLimit;
    showLoadingSpinner();
    await fetchPokemons();
    disableLoadingSpinner();
    renderCards();
}

function showLoadingSpinner() {
     document.getElementById('spinner-wrapper').classList.remove('disableLoadingSpinner');
}

function disableLoadingSpinner() {
    document.getElementById('spinner-wrapper').classList.add('disableLoadingSpinner');
}

function closeDetailCard() {
    document.getElementById('content-overlay').classList.add('dnone');
    document.body.classList.remove('no-scroll');
    let contentOverlayRef = document.getElementById('content-overlay');
    contentOverlayRef.innerHTML = "";
}

async function showDetailCard(i) {
    document.getElementById('content-overlay').classList.remove('dnone');
    document.body.classList.add('no-scroll');
    let contentOverlayRef = document.getElementById('content-overlay');
    evoChain = [];
    evolution = [];
    await loadEvoChain(i);
    contentOverlayRef.innerHTML = await getDetailCardTemplate(i); 
}

async function renderEvolutionChain() {
    let contentEvoChain = "";
    for (let indexEvo = 0; indexEvo < evolution.length; indexEvo++) { 
        for (let indexAllPoke = 0; indexAllPoke < allPokemonNames.length; indexAllPoke++) {
            contentEvoChain = await comparePokemonNameFetchLoadEvoImage(indexEvo, indexAllPoke, contentEvoChain);
        }
    }
    return contentEvoChain;
}

async function comparePokemonNameFetchLoadEvoImage(indexEvo, indexAllPoke, contentEvoChain) {
    let imagePokemonEvo;
              if (evolution[indexEvo] === allPokemonNames[indexAllPoke].name) {
                let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexAllPoke+1}`);
                let pokeJson = await resPoke.json();
                imagePokemonEvo = pokeJson.sprites.other['official-artwork'].front_default;
                contentEvoChain += getContentEvoChainTempate(imagePokemonEvo, indexEvo);                                
                if (indexEvo < evolution.length - 1) {
                    contentEvoChain += `<img class="double-arrow" src="./assets/icons/double-arrow.png" alt="image-double-arrow">`;
                }
    }   
    return contentEvoChain;
}

function showLastPoke(i) { 
  if (i == 0) {
    i = pokemons.length - 1;
  } else {
    i--;
    }
   showDetailCard(i);
}

function showNextPoke(i) {
  if(i == pokemons.length -1){
    i = 0;  
  } else {
    i++;
    }    
    showDetailCard(i);
}

async function fetchAllPokemons() {
    let res = await fetch('https://pokeapi.co/api/v2/pokemon/');
    let resJson = await res.json();
    let totalPokemons = resJson.count;
    let limitAllPoke = 20;
    let totalPages = Math.ceil(totalPokemons / limitAllPoke);
    createUrlList(limitAllPoke, totalPages);
    fetchAndPushUrlsToAllPokemons();
}

function createUrlList(limitAllPoke, totalPages) {
    for (let i = 0; i < totalPages; i++) {
        let offset = i * limitAllPoke;
        urls.push(`https://pokeapi.co/api/v2/pokemon?limit=${limitAllPoke}&offset=${offset}`);
    }
}

async function fetchAndPushUrlsToAllPokemons() {
    let results = await Promise.all(urls.map(url => fetchPage(url)));
    results.forEach(result => allPokemonNames.push(...result));
}

async function fetchPage(url) {
    let response = await fetch(url); 
    let data = await response.json(); 
    return data.results;
}

async function searchPokemon() {
    findPokeNames = [];
    let inputValueRef = document.getElementById('input-box');
    let inputValue = inputValueRef.value.toLowerCase();
    if (inputValue.length >= 3) { 
        document.getElementById('default-input').innerHTML = "";  
        findPokeNames = allPokemonNames.filter(pokemon => pokemon.name.includes(inputValue));
        await fetchPokemonsFounded();
        limit = 1;
        removeLoadMoreButton();
        renderCards();
        inputValueRef.value = "";
     } else {
        document.getElementById('default-input').innerHTML = "min. 3 Zeichen";   
    }
} 

async function fetchPokemonsFounded() {
    pokemons = [];
    for (let i = 0; i < findPokeNames.length; i++) {
        let url = findPokeNames[i].url;        
        let resPoke = await fetch(url);
        let pokeJson = await resPoke.json();
        pokemons.push(pokeJson);       
    }   
}

function removeLoadMoreButton() {
    document.getElementById('content-cards').innerHTML = "";
    document.getElementById('back-to-cards').classList.remove('dnone');
    document.getElementById('image-load-more').classList.add('dnone');
}

function showLoadMoreButton() {
    document.getElementById('back-to-cards').classList.add('dnone');
    document.getElementById('image-load-more').classList.remove('dnone');
}






