let limit = 1;
let pokemons = [];

async function loadAndShopPoke() {
    showLoadingSpinner();
    await fetchPokemons();

    renderCards();
    disableLoadingSpinner();
}

async function fetchPokemons() {
    for (let i = limit; i < limit + 100; i++) {
        let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let pokeJson = await resPoke.json();
        pokemons.push(pokeJson);
    }
    console.log(pokemons);
}

function renderCards() { 
    for (let i = 0 ; i < pokemons.length; i++) {
        let contentCardsRef = document.getElementById('content-cards');       
        contentCardsRef.innerHTML += `        
            <div onclick="showDetailCard${pokemons[i].id}()" class="card text-center" style="width: 12rem; margin: 12px;border: none;">
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
    

    limit = limit + 100;
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