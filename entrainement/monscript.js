const main = document.querySelector("main");
const select = document.getElementById("generation-select");

async function loadData(generation) {
    main.innerHTML = "";
    
    const response = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/generation/${generation}`);
    const data = await response.json();

    data.forEach(pokemon => {
        const article = document.createElement("article");
        const typePokemon = pokemon.apiTypes[0].name;

        switch (typePokemon) {
            case "Plante":
                article.style.backgroundColor = "lightgreen";
                article.style.borderColor = "#3DA224";
                break;
            case "Feu":
                article.style.backgroundColor = "lightsalmon";
                article.style.borderColor = "#E72324";
                break;
            case "Eau":
                article.style.backgroundColor = "lightblue";
                article.style.borderColor = "#2481EF";
                break;
            case "Insecte":
                article.style.backgroundColor = "darkseagreen";
                article.style.borderColor = "#92A212";
                break;
            case "Normal":
                article.style.backgroundColor = "grey";
                article.style.borderColor = "#A0A2A0";
                break;
            case "Poison":
                article.style.backgroundColor = "thistle";
                article.style.borderColor = "#923FCC";
                break;
            case "Électrik":
                article.style.backgroundColor = "khaki";
                article.style.borderColor = "#FAC100";
                break;
            case "Fée":
                article.style.backgroundColor = "pink";
                article.style.borderColor = "#EF70EF";
                break;
            case "Combat":
                article.style.backgroundColor = "burlywood";
                article.style.borderColor = "#FF8100";
                break;
            case "Psy":
                article.style.backgroundColor = "plum";
                article.style.borderColor = "#EF3F7A";
                break;
            case "Roche":
                article.style.backgroundColor = "tan";
                article.style.borderColor = "#B0AA82";
                break;
            case "Sol":
                article.style.backgroundColor = "wheat";
                article.style.borderColor = "#92501B";
                break;
            case "Spectre":
                article.style.backgroundColor = "mediumpurple";
                article.style.borderColor = "#703F70";
                break;
            case "Glace":
                article.style.backgroundColor = "paleturquoise";
                article.style.borderColor = "#3DD9FF";
                break;
            case "Dragon":
                article.style.backgroundColor = "mediumslateblue";
                article.style.borderColor = "#4F60E2";
                break;
            case "Ténèbres":
                article.style.backgroundColor = "dimgrey";
                article.style.borderColor = "#4F3F3D";
                break;
            case "Acier":
                article.style.backgroundColor = "lightsteelblue";
                article.style.borderColor = "#60A2B9";
                break;
            case "Vol":
                article.style.backgroundColor = "skyblue";
                article.style.borderColor = "#82BAEF";
                break;
            default:
                article.style.backgroundColor = "white";
                article.style.borderColor = "black";
        }

        article.style.borderStyle = "solid";
        article.style.borderWidth = "4px";

        article.innerHTML = `
            <figure>
              <picture>
                <img src="${pokemon.image}" alt="Image ${pokemon.name}" />
              </picture>
              <figcaption>
                <span class="types">${typePokemon}</span>
                <h2>${pokemon.name}</h2>
                <ol>
                  <li>Points de vie : ${pokemon.stats.HP}</li>
                  <li>Attaque : ${pokemon.stats.attack}</li>
                  <li>Défense : ${pokemon.stats.defense}</li>
                  <li>Attaque spécial : ${pokemon.stats.special_attack}</li>
                  <li>Vitesse : ${pokemon.stats.speed}</li>
                </ol>
              </figcaption>
            </figure>
        `;

        main.appendChild(article);
    });
}

select.addEventListener("change", (event) => {
    console.log(event.target.value);
    loadData(event.target.value);
});

loadData(1);