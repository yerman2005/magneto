const {isMutant} = require('./mutant');

const main = () =>{
    console.clear();
    const response = false;
    const dna = ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"];
    //const dna = ["AAAAAA","CATTTT","TTATGT","AGAAGG","CTCCTA","TGGGGA"];
    isMutant(dna) ? console.log("Es mutante") : console.log("No es mutante");    
}

main();
