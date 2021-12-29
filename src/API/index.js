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
        usuariosElo: [Usuario!]
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
        }
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

// Evento chamado quando o usuário conecta com o socketIO
io.on('connection', (socket) => {
    const username = "Sussy Baka"
    socket.emit('connection', username);
});

// Evento chamado quando o usuário desconecta do socketIO
io.on('disconnect', () => {
    socket.removeAllListeners();
});

// Aviso quando o servidor for iniciado
server.listen(3001, () => console.log(
    `Servidor Funcionando!`,
));