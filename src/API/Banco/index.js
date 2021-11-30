require = require('esm')(module)
const express = require('express')
const { createServer } = require('http')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const db = require('./models')
const app = express()
var crypto = require('crypto')

app.use(cors())


// Schema
const typedefs = gql`

    type Usuario {
        id: Int!,
        nome: String,
        senha: String,
        email: String,
        times: String,
        recorde: String,
        elo: Int,
        tipo: Int
    }

    type Query {
        usuarios: [Usuario!],
        usuariosEmail(email:String!, senha:String!): [Usuario]
    }
`

// Resolvers
const resolvers = {
    Query: {
        usuarios: async(root,args,{db},info) => {
            const users = await db.Usuarios.findAll()
            return users
        },
        usuariosEmail: async(root,args,{db},info) => {
            const users = await db.Usuarios.findAll({
                where:{
                    email: args.email,
                    senha: args.senha
                }
            })
            return users
        }
    },
    Usuario: {
        id: (parent) => parent.id,
        nome: (parent) => parent.nome,
        senha: (parent) => parent.senha,
        email: (parent) => parent.email,
        times: (parent) => parent.times,
        recorde: (parent) => parent.recorde,
        elo: (parent) => parent.elo,
        tipo: (parent) => parent.tipo,
    }
}

// Criando o Server
const apolloServer = new ApolloServer({
    playground: true,
    typeDefs: typedefs,
    resolvers: resolvers,
    context: async ({req, res, connection}) => {
        return{
            db
        }
    }
});
apolloServer.applyMiddleware({ app, path: '/api' })
const server = createServer(app)

db.sequelize.sync({force:false}).then(async()=>{
    console.log('Banco Sincronizado!')
})

const io = require("socket.io")(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use('/login', (req, res) => {
    var email = req.params.email
    var senha = req.params.senha

    var token = crypto.randomBytes(64).toString('hex');
    res.send({
        token: token
    });
});

io.on('connection', (socket) => {
    const username = "Sussy Baka"
    socket.emit('connection', username);
});

io.on('disconnect', () => {
    socket.removeAllListeners();
});


server.listen(3001, () => console.log(
    `Deu bom.`,
));