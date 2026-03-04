async function afficherPokemons() {
    const main = document.querySelector("main");
    main.innerHTML = "";

    const response = await fetch("./data/data.json"); 
    const data = await response.json();
    
    data.forEach(pokemon => {
        const article = document.createElement("article");
        const typePokemon = pokemon.apiTypes[0].name;

        switch (typePokemon) {
            case "Plante":
                article.style.backgroundColor = "green";
                article.style.borderColor = "darkgreen";
                break;
            case "Feu":
                article.style.backgroundColor = "orange";
                article.style.borderColor = "darkorange";
                break;
            case "Eau":
                article.style.backgroundColor = "blue";
                article.style.borderColor = "darkblue";
                break;
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

afficherPokemons();