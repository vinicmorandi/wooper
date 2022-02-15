// ESM
require = require('esm')(module)

// Express
const express = require('express')
const { createServer } = require('http')
const app = express()

// Apollo
const { ApolloServer, gql } = require('apollo-server-express')

// Cors
const cors = require('cors')
app.use(cors())

// Modelos
const db = require('./models')
const { SocketAddress } = require('net')
const {v4: uuidV4} = require('uuid');
const { SportsHockeyTwoTone } = require('@mui/icons-material');

// Schema
const typedefs = gql`

    type Usuario {
        id: Int!,
        nome: String,
        senha: String,
        email: String,
        times: String,
        elo: Int,
        tipo: Int,
        vitorias: Int,
        derrotas: Int
    }

    type Query {
        usuarios: [Usuario!],
        usuariosEmail(email:String!, senha:String!): [Usuario]
    }

    type Mutation {
        criarUsuario(nome:String!, email:String!, senha: String!):[Usuario],
        loginUsu(email:String!, senha:String!): [Usuario],
        salvarTime(id: String!,time: String! ): [Usuario],
        usuariosElo: [Usuario!],
        salvarElo(id: String!,time: Int! ): [Usuario]
    }
`

// Resolvers
const resolvers = {
    // Queries
    Query: {
        // Pega todos os usuários
        usuarios: async (root, args, { db }, info) => {
            const users = await db.Usuarios.findAll()
            return users
        },
        // Pega o usuário que tiver o email e a senha que forem passados
        usuariosEmail: async (root, args, { db }, info) => {
            const users = await db.Usuarios.findAll({
                where: {
                    email: args.email,
                    senha: args.senha
                }
            }).catch((err) => {
                var msgErro = "Erro! " + err
            })
            return (users) ? users : msgErro
        }
    },
    Mutation: {
        criarUsuario: async (root, args, { db }, info) => {
            if (args.nome != '' && args.email != '' && args.senha != '') {
                db.Usuarios.create({ nome: args.nome, email: args.email, senha: args.senha, times: '', elo: '1000', tipo: 1, vitorias: 0, derrotas: 0 })
            }
        },
        loginUsu: async (root, args, { db }, info) => {
            const users = await db.Usuarios.findAll({
                where: {
                    email: args.email,
                    senha: args.senha
                }
            }).catch((err) => {
                var msgErro = "Erro! " + err
            })
            return (users) ? users : msgErro
        },
        salvarTime: async (root, args, { db }, info) => {
            db.Usuarios.update({ times: args.time }, { where: { id: args.id } })
        },
        usuariosElo: async (root, args, { db }, info) => {
            const users = await db.Usuarios.findAll({ order: [['elo', 'DESC']], limit: 500 })
            return users
        },
        salvarElo: async (root, args, { db }, info) => {
            db.Usuarios.update({ elo: args.elo }, { where: { id: args.id } })
        },
    },
    // Define o modelo do usuário
    Usuario: {
        id: (parent) => parent.id,
        nome: (parent) => parent.nome,
        senha: (parent) => parent.senha,
        email: (parent) => parent.email,
        times: (parent) => parent.times,
        elo: (parent) => parent.elo,
        tipo: (parent) => parent.tipo,
        vitorias: (parent) => parent.vitorias,
        derrotas: (parent) => parent.derrotas,
    }
}

// Criando o Server
const apolloServer = new ApolloServer({
    playground: true,
    typeDefs: typedefs,
    resolvers: resolvers,
    context: async ({ req, res, connection }) => {
        return {
            db
        }
    }
});
apolloServer.applyMiddleware({ app, path: '/api' })
const server = createServer(app)

// Sincroniza o banco de dados (cria uma tabela de usuários caso ela não exista)
db.sequelize.sync({ force: false }).then(async () => {
    console.log('Banco Sincronizado!')
})

// Conexão com o socketIO
const io = require("socket.io")(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

var salas = []
var usuarios = []

// Evento chamado quando o usuário conecta com o socketIO
io.on('connection', (socket) => {
    socket.on('login',(usuario)=>{
        var sala = ''
        for(let i = 0; i<salas.length; i++){
            if(salas[i].usuarios.length < 2){
                sala = salas[i]
                continue
            }
        }
        if(sala===''){
            sala = {
                "id": Math.floor(Math.random() * 9999999999999),
                "usuarios": []
            }
            salas.push(sala)
        }
        socket.join(sala.id)
        console.log("Conectou na sala " + sala.id)



        socket.emit('loginU', usuario, sala.id)
        socket.in(sala.id).emit('loginU', usuario, sala.id)
        var jaConectou = false
        for(let i = 0; i<sala.usuarios.length;i++){
            if(sala.usuarios[i].id==usuario.id){
                jaConectou = true
            }
        }
        if(!jaConectou) sala.usuarios.push(usuario)
        if(sala.usuarios.length == 2){
            socket.emit('atualiza-lobbyU',sala.usuarios)
        }
    })

    socket.on('ataque', (sala, ataque, idUsu) => {
        socket.emit('retorno', ataque, idUsu)
        socket.in(sala).emit('retorno', ataque, idUsu)
    })

    socket.on('troca', (sala, poke, ini) => {
        console.log(sala)
        socket.in(sala).emit('trocaA',ini,poke)
    })
});

// Evento chamado quando o usuário desconecta do socketIO
io.on('disconnect', () => {
    console.log("desconectou! :(")
    socket.removeAllListeners();
});

// Aviso quando o servidor for iniciado
server.listen(3001, () => console.log(
    `Servidor Funcionando!`,
));