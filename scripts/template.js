function getCardsTemplate(i) {
    return `        
            <div onclick="showDetailCard(${i})" class="cards text-center ${setBackgroundCardBody(i)}" style="width: 14rem; margin: 12px;">
              <div class="card-header border-0 ${setBackgroundCardBody(i)} text-light p-3 position-relative d-flex flex-column justify-content-center align-items-center">
                  <h6 id="id-poke" class="card-text ps-3 pt-2 ">#${pokemons[i].id}</h6>
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

function getTypesTemplate(typeNames, j) {
  return `<span class="type rounded-4 px-2 text-light ${typeNames[j]}">${typeNames[j]}</span>`;
}

function getDetailCardTemplate(i) {
    return `
        <div id="content-cards-overlay" class="content-cards-overlay d-flex justify-content-center align-items-center" >
            <div id="detail-card-pokemon" class="card text-center d-flex justify-content-center" style="width: 24rem; margin: 12px;border: none;">
              <div class="card-header ${setBackgroundCardBody(i)} text-light p-2 border-0 d-flex justify-content-between align-items-center">
                <h6 id="id-poke" class="card-text ps-3 pt-2">#${pokemons[i].id}</h6>
                <h4 id="name-poke" class="card-title text-center m-0">${pokemons[i].name[0].toUpperCase() + pokemons[i].name.slice(1)}</h4>
                <button onclick="closeDetailCard(${i})" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
              </div>
              <div class="card-body p-0 ${setBackgroundCardBody(i)} d-flex justify-content-around align-items-center" style="height: 10rem;">
                <img onclick="showLastPoke(${i})" id="img-last-poke" class="img-last-poke" src="./assets/icons/arrow-left.png" alt="image-arrow-left">
                <img id="img-poke-overlay" class="img-poke-overlay"
                  src="${pokemons[i].sprites.other['showdown'].front_default}"
                  class="card-img-top img-pokemon" alt="image-pokemon">
                <img onclick="showNextPoke(${i})" id="img-next-poke" class="img-next-poke" src="./assets/icons/arrow-right.png" alt="image-arrow-right">
              </div>
              <div id="types-poke${pokemons[i].id}"
                class="card-footer border-0 py-4 text-body-secondary d-flex align-items-center justify-content-center gap-3">
                ${renderTypes(i)}
              </div>
              <div class="register card text-center border-0 w-100">
                <div class="card-header p-0 m-0 w-100 d-flex justify-content-center align-items-center">
                  <ul class="nav nav-tabs m-0 card-header-tabs w-100 nav-justified d-flex justify-content-center align-items-center">
                    <li class="nav-item fw-bold">
                      <a class="nav-link active" aria-current="true" href="#main" data-bs-toggle="tab">About</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#stats" data-bs-toggle="tab">Stats</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#evo-chain" data-bs-toggle="tab">Evolution</a>
                    </li>
                  </ul>
                </div>
                <div class="card-body p-4 tab-content bg-white ">
                  <div class="tab-pane fade show active" id="main">
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold">Height</p>
                      <p class="card-text text-start text-align-center">${pokemons[i].height} m</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold">Weight</p>
                      <p class="card-text text-start">${pokemons[i].weight} kg</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold pr-3">Experience</p>
                      <p class="card-text text-start">${pokemons[i].base_experience}</p>
                    </div>
                    <div class="d-flex">
                      <p class="card-text text-start w-50 fw-semibold mb-0 pb-0">Abilities</p>
                      <p class="ability card-text text-start mb-0 pb-0">${pokemons[i].abilities.map(abiliObj => abiliObj.ability.name).join(", ")}</p>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="stats">
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold mb-0 p-0">HP</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[0].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[0].base_stat) / 2.55}%">${pokemons[i].stats[0].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">ATK</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[1].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[1].base_stat) / 2.55}%">${pokemons[i].stats[1].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">DEF</p>
                      <div class="progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[2].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[2].base_stat) / 2.55}%">${pokemons[i].stats[2].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SATK</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[3].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[3].base_stat) / 2.55}%">${pokemons[i].stats[3].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SDEF</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[4].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[4].base_stat) / 2.55}%">${pokemons[i].stats[4].base_stat}</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <p class="card-text text-start w-25 fw-semibold m-0 p-0">SPD</p>
                      <div class=" progress w-75" role="progressbar" aria-label="Danger example" aria-valuenow="${pokemons[i].stats[5].base_stat}"
                        aria-valuemin="0" aria-valuemax="255">
                        <div class="progress-bar bg-danger" style="width:${(pokemons[i].stats[5].base_stat) / 2.55}%">${pokemons[i].stats[5].base_stat}</div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="evo-chain">
                    <div class="d-flex justify-content-evenly align-items-center">
                        ${renderEvolutionChain(i)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
    }