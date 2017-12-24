/**
 * MIT License
 * 
 * Copyright (c) 2017 Caio Gomes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * @Author: Caio M. Gomes
 * @Project: Concurseiro Bot and API
 * @Data: December 2017
 * 
 * This software is intent to make downloads of the public contest data in the Brazil country
 * 
 * Future plans:
 * -> Make the bot itself receive the data of the place from the users acount.
 * -> Make a service to push in twitter once a new contest have been published.
 * -> Set the update flux of the system to 10 to 30 min.
 **/

"use strict";

let express = require('express');
let fs      = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let app     = express();
let _       = require('lodash');
let mongo   = require('mongodb');

let estados = {
    // Define a região de cada estado
    "Acre": {
        regiao: "norte",
        capital: "Rio Branco",
        sigla: "AC"
    },
    "Alagoas": {
        regiao: "nordeste",
        capital: "Maceió",
        sigla: "AL"
    },
    "Amapá": {
        regiao: "norte",
        capital: "Macapá",
        sigla: "AP"
    },
    "Amazonas": {
        regiao: "norte",
        capital: "Manaus",
        sigla: "AM"
    },
    "Bahia": {
        regiao: "nordeste",
        capital: "Salvador",
        sigla: "BA"
    },
    "Ceara": {
        regiao: "nordeste",
        capital: "Fortaleza",
        sigla: "CE"
    },
    "Distrito Federal": {
        regiao: "centro-oeste",
        capital: "Brasília",
        sigla: "DF"
    },
    "Espírito Santo": {
        regiao: "sudeste",
        capital: "Vitória",
        sigla: "ES"
    },
    "Goiás": {
        regiao: "centro-Oeste",
        capital: "Goiânia",
        sigla: "GO"
    },
    "Maranhão": {
        regiao: "nordeste",
        capital: "São Luís",
        sigla: "MA"
    },
    "Mato Grosso": {
        regiao: "centro-oeste",
        capital: "Cuiabá",
        sigla: "MT"
    },
    "Mato Grosso do Sul": {
        regiao: "centro-oeste",
        capital: "Campo Grande",
        sigla: "MS"
    },
    "Minas Gerais": {
        regiao: "Sudeste",
        capital: "Belo Horizonte",
        sigla: "MG"
    },
    "Pará": {
        regiao: "norte",
        capital: "Belém",
        sigla: "PA"
    },
    "Paraíba": {
        regiao: "nordeste",
        capital: "João Pessoa",
        sigla: "PB"
    },
    "Paraná": {
        regiao: "sul",
        capital: "Curitiba",
        sigla: "PR"
    },
    "Pernambuco": {
        regiao: "nordeste",
        capital: "Recife",
        sigla: "PE"
    },
    "Piauí": {
        regiao: "nordeste",
        capital: "Teresina",
        sigla: "PI"
    },
    "Rio de Janeiro": {
        regiao: "sudeste",
        capital: "Rio de Janeiro",
        sigla: "RJ"
    },
    "Rio Grande do Norte": {
        regiao: "nordeste",
        capital: "Natal",
        sigla: "RN"
    },
    "Rio Grande do Sul": {
        regiao: "sul",
        capital: "Porto Alegre",
        sigla: "RS"
    },
    "Rondônia": {
        regiao: "norte",
        capital: "Porto Velho",
        sigla: "RO"
    },
    "Roraima": {
        regiao: "norte",
        capital: "Boa Vista",
        sigla: "RR"
    },
    "Santa Catarina": {
        regiao: "sul",
        capital: "Florianópolis",
        sigla: "SC"
    },
    "São Paulo": {
        regiao: "sudeste",
        capital: "São Paulo",
        sigla: "SP"
    },
    "Sergipe": {
        regiao: "nordeste",
        capital: "Aracaju",
        sigla: "SE"
    },
    "Tocantins": {
        regiao: "norte",
        capital: "Palmas",
        sigla: "TO"
    }
};
let mongo_client = undefined;
let db = undefined;

/*******************************************************
 * Connection to Database Instructions and functions   *
 *******************************************************/
const MongoClient = mongo.MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost';

// Database Name
const dbName = 'Base_Concurseiro';

const insertDocument = function(db, insert_element, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(insert_element, function(err, result) {
    assert.equal(err, null);
    // console.log("Inserted documents into the collection:");
    // console.log(insert_element);
    callback(result);
  });
};

const findDocuments = function(db, restriction, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find(restriction).toArray(function(err, docs) {
    assert.equal(err, null);
    // console.log("Found the following records");
    // console.log(docs);
    callback(docs);
  });
};

const removeDocuments = function(db, delete_pattern, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  collection.deleteMany(delete_pattern, function(err, result) {
    assert.equal(err, null);
    console.log("Removed the document from pattern:");
    console.log(delete_pattern);
    callback(result);
  });    
};
//-----------------------------------------------------//

let data_obj = function (){};
data_obj.prototype.data_list = [];

String.prototype.capitalize = function() {
    this.toLowerCase();
    let next_up = 0;
    for (let i = 1; i < this.length; i++) {
        if(next_up === 1) {
            this[i] = this.charAt(i).toUpperCase();
        }
        
        if(this.charAt(i) === ' ') {
            next_up = 1;
        }
        else {
            next_up = 0;
        }
    }
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Obtém todos os concursos vigentes em um determinado estado, para encontrar
 * todos os do país basta utilizar a função para cada um dos estados nacionais.
 * TODO: add the data extracted from the page into a json.
 */
function getConcurso(state, callback) {
    
    // let sname = state.toLowerCase().capitalize();
    let sname = state;
    
    let acronym = "";
    acronym = estados[sname].sigla.toLowerCase();
    
    let url = "https://www.concursosnobrasil.com.br/concursos/" + acronym;
    let data_list = [];
    
    // console.log(url);
    // console.log(state);
    // console.log(acronym);
    
    request(url, function(error, response, html) {
        if(!error){
            let $ = cheerio.load(html); // convert the retreived data in a format
                                        // to be parsed as a JQuery
            $("table").filter(function(){
                let contests = $(this).find("tr");
                
                contests.each(function(){
                    let data = $(this).find("td");
                    
                    let vacancy = data.find("a");
                    let professionals = data.find(".details");
                    
                    if($(vacancy[0]).text() != "" && professionals.text() != "") { // check if it's void
                    
                        let links = $(this).find("a"); // Capture links
                        
                        data_list.push({
                           'estado': acronym,
                           'nome': $(vacancy[0]).text(),
                           'profissionais': professionals.text(),
                           'link': $(links[0]).attr('href'),
                           'vagas': $(data[1]).text()
                        });
                    }
                });
            });
        }

        callback(data_list);
    });
    
    // callback(data_list);
}

/**
 * This function needs push the received data in form of a json and pushs it into a database
 * It will be executed as a callback of the getConcurso function
 **/
function register_in_db(data) {
    // console.log("----------------------------------------------------");
    // console.log("CALLBACK DATA!!!!!!");

    if(db === undefined) {
        console.log("Database not connected yet!");
        return false;
    }

    for (var i = 0; i < data.length; i++) {
        let keys = Object.keys(data[i]); // Get the keys to work inside
        
        // for (var j = 0; j < keys.length; j++) {
        //     console.log(data[i][keys[j]]);
        // }
        
        /*****************
         * Code to check the database existence of contest
         * and if not insert it and put the status of some
         * new contest in the country.
         ******************/
        let search_restriction = {'nome': data[i].nome};
        let to_add = data[i];
        
        findDocuments(db, search_restriction, 
        (result) => {
            
            // console.log("result is: ");
            // console.log(result);
            
            if(result.length === 0) {
                // insertDocument(db, to_add, 
                //     () => {
                //         console.log("Inserted elements: " + to_add)
                //    }
                // );
                insertDocument(db, to_add).then((resolve)=>{
                    console.log("Inserted elements: " + to_add);
                }).catch((err)=>{
                    console.log(err);
                });
            }
            else{
                // console.log("None element Inserted");
            }
        });
        // console.log("\n");
    }
    
    /**
     * Code for checking if some event is no longer present in the list
     * it means, the contest is closed!
     **/
    
    // console.log("CALLBACK DATA!!!!!!");
    // console.log("----------------------------------------------------");
}

let haha = 0;
function collect_contests(callback) {
    let keys = Object.keys(estados);
    haha += 1;
    // console.log("haha: "+ haha);
    
    for (var i = 0; i < keys.length; i++) {
        // console.log("trying: " + keys[i]);
        getConcurso(keys[i], callback);
    }
}

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
    db = client.db(dbName);
    mongo_client = client;
});

// collect_contests(register_in_db);
let timer = setInterval(() => collect_contests(register_in_db), 10000);