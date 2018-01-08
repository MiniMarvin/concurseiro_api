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
 
### Lista de TODOs
    [OK]    Web Crawler de concursos
    [OK]    Configurar o banco de dados
    [OK]    Fazer a aplicação que registra no MongoDB
    [OK]    Construir o serviço para fazer o update periodicamente
    [OK]    Construir a API para se comunicar com o cliente
    [OK]    Desenvolver o Webapp
    [TODO]  Colocar no Heroku o Webapp
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

### Todo List
    [OK]    Contests Web Crawler
    [OK]    Configure the database
    [OK]    Application to put data into MongoDB
    [OK]    Build the service which updates list time to time
    [OK]    Build the API service to communicate with the client
    [OK]    Build Webapp to show the contests data
    [TODO]  Push into Heroku Webapp
    [TODO]  Make the chatbot flux to get this data
    [TODO]  Make the server-chatbot structure
    [TODO]  Push into Heroku Chatbot