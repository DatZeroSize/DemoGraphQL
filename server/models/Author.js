const mongoose = require('mongoose')
const schema = mongoose.Schema

const AuthorSchema = new schema({
    name: {
        type: String
    },
    year: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
})

module.exports = mongoose.model('authors', AuthorSchema)