const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')



// Load schema & resolvers
const typeDefs = require('./schema/schema')
const resolvers = require('./resolves/resolves')

//Load data methods
const mongoDataMethods = require('./data/db')


const connectDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://datdb:1234@graphql.2pprkgy.mongodb.net/?retryWrites=true&w=majority&appName=GraphQL',{
      
    })
    console.log('MongoDb connected')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
connectDb()
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ()=>({mongoDataMethods})
  })

  await server.start()  // Đảm bảo gọi await server.start()

  const app = express()

  server.applyMiddleware({ app })  // Sau khi server đã khởi động, mới gọi applyMiddleware

  app.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer()
