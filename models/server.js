require('dotenv').config();
const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../models/config');
const {isMutant, dnaIsValid} = require('../mutant');

class Server{
     constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.dbo;
        dbConnection()
            .then(clienteMongo => this.dbo = clienteMongo)
            .catch(err => console.log(err));
        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.post('/mutant', (req, res) => {
            try{
                const dataIsValid = dnaIsValid(req.body.dna, (response, reject)=>{
                    return { dna: req.body.dna, isValid : response, msg : reject};
                });
                if(dataIsValid.isValid){
                    const result = isMutant(req.body.dna);
                    const data = { dna: req.body.dna, isMutant : result};
    
                    this.dbo.db("magnetoDB").collection("dnas").insertOne(data, (err, resDB) =>{
                        if (err) throw err;
                        if(result == true){
                            res.status(200).json(data);
                        }else{
                            res.status(403).json(data);
                        }        
                    });    
                }else{
                    res.status(400).json(dataIsValid);
                }
            }catch(e){
                res.status(500).json({error: e.message});
            }
        });

        this.app.get('/stats', async (req, res) =>{
            try{
                const queryCountMutant = { 'isMutant': true };
                const queryCountNoMutant = { 'isMutant': false };
                let countMutant = await this.dbo.db("magnetoDB").collection("dnas").countDocuments(queryCountMutant);
                let countNoMutant = await this.dbo.db("magnetoDB").collection("dnas").countDocuments(queryCountNoMutant);
                let countHumanDna = countMutant + countNoMutant;
                const stats = {'count_mutant_dna': countMutant, 'count_human_dna': countHumanDna, 'ratio': countMutant/countHumanDna};
                res.status(200).json(stats);        
            }catch(e){
                res.status(500).json({error: e.message});        
            }
        });
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log("Servidor corriendo en el puerto", this.port);
        });
    }
}

const server = new Server();

module.exports = server;