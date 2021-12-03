## Para iniciar o projeto

Crie, em seu banco de dados, uma database chamada `pokemon`

Vá para `src/API` e rode no cmd o seguinte comando:

#### `node index.js`

Após isso, volte à pasta inicial e rode o seguinte comando:
#### `npm start`

## Para acessar as páginas

Ao iniciar o projeto, o sistema irá criar uma nova tabela (caso ela não exista) chamada `usuários`, que o site utiliza para pegar as informações de seus usuários, para o login, ranking, batalhas, etc.

### Caso você não queira criar essa tabela:
Vá para `src/Routes/routes.js` e comente as linhas 93-95
```
    if(!token){
        return(<Login setToken={setToken}></Login>)
    }
```

### Caso você queira criar essa tabela
Rode esse comando em seu MySQL:

```
  insert into usuarios (nome,email,senha,recorde,elo,tipo) values('admin','email@email.com','adminadmin','0/0',1000,2)
```
Entre na tela de login e acesse os sistemas com as seguintes credenciais:
- Email - email@email.com
- Senha - adminadmin
