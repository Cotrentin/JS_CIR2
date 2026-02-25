// let i = 0;
let somme = 0;

// while (i < 101) {
//     somme += i;
//     i++;
// }

// console.log(somme);
let j = 0;
let i = prompt("choisissez un nombre :");
if (isNaN(i)) {
    alert("ce n'est pas un nombre, recommencez");
}

else{
    do {
        somme += j;
        j++;
 } while (j <= i);
 console.log(somme);
}