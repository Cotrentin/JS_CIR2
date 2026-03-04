let dateJour = new Date(Date.now());
let dateJourFr = dateJour.toLocaleDateString("fr-FR");
let h2 = document.querySelector("h2");
let Myimput = document.querySelector("#myInput");
let Btn = document.querySelector(".btn");
let ul = document.querySelector("#listeCourses");

h2.textContent = "Liste de course :" + dateJourFr;

let courses = JSON.parse(localStorage.getItem("liste_courses")) || [];

function displayCourses() {
  ul.innerHTML = "";
  courses.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.text} (x${item.quantity})`;
    
    if (item.checked) li.classList.add("itemCheck");

    li.addEventListener("click", () => {
      courses[index].checked = !courses[index].checked;
      saveAndRender();
    });

    li.addEventListener("dblclick", () => {
      courses.splice(index, 1);
      saveAndRender();
      alert("produit supprimé");
    });

    ul.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("liste_courses", JSON.stringify(courses));
  displayCourses();
}

function addProduct() {
  let value = Myimput.value.trim();

  if (!value) {
    alert("Veuillez entrer un produit");
    return;
  }

  let lowerValue = value.toLowerCase();
  let existingItem = courses.find(item => item.text.toLowerCase() === lowerValue);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    courses.push({
      text: value,
      quantity: 1,
      checked: false
    });
  }

  Myimput.value = "";
  saveAndRender();
}

Btn.addEventListener("click", addProduct);

Myimput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addProduct();
  }
});

displayCourses();