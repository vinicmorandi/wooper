require = require('esm')(module)
const express = require('express')
const { createServer } = require('http')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const db = require('./models')
const app = express()

app.use(cors())


// Schema
const typedefs = gql`

    type Usuario {
        id: Int,
        nome: String!
    }

    type Query {
        usuarios: [Usuario!]
    }
`

// Resolvers
const resolvers = {
    Query: {
        usuarios: async(root,args,{db},info) => {
            const users = await db.usuarios.findAll()
            return users
        },
    },
    Usuario: {
        id: (parent) => parent.id,
        nome: (parent) => parent.nome
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

db.sequelize.sync({force:true}).then(async()=>{
    console.log('Banco Sincronizado!')
})

server.listen(3001, () => console.log(
    `Deu bom.`,
));