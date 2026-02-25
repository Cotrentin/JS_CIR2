function age(annee) {
    let age = anneeUTC - annee;
    console.log("Tu as " + age + " ans.");
}
const anneeUTC = new Date().getUTCFullYear();
let annee = prompt("En quelle année es-tu né ?");
age(annee);