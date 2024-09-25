let pokeNameUrl = [];
let pokeDetails = [];
let evoChain = [];
let evoChainDetails = [];
let filteredPokemons = [];
let start = 0;
let end = 20;

async function init() {
    showLoadingSpinner();
    await loadAllPoke();
    await loadPokeDetails(start, end);
    renderPokemons();
    disableLoadingSpinner();
}

// lade alle pokemons und schreibe id, name und url in array "pokeNameUrl"
async function loadAllPoke() {
    let resPokemons = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0");
    let resPokeJson = await resPokemons.json();
    resPokeJson.results.forEach((pokemon, index) => {
        pokeNameUrl.push({
            "id": index + 1,
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
            "evoChainURL": "",
        });
    };
}

function renderPokemons() {
    let contentCards = document.getElementById('content-cards');
    contentCards.innerHTML = "";
    let currentPokemons = filteredPokemons.length > 0 ? filteredPokemons : pokeDetails;
    for (let i = 0; i < currentPokemons.length; i++) {
        let index = pokeDetails.findIndex(pokemon => pokemon.id === currentPokemons[i].id);
        if (index !== -1) {
            contentCards.innerHTML += getCardsTemplate(i);
        }
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
    showLoadingSpinner();
    start = start + 20;
    end = end + 20;
    await loadPokeDetails(start, end);
    renderPokemons();
    disableLoadingSpinner();
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

function showNextPoke(i) {
    let currentPokemons = filteredPokemons.length > 0 ? filteredPokemons : pokeDetails;
    if (currentPokemons.length <= 1) {
        console.log("Es gibt kein nächstes Pokémon zu zeigen."); // oder eine andere Methode zur Benachrichtigung
        return; // Funktion beenden, da kein nächstes Pokémon verfügbar ist
    }
    let currentIndex = currentPokemons.findIndex(pokemon => pokemon.id === pokeDetails[i].id);
    if (currentIndex == currentPokemons.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex += 1;
    }
    let nextPokeIndex = pokeDetails.findIndex(pokemon => pokemon.id === currentPokemons[currentIndex].id);
    showDetailCard(nextPokeIndex);
}

function showLastPoke(i) {
    let currentPokemons = filteredPokemons.length > 0 ? filteredPokemons : pokeDetails;
    if (currentPokemons.length <= 1) {
        console.log("Es gibt kein nächstes Pokémon zu zeigen."); // oder eine andere Methode zur Benachrichtigung
        return; // Funktion beenden, da kein nächstes Pokémon verfügbar ist
    }
    let currentIndex = currentPokemons.findIndex(pokemon => pokemon.id === pokeDetails[i].id);
    if (currentIndex == 0) {
        currentIndex = currentPokemons.length - 1;
    } else {
        currentIndex -= 1;
    }
    let prevPokeIndex = pokeDetails.findIndex(pokemon => pokemon.id === currentPokemons[currentIndex].id);
    showDetailCard(prevPokeIndex);
}

async function createEvoChain(i, id) {
    if (!evoChainDetails.find(element => element.id === id)) {
        try {
            let { evoChain, urlEvoChain } = await fetchEvoChain(id);
            let evolutionNames = [evoChain.chain.species.name];
            findEvoChainNames(evoChain, evolutionNames);
            let evoImages = await loadEvoImages(evolutionNames);
            await createArrayEvoChainDetails(i, id, urlEvoChain, evolutionNames, evoImages);
        } catch (error) {
            console.error("Error fetching evolution chain:", error);
        }
    }
}

async function fetchEvoChain(id) {
    let resEvoChainNumber = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    let resEvoChainNumberJson = await resEvoChainNumber.json();
    // Load evoChain Url
    let urlEvoChain = resEvoChainNumberJson['evolution_chain'].url;
    let resEvoChain = await fetch(urlEvoChain);
    let resEvoChainJson = await resEvoChain.json();
    return { evoChain: resEvoChainJson, urlEvoChain };
}

function findEvoChainNames(evoChain, evolutionNames) {
    if (evoChain.chain.evolves_to.length > 0) {
        evolutionNames.push(evoChain.chain.evolves_to[0].species.name);
        if (evoChain.chain.evolves_to[0].evolves_to.length > 0) {
            evolutionNames.push(evoChain.chain.evolves_to[0].evolves_to[0].species.name);
        }
    }
    return evolutionNames;
}

async function loadEvoImages(evolutionNames) {
    let evoImages = {};
    for (let name of evolutionNames) {
        let resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        let resPokeJson = await resPoke.json();
        evoImages[name] = resPokeJson.sprites.other['official-artwork'].front_default;
    }
    return evoImages;
}

async function createArrayEvoChainDetails(i, id, urlEvoChain, evolutionNames, evoImages) {
    evoChainDetails.push({
        "i": i,
        "id": id,
        "evoChainURL": urlEvoChain,
        "idEvoChain": evoChain.id,
        "namesEvoChain": evolutionNames,
        "imgPoke": evoImages,
    })
}

function renderEvoChain(i) {
    let detailEvo = "";
    let evoDetail = evoChainDetails.find(detail => detail.i === i);
    if (evoDetail) {
        for (let index = 0; index < evoDetail.namesEvoChain.length; index++) {
            let name = evoDetail.namesEvoChain[index];
            let image = evoDetail.imgPoke[name];
            detailEvo += evoChainTemplate(name, image);
            if (index < evoDetail.namesEvoChain.length - 1) {
                detailEvo += getArrowIfNeeded();
            }
        }
    }
    return detailEvo;
}

function showLoadingSpinner() {
    document.getElementById('spinner-wrapper').classList.remove('disableLoadingSpinner');
}

function disableLoadingSpinner() {
    document.getElementById('spinner-wrapper').classList.add('disableLoadingSpinner');
}

async function searchPokemons() {
    let input = document.getElementById('input-box').value.trim().toLowerCase();
    if (input.length < 3) {
        document.getElementById('default-input').innerHTML = "min. 3 Zeichen";
        filteredPokemons = []; // Leere gefilterte Pokémon
    } else {
        document.getElementById('default-input').innerHTML = "";
        filteredPokemons = pokeNameUrl.filter(pokemon => pokemon.name.includes(input));
        if (filteredPokemons.length === 0) {
            document.getElementById('default-input').innerHTML = "Kein Pokémon gefunden";
            return; // Keine Pokémon gefunden
        }

        await loadFilteredPokeDetails(); // Lade die gefilterten Pokémon
        renderPokemons(); // Rendre die gefilterten Pokémon
        document.getElementById('image-load-more').classList.add('dnone'); // Verstecke den "Load More"-Button
        document.getElementById('back-to-cards').classList.remove('dnone'); // Zeige den "Zurück"-Button

        document.getElementById('input-box').value = ""; // Leere das Eingabefeld
    }
}
async function loadFilteredPokeDetails() {
    showLoadingSpinner();
    for (let i = 0; i < filteredPokemons.length; i++) {
        let filteredPoke = filteredPokemons[i];
        if (!pokeDetails.find(pokemon => pokemon.id === filteredPoke.id)) {
            try {
                let resPokeDetail = await fetch(filteredPoke.url);
                let resPokeDetailJson = await resPokeDetail.json();
                pokeDetails.push({
                    "abilities": resPokeDetailJson.abilities.map(a => a.ability.name),
                    "types": resPokeDetailJson.types.map(t => t.type.name),
                    "baseExperience": resPokeDetailJson.base_experience,
                    "id": resPokeDetailJson.id,
                    "height": resPokeDetailJson.height,
                    "weight": resPokeDetailJson.weight,
                    "imagePoke": resPokeDetailJson.sprites.other['official-artwork'].front_default,
                    "name": resPokeDetailJson.name,
                    "hp": resPokeDetailJson.stats[0].base_stat,
                    "attack": resPokeDetailJson.stats[1].base_stat,
                    "defense": resPokeDetailJson.stats[2].base_stat,
                    "specialAttack": resPokeDetailJson.stats[3].base_stat,
                    "specialDefense": resPokeDetailJson.stats[4].base_stat,
                    "speed": resPokeDetailJson.stats[5].base_stat,
                });
            } catch (error) {
                console.error("Fehler beim Laden der Pokémon-Details:", error);
            }
        }
    }
    disableLoadingSpinner();
}

function showAlreadyLoadedPokemons() {
    filteredPokemons = [];
    renderPokemons();
    document.getElementById('image-load-more').classList.remove('dnone');
    document.getElementById('back-to-cards').classList.add('dnone');
}
