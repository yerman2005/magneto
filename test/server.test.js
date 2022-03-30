const request = require('supertest');
const server = require('../models/server');
const {dbConnection} = require('../models/config');


const dbConnectionTest = async () => {
    await dbConnection()
    .then(clienteMongo => {
         server.dbo = clienteMongo;
    })
    .catch(err => console.log(err));
  }

  const dbConnectionClose = async () => {
    await server.dbo.close();
  };


describe('GET /stats', () => {
    beforeAll(dbConnectionTest);
    afterAll(dbConnectionClose);

    test('Should responde a status code 200',async()=>{
        const response = await request(server.app).get('/stats').set('Accept', 'application/json');
        expect(response.statusCode).toBe(200);
    })
})

describe('POST /mutant {isMutant: true}', () => {
    beforeAll(dbConnectionTest);
    afterAll(dbConnectionClose);

    test('Should responde a status code 200',async()=>{
        const dna = {"dna": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]};
        const response = await request(server.app).post('/mutant')
        .set('Accept', 'application/json')
        .send(dna);
        
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.statusCode).toBe(200);
        expect(response => {
            assert(response.body.isMutant, true)
        });
    })
})

describe('POST /mutant {isMutant: false}', () => {
    beforeAll(dbConnectionTest);
    afterAll(dbConnectionClose);
    test('Should responde a status code 403',async()=>{
        const dna ={"dna":["TTGCGA","CAGTGC","TTATGT","AGAAGG","ACCCTA","TCACTG"]};
        const response = await request(server.app).post('/mutant')
        .set('Accept', 'application/json')
        .send(dna);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.statusCode).toBe(403);
        expect(response => {
            assert(response.body.isMutant, false)
        });
    })
})

describe('POST /mutant {isValid: false} - Contiene una Z', () => {
    beforeAll(dbConnectionTest);
    afterAll(dbConnectionClose);
    test('Should responde a status code 400',async()=>{
        const dna ={"dna":["ZTGCGA","CAGTGC","TTATGT","AGAAGG","ACCCTA","TCACTG"]};
        const response = await request(server.app).post('/mutant')
        .set('Accept', 'application/json')
        .send(dna);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.statusCode).toBe(400);
        expect(response => {
            assert(response.body.isValid, false)
        });
    })
})

describe('POST /mutant {isValid: false} - No es de NxN', () => {
    beforeAll(dbConnectionTest);
    afterAll(dbConnectionClose);
    test('Should responde a status code 400',async()=>{
        const dna ={"dna":["TGCGA","CAGTGC","TTATGT","AGAAGG","ACCCTA","TCACTG"]};
        const response = await request(server.app).post('/mutant')
        .set('Accept', 'application/json')
        .send(dna);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        expect(response.statusCode).toBe(400);
        expect(response => {
            assert(response.body.isValid, false)
        });
    })
})