const isMutant = (dna) => {
    //console.log(dna);
    const length = dna.length;
    let matrix = new Array(length*6);
    let rowMatrixIndex = 0;

    //validacion NxN / Validacion de caracteres
    if(dna == null){
        console.log("El dna es null.");
        throw new Error("El dna es null.");
    }

    for(let i = 0; i <  dna.length; i++){
        if(dna[i].length !=  dna.length){
            console.log("La secuencia no es de NxN");
            throw new Error("La secuencia no es de NxN");
        }
        for(let j = 0; j <  dna.length; j++){
            if(!isValidCharacter(dna[i][j])){
                console.log('No es una secuencia válida.');
                throw new Error('No es una secuencia válida.');
            }
        }
    }

    //Inicializacion de matriz
    for(let i = 0; i < matrix.length; i++){
        matrix[i] = new Array(length);
    }    
    
    //Cargo matriz de izquierda a derecha
   for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            if(!isValidCharacter(dna[i][j])){
                throw new Error('No es una secuencia válida.');
            }
            matrix[rowMatrixIndex][j] = dna[i][j];
        }
        rowMatrixIndex++;
    }

    //Cargo matriz de arriba a abajo
    for(let i = 0; i < length; i++){
        for(let j = 0; j < length; j++){
            matrix[rowMatrixIndex][j] = dna[j][i];
        }
        rowMatrixIndex++
    }

    //Cargo matriz con pendiente negativa
    for(let i = (length - 1); i > -length; i--){    
        for(let j = 0; j < length; j++){
            if((i+j) < length && (i+j) >= 0){
                matrix[rowMatrixIndex][j] = dna[i+j][j];                
            }
        }
        rowMatrixIndex++
    }

    //Cargo matriz con pendiente positiva
    for(let i = 0; i < length*2; i++){    
        for(let j = 0; j < length; j++){
            if((i-j) < length && (i-j) >= 0){
                matrix[rowMatrixIndex][j] = dna[i-j][j];                
            } 
        }
        rowMatrixIndex++
    }

    let newArray = matrix.map((array)=>{
        return array.join('');
    });

    let sequencesFound = 0;
    newArray.forEach(element => {    
        let mat = isMatch(element);
        if(mat){
            sequencesFound++;
        }        
    });

    return sequencesFound > 1;
}

const isMatch = (element) => {    
    let mat = element.match(/A{4}|T{4}|C{4}|G{4}/);
    return mat != null;
}

const isValidCharacter = (character) => {
    return(character === 'A' || character === 'T' || character === 'C' || character === 'G');
}

module.exports = {isMutant}