const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book{
    id: ID
    name: String
    year: String
    content: String
    genre: String
    author: Author
    image: String
  }

  type Author{
    id: ID
    name: String
    year: String
    content: String
    image: String
    books: [Book]
  }


  # ROOT
  type Query{
    books: [Book]
    authors: [Author]
    book(id: ID) : Book
    author(id: ID): Author
  }


  type Mutation{
    createBook( name: String,year: String,content: String ,genre: String, authorId: ID, image: String): Book
    createAuthor( name: String,year: String,content: String, image: String): Author
    deleteBook(id: ID!): Book
    updateBook(id: ID!,name: String, content: String, year: String, genre: String, image: String): Book
    updateAuthor(id: ID!,name: String, content: String, year: String,  image: String): Author
  }
`;

module.exports = typeDefs;
