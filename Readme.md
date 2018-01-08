# Bot Concurseiro
### Descrição
Essa aplicação é um bot que se propõe a deixar disponível para os usuários os concursos abertos no Brasil, seja esse concurso público, científico ou mesmo de poesia, alertando os usuários sempre que um novo concurso estiver aberto ou quando estiver perto de fechar. Essas atualizações serão feitas por meio de inscrições do usuário no sistema e o objetivo é fazer com que cada usuário tenha uma conta fazendo com que o sistema só recomende para o usuário algo que ele provavelmente gostaria.

### Como posso usar?
O sistema será disponibilizado nas seguintes plataformas:
* Um webapp que lista todos os concursos abertos a partir de um menu de seleção (seja por ordem de vagas, por disponibilidade de vaga, advogado, ensino médio, etc...) podendo escolher o tipo do concurso
* Um aplication android que é um clone do webapp para ficar disponível na Playstore
* Um bot de página de facebook que realiza um post toda vez que surge um novo concurso
* Um bot de twitter que realiza um post toda vez que surge um novo concurso
* Um bot de messenger que permite ao usuário se inscrever para receber atualizações toda vez que sair alguma

### Como a API funciona?
A API do concurseiro é uma API Restful que recebe dois parãmetros, a Sigla do estado brasileiro desejado e o público desejado, o funcionamento é com Regex, ou seja, funciona com frações das siglas ou do público desejado, retornando todos os concursos abertos quando consultada sem nenhum parâmetro.
O retorno da API segue a seguinte estrutura:
{
    'estado': O estado em que o concurso está aberto,
    'nome': O nome do concurso,
    'profissionais': A formação da pessoa para aplicar para o concurso,
    'link': O link no Concursos do Brasil explicando o concurso,
    'vagas': O número de vagas do concurso,
    'data_inicio': a data que o sistema recuperou o concurso do Concursos no Brasil
}

### Lista de TODOs
    [OK]    Web Crawler de concursos
    [OK]    Configurar o banco de dados
    [OK]    Fazer a aplicação que registra no MongoDB
    [OK]    Construir o serviço para fazer o update periodicamente
    [OK]    Construir a API para se comunicar com o cliente
    [OK]    Desenvolver o Webapp
    [OK]    Deploy da API
    [OK]    Deploy do Webapp
    [TODO]  Construir o fluxo do chatbot
    [TODO]  Desenvolver a estrutura server-chatbot
    [TODO]  Colocar o chatbot no Heroku


## [EN]

### Descritpion
This System is a bot which is intent to look for contests oppened in Brazil and let them online for the users, alerting them once a new contest is oppened. That will be done by subscription, wich aims to make a account for every user, allowing them to select which kind of contests they want to receive, whether it public contest, science contest, poetry contest or any other that the system be able to check in the internet. 

### Where can I access it?
This system is intent to run in the followeing platforms:
* A Webapp which list the contests controled by a menu
* A Android APP which is a clone of the webapp but atteached to playstore
* A Facebook webpage bot which make a post every new contest is oppened
* A Twitter profile which make a post every new contest is oppened
* A Messenger chatbot which will works as a consultant to the contests and a Feed list allowing people to sub and unsub

### How the API Works?
The concurseiro's API is a Restful API which returns all the oppened constests in Brazil, it recieves two params, the "estado" which is the brazilian state you want to achieve and the "publico" which is the formation of the people necessary to apply to the contest.
The API result structure is the following:
{
    'estado': The brazilian state where the contest have been oppened,
    'nome': The contest name,
    'profissionais': The professionals necessary formation,
    'link': The link where you can read more about the contest,
    'vagas': The vacancy number for the contest,
    'data_inicio': The date which the bot retrieved the contest from "Concursos no Brasil"
}

### Todo List
    [OK]    Contests Web Crawler
    [OK]    Configure the database
    [OK]    Application to put data into MongoDB
    [OK]    Build the service which updates list time to time
    [OK]    Build the API service to communicate with the client
    [OK]    Build Webapp to show the contests data
    [OK]    Deploy API - https://concurseiro.herokuapp.com/api_concurso
    [OK]    Deploy Webapp
    [TODO]  Make the chatbot flux to get this data
    [TODO]  Make the server-chatbot structure
    [TODO]  Push into Heroku Chatbot