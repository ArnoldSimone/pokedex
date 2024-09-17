let limit = 1;
let additionalLimit = 20;
let pokemons = [];
let evoChain = [];
let evolution = [];
    
async function loadAndShowPoke() {
    
    showLoadingSpinner();
    await fetchAllPokemons();
    await fetchPokemons();
    renderCards();
    disableLoadingSpinner();
}

async function fetchPokemons() {
    for (let i = limit; i < limit + additionalLimit; i++) {
        let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let pokeJson = await resPoke.json();
        pokemons.push(pokeJson);
    }
}

function renderCards() { 
  for (let i = limit - 1; i < pokemons.length; i++) {
    let contentCardsRef = document.getElementById('content-cards');       
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
    evoChain.length = 0;
    evolution.length = 0;
    await loadEvoChain(i);
    contentOverlayRef.innerHTML = getDetailCardTemplate(i); 
}

function renderEvolutionChain() {
    let contentEvoChain = "";
    let imagePokemon;
    for (let indexEvo = 0; indexEvo < evolution.length; indexEvo++) {
        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name == evolution[indexEvo]) {
                imagePokemon = pokemons[i].sprites.other['official-artwork'].front_default;
            }
      }
      if (indexEvo < evolution.length-1){
        contentEvoChain +=
            `   <div class="d-flex flex-column justify-content-center align-items-center">
                  <img class="img-evo-chain" src="${imagePokemon}" alt="image-pokemon">
                  <p class="card-text text-start">${evolution[indexEvo][0].toUpperCase() + evolution[indexEvo].slice(1)}</p>
                </div> 
                <img class="double-arrow" src="./assets/icons/double-arrow.png" alt="image-double-arrow">`;
      } else {
          contentEvoChain +=
            `   <div class="d-flex flex-column justify-content-center align-items-center">
                  <img class="img-evo-chain" src="${imagePokemon}" alt="image-pokemon">
                  <p class="card-text text-start">${evolution[indexEvo][0].toUpperCase() + evolution[indexEvo].slice(1)}</p>
                </div>`;
        }
    }
    return contentEvoChain;
}

async function loadEvoChain(i) {
    try {
        let resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`);
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

function showLastPoke(i) { 
  if (i == 0) {
    i = pokemons.length - 1;
  } else {
    i--;
  }
   showDetailCard(i);
}

function showNextPoke(i) {
  if(i == pokemons.length-1){
    i = 0;  
  } else {
    i++;
  }
showDetailCard(i);
}
  





let allPokemons = [];
let urls = [];

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
    results.forEach(result => allPokemons.push(...result));
}

async function fetchPage(url) {
    let response = await fetch(url); 
    let data = await response.json(); 
    return data.results;
}


console.log(allPokemons);

let findPoke = [];

function searchPokemon() {

    findPoke = [];
    let inputBoxRef = document.getElementById('input-box');

    if ( inputBoxRef.value.length >= 3) {
        for (let i = 0; i < allPokemons.length; i++) {
            if ((allPokemons[i].name).includes(inputBoxRef.value)) {
                findPoke.push(allPokemons[i].name);
                console.log(findPoke);
            }; 
            renderAllFindPokemons(i);
        }    
    } else {
        console.log('min. 3 Zeichen');   
    }
} 



function renderAllFindPokemons(i) {
let contentCardsRef = document.getElementById('content-cards');       
    for (let i = 0; i < 10; i++) {
        
        contentCardsRef.innerHTML = "";
        
        contentCardsRef.innerHTML += getFindCardsTemplate(i); 
        }

}

function getFindCardsTemplate(i) {
    return `        
            <div onclick="showDetailCard(${i})" class="cards text-center ${setBackgroundCardBody(i)}" style="width: 14rem; margin: 12px;">
              <div class="card-header border-0 ${setBackgroundCardBody(i)} text-light p-3 position-relative d-flex justify-content-center align-items-center">
                  <h6 id="id-poke" class="card-text ps-3 pt-2 position-absolute start-0 ">#${pokemons[i].id}</h6>
                  <h5 id="name-poke" class="card-title text-center">${pokemons[i].name[0].toUpperCase() + pokemons[i].name.slice(1)}</h5>
              </div>
              <div class="card-body p-0 m-0 ${setBackgroundCardBody(i)}" style="height: 10rem;">
                  <img id="img-poke" class="img-poke"
                  src="${pokemons[i].sprites.other['official-artwork'].front_default}"
                  class="card-img-top img-pokemon" alt="image-pokemon">
              </div>
              <div id="types-poke${pokemons[i].id}" class=" m-0 card-footer bg-gradient opacity-100 ${setBackgroundCardBody(i)} py-3 text-body-secondary d-flex align-items-center justify-content-evenly">
                  ${renderTypes(i)}
              </div>
            </div>`;
}
    
