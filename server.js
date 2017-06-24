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

// Mapa de estados
// TODO: Implementar uma busca dos estados que contém uma região para cada região
// Pré definida.
var estados = {
    // Define a região de cada estado
    "acre": {
        regiao: "norte",
        capital: "Rio Branco",
        sigla: "AC"
    },
    "alagoas": {
        regiao: "nordeste",
        capital: "Maceió",
        sigla: "AL"
    },
    "amapá": {
        regiao: "norte",
        capital: "Macapá",
        sigla: "AP"
    },
    "amazonas": {
        regiao: "norte",
        capital: "Manaus",
        sigla: "AM"
    },
    "bahia": {
        regiao: "nordeste",
        capital: "Salvador",
        sigla: "BA"
    },
    "ceara": {
        regiao: "nordeste",
        capital: "Fortaleza",
        sigla: "CE"
    },
    "distrito federal": {
        regiao: "centro-oeste",
        capital: "Brasília",
        sigla: "DF"
    },
    "espírito santo": {
        regiao: "sudeste",
        capital: "Vitória",
        sigla: "ES"
    },
    "goiás": {
        regiao: "centro-Oeste",
        capital: "Goiânia",
        sigla: "GO"
    },
    "maranhão": {
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

// console.log(estados["acre"].regiao);


// API.AI modules
var bodyParser = require('body-parser');

var port = "8081"; // Porta em que o app estará hospedado

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


// Endereço do website scraping
var url = "https://www.concursosnobrasil.com.br/concursos";

// Trata a requisição recebida
request(url, function(error, response, html) {
    
    // Caso não haja erro de captura pega os dados da página html escolhida
    if(!error){
        var $ = cheerio.load(html);


    // Checa se a ação a tomar é de obter concurso, se for executa isso
    if(req.body.result.action == "getConcurso") {
        // Obtém os dados
        var concursos = getConcurso("nacional", $);
        var justTest = getConcurso("nordeste", $);
        
        // console.log(concursos);
        // Põe os dados no pacote
        var pacote = {
            speech: '',
            displayText: '',
            source: 'BotConcurso'
        };
        pacote.speech = "Os concursos abertos são:\n" + concursos;
        
        console.log("Pacote enviado!");
        // console.log("pacote:");
        // console.log(pacote);
        // Retorna para o APIAI os dados
        return res.json(pacote);
    }
    
}

    }) ;
})

app.listen(port);

/**
 * Obtém todos os concursos vigentes no país.
 * TODO: Implementar as demais regiões
 */
function getConcurso(region, $) {
    
    // Carrega a página dos concursos
    var html = "https://www.concursosnobrasil.com.br/concursos";
    
    // Variáveis usadas para saída dos dados para o client
    var json = {text: ""};
    var outtext = "";
    
    if(region === "nacional") {
        
        // Le tudo de nacional
        // Pega todos os elementos da classe "regiao"
        $('#nacional').filter(function(){
                
            var data = $(this);
            
            // TODO: extrair do valor de topic
            // Escreve qual região aquele concurso está sendo oferecido
            if(data.attr("id") == 'nacional'){
                var org = data.find('.orgao');
                org.each(function(){
                    // console.log($(this).text() + " <" + $(this).attr('href') + ">");
                    outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                });
                
            }
            
            // title = data.text();
            json.tex = outtext;
        });    
    }
    
    // TODO: Adicionar para cada região uma busca para todos os estados e dizer
    // qual é qual.
    // TODO: Adicionar busca refinada por estado.
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
                        // console.log($(this).text() + " <" + $(this).attr('href') + ">");
                        outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                    });
                        
    
                });
                
                // title = data.text();
                json.tex = outtext;
            });  
        });
    }
    
    // console.log("text inside:");
    // console.log(outtext);
    
    return outtext;
}


/**
 * Obtém todos os concursos vigentes no país.
 * TODO: Pegar a região do estado e 
 */
function getConcurso_Estado(estado, $) {
    
    // Carrega a página dos concursos
    var html = "https://www.concursosnobrasil.com.br/concursos";
    
    // Variáveis usadas para saída dos dados para o client
    var json = {text: ""};
    var outtext = "";
    
    var region = estados[estado].regiao; // Resgata a região do estado
    
    // Le tudo da região
    $("#"+region).filter(function(){
        var places = $(this).find('table');
        places.each(function() { // Itera em cada estado
            
            // TODO: verificar se o estado da table bate com o estado
            // solicitado
            
            
            // Dentro de cada estado extrai as vagas
            $(this).filter(function() {
                
                var data = $(this);
                
                // Extrai qual o órgão de onde aquele concurso está sendo oferecido
                var org = data.find('.orgao');
                org.each(function(){
                    // console.log($(this).text() + " <" + $(this).attr('href') + ">");
                    outtext += $(this).text() + " <" + $(this).attr('href') + ">"+"\n";
                });
                    

            });
            
            // title = data.text();
            json.tex = outtext;
        });  
    });
    
    
    // console.log("text inside:");
    // console.log(outtext);
    
    return outtext;
}