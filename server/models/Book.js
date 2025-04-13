const mongoose = require('mongoose')
const schema = mongoose.Schema

const BookSchema = new schema({
    name: {
        type: String
    },
    year: {
        type: String
    },
    content: {
        type: String
    },
    genre: {
        type: String
    },
    image: {
        type: String
    },
    authorId: {
        type: String
    }
})

module.exports = mongoose.model('books', BookSchema)