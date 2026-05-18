const main = document.getElementById("pokemon-container");
const genSelect = document.getElementById("generation-select");
const sortSelect = document.getElementById("sort-select");
const shinyToggle = document.getElementById("shiny-toggle");
const typesContainer = document.getElementById("types");

let allPokemon = [];
let currentFilter = "Tous";

const genMap = {
    "1": { start: 1, end: 151 },
    "2": { start: 152, end: 251 },
    "3": { start: 252, end: 386 },
    "4": { start: 387, end: 493 },
    "5": { start: 494, end: 649 },
    "6": { start: 650, end: 721 },
    "7": { start: 722, end: 809 },
    "8": { start: 810, end: 898 }
};

const typeTranslations = {
    "grass": "Plante", "fire": "Feu", "water": "Eau", "bug": "Insecte",
    "normal": "Normal", "poison": "Poison", "electric": "Électrik",
    "fairy": "Fée", "fighting": "Combat", "psychic": "Psy",
    "rock": "Roche", "ground": "Sol", "ghost": "Spectre",
    "ice": "Glace", "dragon": "Dragon", "dark": "Ténèbres",
    "steel": "Acier", "flying": "Vol"
};

const typeColors = {
    "Plante": "#3DA224", "Feu": "#E72324", "Eau": "#2481EF", "Insecte": "#92A212",
    "Normal": "#A0A2A0", "Poison": "#923FCC", "Électrik": "#FAC100", "Fée": "#EF70EF",
    "Combat": "#FF8100", "Psy": "#EF3F7A", "Roche": "#B0AA82", "Sol": "#92501B",
    "Spectre": "#703F70", "Glace": "#3DD9FF", "Dragon": "#4F60E2", "Ténèbres": "#4F3F3D",
    "Acier": "#60A2B9", "Vol": "#82BAEF", "Tous": "#333333"
};

function createTypeButtons() {
    typesContainer.innerHTML = "";
    
    const btnAll = document.createElement("div");
    btnAll.textContent = "Tous";
    btnAll.style.backgroundColor = typeColors["Tous"];
    btnAll.classList.add("active");
    btnAll.dataset.type = "Tous";
    btnAll.addEventListener("click", () => handleTypeClick("Tous"));
    typesContainer.appendChild(btnAll);

    Object.values(typeTranslations).forEach(type => {
        if(!document.querySelector(`div[data-type="${type}"]`)) {
            const btn = document.createElement("div");
            btn.textContent = type;
            btn.style.backgroundColor = typeColors[type];
            btn.dataset.type = type;
            btn.addEventListener("click", () => handleTypeClick(type));
            typesContainer.appendChild(btn);
        }
    });
}

function handleTypeClick(selectedType) {
    currentFilter = selectedType;
    
    document.querySelectorAll("#types > div").forEach(btn => {
        if (btn.dataset.type === selectedType) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    applyFilters();
}

async function loadData(generation) {
    main.innerHTML = "<h2 style='color: white;'>Chargement...</h2>";
    
    try {
        const { start, end } = genMap[generation];
        const promises = [];
        
        for (let i = start; i <= end; i++) {
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
        }

        const rawData = await Promise.all(promises);
        
        allPokemon = rawData.map(p => {
            const typesArray = p.types.map(t => typeTranslations[t.type.name] || "Normal");
            return {
                id: p.id,
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
                types: typesArray,
                hp: p.stats.find(s => s.stat.name === "hp").base_stat,
                attack: p.stats.find(s => s.stat.name === "attack").base_stat,
                defense: p.stats.find(s => s.stat.name === "defense").base_stat,
                special_attack: p.stats.find(s => s.stat.name === "special-attack").base_stat,
                speed: p.stats.find(s => s.stat.name === "speed").base_stat,
                imageNormal: p.sprites.other["official-artwork"].front_default || p.sprites.front_default,
                imageShiny: p.sprites.other["official-artwork"].front_shiny || p.sprites.front_shiny || p.sprites.front_default
            };
        });

        applyFilters();

    } catch (error) {
        main.innerHTML = "<h2 style='color: red;'>Erreur de chargement</h2>";
    }
}

function applyFilters() {
    let arrayToDisplay = [...allPokemon];

    if (currentFilter !== "Tous") {
        arrayToDisplay = arrayToDisplay.filter(pokemon => pokemon.types.includes(currentFilter));
    }

    const sortBy = sortSelect.value;
    
    arrayToDisplay.sort((a, b) => {
        if (sortBy === "id") return a.id - b.id;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "hp") return b.hp - a.hp;
        if (sortBy === "attack") return b.attack - a.attack;
        if (sortBy === "type") return a.types[0].localeCompare(b.types[0]);
        return 0;
    });

    renderPokemon(arrayToDisplay);
}

function renderPokemon(pokemonArray) {
    main.innerHTML = "";

    if (pokemonArray.length === 0) {
        main.innerHTML = "<h2 style='color: white;'>Aucun Pokémon trouvé.</h2>";
        return;
    }

    const isShiny = shinyToggle.checked;

    pokemonArray.forEach(pokemon => {
        const article = document.createElement("article");
        const color = typeColors[pokemon.types[0]] || "#A0A2A0";
        
        article.style.borderColor = color;

        let typesHTML = pokemon.types.map(t => `<span class="types" style="background-color: ${typeColors[t]}">${t}</span>`).join("");
        const imageSrc = isShiny ? pokemon.imageShiny : pokemon.imageNormal;

        article.innerHTML = `
            <figure>
              <picture>
                <img src="${imageSrc}" alt="Image ${pokemon.name}" />
              </picture>
              <figcaption>
                <div class="type-container">
                    ${typesHTML}
                </div>
                <h2>${pokemon.name}</h2>
                <ol>
                  <li>Points de vie : ${pokemon.hp}</li>
                  <li>Attaque : ${pokemon.attack}</li>
                  <li>Défense : ${pokemon.defense}</li>
                  <li>Attaque spécial : ${pokemon.special_attack}</li>
                  <li>Vitesse : ${pokemon.speed}</li>
                </ol>
              </figcaption>
            </figure>
        `;

        main.appendChild(article);
    });
}

genSelect.addEventListener("change", (e) => {
    loadData(e.target.value);
});

sortSelect.addEventListener("change", () => {
    applyFilters();
});

shinyToggle.addEventListener("change", () => {
    applyFilters();
});

createTypeButtons();
loadData(genSelect.value);