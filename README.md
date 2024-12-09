# Como rodar o projeto TeleDoc

## Back-end

* Primeiro, rode o comando `npm install` na pasta do projeto (`teledoc-api`)
* Depois, busque o arquivo `compose-example.yml` e renomeie para `compose.yml`.
  Feito isso, configure o nome de usuário, senha e nome de banco que você prefere;
* Rode o comando `docker compose up -d` para subir o banco;
* Após isso, renomeie `.env.example` para `.env` e insira as credenciais de usuá-
  rio, senha e nome de banco que você configurou no `compose.yml` dentro da 
  `DATABASE_URL`;
* Insira uma chave secreta da sua preferência, pode ser uma string aleátória 
  (`JWT_SECRET`);
  * Site para gerar um uuid aleatório: https://www.uuidgenerator.net/ 
* Feito isso, com o terminal aberto no projeto, rode: `npx prisma migrate dev`;
* O banco agora foi configurado com as migrações, mas as tabelas estão vazias.
  * Sobre os usuários, você vai poder criar um acessando o front-end depois e 
    usando a opção "criar nova conta".
  * Quanto aos médicos, utilize o comando `npm run seed` para popular a tabela
    `doctors` com alguns médicos para fins de exemplo;
* Para rodar o back-end, utilize o comando `npm run start:dev`
* Pronto! Agora vamos configurar o front-end. 
* Caso queira acessar a documentação da api, veja `http:localhost:3333/docs`

## Front-end

* Entre na pasta principal do projeto (`teledoc-front/`);
* Execute `npm install` para instalar todas as dependências;
* Feito isso, execute o comando `npm run start:dev` e acesse `http://localhost:3000`;
* Vídeo demonstração: `demo-video.mkv`
