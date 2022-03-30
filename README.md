# magneto
1)Instalación: npm install

2)Run server: node apirest.js

3)Run test: npm run test

4)Para consumir api-rest /mutant desde windows.
curl https://magneto-mutant-gjs.herokuapp.com/mutant --header "Content-Type: application/json" --data 
"{\"dna\":[\"ATGCGA\",\"CAGTGC\",\"TTATGT\",\"AGAAGG\",\"CCCCTA\",\"TCACTG\"]}" --verbose

5)Para consumir api-rest /stats desde windos.
curl https://magneto-mutant-gjs.herokuapp.com/stats --header "Content-Type: application/json"

