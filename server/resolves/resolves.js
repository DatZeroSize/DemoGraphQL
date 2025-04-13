const mongoDataMethods = require('../data/db');
const Author = require('../models/Author')
const Book = require('../models/Book')

const resolvers = {
  Query: {
    books: async (parent,args, {mongoDataMethods}) => await mongoDataMethods.getAllBooks(),
    authors: async (parent,args, {mongoDataMethods}) =>await mongoDataMethods.getAllAuthours(),
    book: async (parent,{id}, {mongoDataMethods}) =>await mongoDataMethods.getBookById(id),
    author:async (parent,{id}, {mongoDataMethods}) =>await mongoDataMethods.getAuthorById(id)
  },
  Book: {
    author: async ({authorId},args, {mongoDataMethods}) => await mongoDataMethods.getAuthorById(authorId)
  },
  Author: {
    books: async({id},args, {mongoDataMethods}) => await mongoDataMethods.getAllBooksById({authorId: id})
  },

  Mutation: {
    createBook: async (parent, args, {mongoDataMethods}) => await mongoDataMethods.createBook(args),
    createAuthor: async (parent, args, {mongoDataMethods}) => await mongoDataMethods.createAuthor(args),
    deleteBook: async (parent, {id}, context) => await mongoDataMethods.deleteBookById(id),
    updateBook: async (parent, args, context) => await mongoDataMethods.updateBookById(args),
    updateAuthor: async (parent, args, context) => await mongoDataMethods.updateAuthorById(args)
    
  }
};

module.exports = resolvers;


