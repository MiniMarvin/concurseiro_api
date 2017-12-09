/**
 * Facebook bot para atualizar sobre os concursos públicos abertos no Brasil
 * 
 * TODO: Expandir para o twitter
 * TODO: Implementar um banco de dados de cada usuário para saber quais usuários
 * que estão em cada região do país e atualizar periodicamente eles sobre novos
 * concursos no país e na sua região.
 * TODO: Implementar recomendação de material para concurso.
 * TODO: Implementar busca por estado, pois no site do concursos no brasil há 
 * uma página para cada estado.
 * 
 * Referências:
 * - https://github.com/api-ai/apiai-webhook-sample/blob/master/index.js
 * - https://scotch.io/tutorials/scraping-the-web-with-node-js
 * - https://discuss.api.ai/t/card-json-response-webhook/2258/2
 */

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var _       = require('lodash');

// Mapa de estados
// TODO: Implementar uma busca dos estados que contém uma região para cada região
// Pré definida.
// OBS: Os estados estão listados como completamente capitalizados no site.
var estados = {
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

// API.AI modules
var bodyParser = require('body-parser');
var port = "8081"; // Porta em que o app estará hospedado

// Variáveis de comunicação
var concursos;
var pacote= {
            speech: '',
            displayText: '',
            source: 'BotConcurso'
        };

// Processa o corpo da requisição transformando em um JSON
app.use(bodyParser.json()); 

// Joga o serviço em /
app.post('/', function(req, res) { 

    // Plota a requisição recebida
    // console.log(req.body);
    // console.log("Sent by:");
    // console.log(req.body.originalRequest.data.sender);
    // console.log(req.body.originalRequest.data.recipient);
    // console.log(req.body.originalRequest.data.message);
    
    // Obtém dado do JSON
    console.log("\n\nação a tomar: " + req.body.result.action); 
    
    // Checa se a ação a tomar é de obter concurso, se for executa isso
    if(req.body.result.action == "getConcurso") {
        // Obtém os dados
        concursos = getConcurso("nacional");
        
        // Põe os dados no pacote
        pacote.speech = "Os concursos nacionais abertos são:\n" + concursos;
        
        
    }
    
    else if( req.body.result.action == "getRegion") {
        console.log(req.body.result.parameters.region);
        // getConcurso_Estado();
        
        // Põe os dados no pacote
        pacote.speech = "Os concursos abertos na região " + req.body.result.parameters.region + "são:\n" + concursos;
        
    }
    
    else if(req.body.result.action == "getConcursoEstado") {
        console.log(req.body.result.parameters.Estado);
        concursos = getConcurso_Estado(req.body.result.parameters.Estado);
        
        
        // Põe os dados no pacote
        pacote.speech = "Os concursos abertos em " + req.body.result.parameters.Estado + " são:\n" + concursos;
        
    }
    
    // Retorna para o APIAI os dados
    return res.json(pacote);
    
    // // Trata a requisição recebida
    // request(url, function(error, response, html) {
        
    //     // Caso não haja erro de captura pega os dados da página html escolhida
    //     if(!error){
    //         var $ = cheerio.load(html);
            
    //     }
    
    // });
})

app.listen(port);

/**
 * Obtém todos os concursos vigentes no país.
 * TODO: Implementar as demais regiões
 */
function getConcurso(region) {
    
    var url = "https://www.concursosnobrasil.com.br/concursos";
    var outtext = "";
    
    // Realiza uma requisição para a página principal
    request(url, function(error, response, html) {
        
        // Caso não haja erro de captura pega os dados da página html escolhida
        if(!error){
            var $ = cheerio.load(html);
            
            // Trata concursos nacionais
            if(region === "nacional") {
                
                // Le tudo de nacional
                // Pega todos os elementos da classe "regiao"
                $('#nacional').filter(function(){
                        
                    var data = $(this);
                    
                    // TODO: extrair do valor de topic
                    // Escreve qual região aquele concurso está sendo oferecido

                    var org = data.find('.orgao');
                    org.each(function(){
                        outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                    });
                });    
            }
        
            // Todos os demais concursos
            else {
                // Le tudo da região
                $("#"+region).filter(function(){
                    var places = $(this).find('table');
                    places.each(function() { // Itera em cada estado
                        // Dentro de cada estado extrai as vagas
                        $(this).filter(function() {
                            
                            var data = $(this);
                            
                            // Extrai qual o órgão de onde aquele concurso está sendo oferecido
                            var org = data.find('.orgao');
                            org.each(function(){
                                outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                            });
                        });
                    });  
                });
            }
        }
        
        console.log(outtext);
    });
    
    
    
    return outtext;
}


/**
 * Obtém todos os concursos vigentes no país.
 * TODO: Pegar a região do estado e 
 */
function getConcurso_Estado(estado) {
    
    // Carrega a página dos concursos
    var html = "https://www.concursosnobrasil.com.br/concursos/";
    /**
     * Põe o nome do estado em um formato específico
     **/
     
    // Se está em forma de sigla transforma para o nome
    if(estado.length == 2) {
        _.toUpper(estado);
        for(var st in estados) {
            if(st.sigla == estado) {
                estado = st;
            }
        }
    }
    else { // Converte para o formato da tabela.
        estado = _.startCase(_.toLower(estado));
    }
    
    console.log(estado + " | " + estados[estado].sigla);
    
    // obtém a sigla do estado
    var url = html + _.toLower(estados[estado].sigla);
    var outtext = "";
    
    console.log(url);
    
    // Requisita do site os dados do estado
    request(url, function(error, response, html) {
        
        // Caso não haja erro de captura pega os dados da página html escolhida
        if(!error){
            var $ = cheerio.load(html);
        
            // Le toda a pagina
            $("body").filter(function(){
                 
                // Extrai as informações da página
                $(this).filter(function() {
                    var data = $(this);
                    
                    // Extrai qual o órgão de onde aquele concurso está sendo oferecido
                    var org = data.find('.orgao');
                    org.each(function(){
                        // console.log($(this).text() + " <" + $(this).attr('href') + ">");
                        outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                    });
                    console.log("concursos: " + outtext);
                });
            });
        }
    });
    
    return outtext;
}