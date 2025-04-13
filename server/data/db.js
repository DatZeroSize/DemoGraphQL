const Book = require('../models/Book')
const Author = require('../models/Author')


const mongoDataMethods = {
    getAllBooks: async()=> await Book.find(),
    getAllBooksById: async condition => await Book.find(condition),
    getAllAuthours: async()=> await Author.find(),
    getBookById: async id => await Book.findById(id),
    getAuthorById: async id => await Author.findById(id),
    createAuthor: async args => {
        const newAuthor = new Author(args)
        return await newAuthor.save()
    },
    createBook: async args => {
        const newBook = new Book(args)
        return await newBook.save()
    },
    deleteBookById: async id => await Book.findByIdAndDelete(id),
    updateBookById: async args =>{
        const { id, name, content, year, genre, image } = args;  // Destructuring args
        await Book.findByIdAndUpdate(
            id, // Tìm kiếm sách theo ID
            {
                name, 
                content, 
                year, 
                genre, 
                image, 
            },
            { new: true } 
        );
    },
    updateAuthorById: async args =>{
        const { id, name, content, year, image } = args;  // Destructuring args
        await Author.findByIdAndUpdate(
            id, // Tìm kiếm sách theo ID
            {
                name, 
                content, 
                year, 
                image, 
            },
            { new: true } 
        );
    }
}

module.exports = mongoDataMethods