let limit = 1;
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
    for (let i = limit; i < limit + 20; i++) {
        let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let pokeJson = await resPoke.json();
        pokemons.push(pokeJson);
    }
    console.log(pokemons);
}

function renderCards() { 
    for (let i = limit -1 ; i < pokemons.length; i++) {
        let contentCardsRef = document.getElementById('content-cards');       
        contentCardsRef.innerHTML += `        
            <div onclick="showDetailCard(${i})" class="card cards text-center" style="width: 12rem; margin: 12px;border: none;">
            <div class="card-header position-relative d-flex justify-content-center align-items-center">
                <span id="id-poke" class="card-text ps-2 position-absolute start-0">#${pokemons[i].id}</span>
                <h5 id="name-poke" class="card-title text-center m-0">${pokemons[i].name[0].toUpperCase() + pokemons[i].name.slice(1)}</h5>
            </div>
            <div class="card-body p-0 ${setBackgroundCardBody(i)}" style="height: 10rem;">
                <img id="img-poke" class="img-poke"
                src="${pokemons[i].sprites.other['official-artwork'].front_default}"
                class="card-img-top img-pokemon" alt="...">
            </div>
            <div id="types-poke${pokemons[i].id}" class="card-footer text-body-secondary d-flex align-items-center justify-content-evenly">
                ${renderTypes(i)}
            </div>
            </div>`
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

function getTypesTemplate(typeNames, j) {
  return `<span class="type rounded-5 px-2 text-black ${typeNames[j]}">${typeNames[j]}</span>`;
}

async function loadMorePokemons() {
    limit = limit + 20;
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

function closeDetailCard(i) {
    document.getElementById('content-overlay').classList.add('dnone');
}

async function showDetailCard(i) {
    document.getElementById('content-overlay').classList.remove('dnone');
    let contentOverlayRef = document.getElementById('content-overlay');
    evoChain.length = 0;
    evolution.length = 0;
    await loadEvoChain(i);
    console.log(evolution);
    

    contentOverlayRef.innerHTML =  `
        <div id="content-cards-overlay" class="container d-flex justify-content-center align-items-center">

            <div id="detail-card-pokemon" class="card text-center d-flex justify-content-center"
              style="width: 24rem; margin: 12px;border: none;">

              <div class="card-header d-flex justify-content-between align-items-center">
                <span id="id-poke" class="card-text ps-2">#${pokemons[i].id}</span>
                <h5 id="name-poke" class="card-title text-center m-0">${pokemons[i].name[0].toUpperCase() + pokemons[i].name.slice(1)}</h5>
                <button onclick="closeDetailCard(${i})" type="button" class="btn-close" aria-label="Close"></button>
              </div>

              <div class="card-body p-0 ${setBackgroundCardBody(i)}" style="height: 10rem;">
                <img id="img-poke" class="img-poke"
                  src="${pokemons[i].sprites.other['official-artwork'].front_default}"
                  class="card-img-top img-pokemon" alt="...">
              </div>

              <div id="types-poke${pokemons[i].id}"
                class="card-footer border-bottom-0 text-body-secondary d-flex align-items-center justify-content-evenly">
                ${renderTypes(i)}
              </div>

              <div class="register card text-center border-0">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item fw-bold">
                      <a class="nav-link active" aria-current="true" href="#main" data-bs-toggle="tab">main</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#stats" data-bs-toggle="tab">stats</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#evo-chain" data-bs-toggle="tab">evo chain</a>
                    </li>
                  </ul>
                </div>

                <div class="card-body p-4 pb-2 tab-content bg-white ">
                  <div class="tab-pane fade show active" id="main">
                    <div class="d-flex align-items-center">
                      <p class="card-text text-start w-50 fw-semibold">Height</p>
                      <p class="card-text text-start">${pokemons[i].height} m</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold">Weight</p>
                      <p class="card-text text-start">${pokemons[i].weight} kg</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold pr-3">Base Experience</p>
                      <p class="card-text text-start">${pokemons[i].base_experience}</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold">Abilities</p>
                      <p class="ability card-text text-start">${pokemons[i].abilities.map(abiliObj => abiliObj.ability.name).join(", ")}</p>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="stats">
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold mb-0 p-0">HP</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[0].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[0].base_stat)/2.55}%">${pokemons[i].stats[0].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">ATK</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[1].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[1].base_stat)/2.55}%">${pokemons[i].stats[1].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">DEF</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[2].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[2].base_stat)/2.55}%">${pokemons[i].stats[2].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SATK</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[3].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[3].base_stat)/2.55}%">${pokemons[i].stats[3].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SDEF</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[4].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[4].base_stat)/2.55}%">${pokemons[i].stats[4].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SPD</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[5].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[5].base_stat)/2.55}%">${pokemons[i].stats[5].base_stat}</div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="evo-chain">
                    <div class="d-flex justify-content-between">
                        ${renderEvolutionChain(i)}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>`
    
    
}

function renderEvolutionChain(i) {

    let contentEvoChain = "";
    let imagePokemon;
    for (let indexEvo = 0; indexEvo < evolution.length; indexEvo++) {
        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name == evolution[indexEvo]) {
                imagePokemon = pokemons[i].sprites.other['official-artwork'].front_default;
            }
        }
        contentEvoChain +=
            `<div class="d-flex justify-content-center align-items-center">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <img class="img-evo-chain" src="${imagePokemon}" alt="image-pokemon">
                        <p class="card-text text-start">${evolution[indexEvo][0].toUpperCase() + evolution[indexEvo].slice(1)}</p>
                </div>
                <img class="double-arrow" src="./assets/icons/double-arrow.png" alt="image-double-arrow">
            </div>`;
    }
    return contentEvoChain;
}

async function loadEvoChain(i) {
    let resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`);
    let resSpeciesJson = await resSpecies.json();
    let evoChainUrl = resSpeciesJson.evolution_chain.url;
    let resEvoChainUrl = await fetch(evoChainUrl);
    let evoChainJson = await resEvoChainUrl.json();
    evoChain.push(evoChainJson);
    console.log(evoChain);
    

    evolution.push(evoChain[0].chain.species.name);    
    if ((evoChain[0].chain.evolves_to.length > 0)) {
         evolution.push(evoChain[0].chain.evolves_to[0].species.name);
        if (evoChain[0].chain.evolves_to[0].evolves_to.length > 0) {
             evolution.push(evoChain[0].chain.evolves_to[0].evolves_to[0].species.name);;
        } 
    }
    console.log(evolution);

}

