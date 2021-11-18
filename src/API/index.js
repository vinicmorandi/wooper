const { ApolloServer } = require('apollo-server');

// Tipos
const typeDefs = `
  type Query {
    info: String!
  }
`

// Resolvers
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`
    }
}

// Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );



// var app = require('express')();
// var http = require('http').createServer(app);
// var crypto = require('crypto')
// const cors = require('cors')
// const PORT = 3001;

// app.use(cors())

// const io = require("socket.io")(http, {
//     cors: {
//         origin: "https://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

// app.use('/login', (req, res) => {
//     var email = req.params.email
//     var senha = req.params.senha

//     var token = crypto.randomBytes(64).toString('hex');
//     res.send({
//         token: token
//     });
// });

// http.listen(PORT, () => {
//     console.log(`listening on *:${PORT}`);
// });

// io.on('connection', (socket) => {
//     const username = "Sussy Baka"
//     socket.emit('connection', username);
// });

// io.on('disconnect', () => {
//     socket.removeAllListeners();
// });
