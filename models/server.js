const express = require('express')
const cors = require('cors');
//const {dbConnection} = require('../database/config');
const {isMutant} = require('../mutant');
//const {DnaModel} = require('../models/dna');
const MongoClient = require('mongodb').MongoClient;


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        //this.connectDB();
        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.post('/mutant', function (req, res) {
            try{
                const result = isMutant(req.body.dna);
                const data = { dna: req.body.dna, isMutant : result};

                MongoClient.connect(process.env.MONGODB_CNN, (err, db) => {
                    if (err) throw err;
                    let dbo = db.db("magnetoDB");
                    dbo.collection("dnas").insertOne(data, (err, resDB) =>{
                        if (err) throw err;
                        db.close();
                        if(result == true){
                            res.status(200).json(data);
                        }else{
                            res.status(403).json(data);
                        }        
                    });
                });

            }catch(e){
                console.error(e);
                res.status(500).json({error: e.message});
            }
        });

        this.app.get('/stats', function (req, res) {
            
            MongoClient.connect(process.env.MONGODB_CNN, async(err, db) => {
                try{
                    const dbo = db.db("magnetoDB");
                    const queryCountMutant = { isMutant: true };
                    const queryCountNoMutant = { isMutant: false };
                    let countMutant = await dbo.collection("dnas").estimatedDocumentCount(queryCountMutant);
                    let countNoMutant = await dbo.collection("dnas").estimatedDocumentCount(queryCountNoMutant);
                    let countHumanDna = countMutant + countNoMutant;
                    const stats = {'count_mutant_dna': countMutant, 'count_human_dna': countHumanDna, 'ratio': countMutant/countHumanDna};
                    res.status(200).json(stats);        
                }catch(e){
                    res.status(500).json({error: e.mensage});        
                }
              });
        });
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Servidor corriendo en el puerto", this.port);
        });
    }
}

module.exports = Server;