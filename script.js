let limit = 1;
let additionalLimit = 20;
let pokemons = [];
let evoChain = [];
let evolution = [];
    
async function loadAndShowPoke() {
    showLoadingSpinner();
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
    console.log(pokemons);
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
  