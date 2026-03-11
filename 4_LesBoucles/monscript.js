//  let i = 0;
// let somme = 0;

//  while (i < 101) {
//      somme += i;
//      i++;
// }

// console.log(somme);
// let j = 0;
// let i = prompt("choisissez un nombre :");
// if (isNaN(i)) {
//     alert("ce n'est pas un nombre, recommencez");
// }

// else{
//     do {
//         somme += j;
//         j++;
//  } while (j <= i);
//  console.log(somme);
// }

// let tab = [];
// if (tab.length < 10) {
    // while (tab.length <= 8) {
    //     tab.push(tab.length);
    //     console.log(tab[tab.length - 1]);
    // }
    
// }

let tab = [];

if (tab.length <= 10) {
    for (let i = 0; i <= 10; i++) {
        tab.push(i);
        console.log(tab[tab.length - 1]);
    }
}