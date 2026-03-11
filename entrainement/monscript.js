/* Toutes les variables */
let li = document.querySelector("#listeCourses li");
let dateJour = new Date(Date.now());
let dateJourFr = dateJour.toLocaleDateString("fr-FR");
let h2 = document.querySelector("h2");
let Myimput = document.querySelector("#myInput");
let Btn = document.querySelector(".btn");
let ul = document.querySelector("#listeCourses");

h2.textContent = "Liste de course :" + dateJourFr;


Btn.addEventListener("click", () => {
  addProduct();
});

Myimput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addProduct();
  }
});

function addProduct() {
  let value = Myimput.value;

  if (!value) {
    alert("Veuillez entrer un produit");
    return;
  } else {
    let li = document.createElement("li");
    li.addEventListener("click", () => {
      li.classList.toggle("itemCheck");
    });
    li.addEventListener("dblclick", () => {
      li.remove();
      alert("produit supprimé");
    });
    li.textContent = value;
    ul.appendChild(li);
    Myimput.value = "";
    alert("produit ajouté");
  }
}