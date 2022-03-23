const express = require('express')
const cors = require('cors');
const {isMutant} = require('../mutant');


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    routes(){
        this.app.post('/mutant', function (req, res) {
            try{
                const result = isMutant(req.body.dna);
                const data = { dna: req.body.dna, isMutant : result};
                if(result == true){
                    res.status(200).json({data});
                }else{
                    res.status(403).json(data);
                }    
            }catch(e){
                res.status(400).json({dna: req.body.dna, isValid : false});
            }
          })
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