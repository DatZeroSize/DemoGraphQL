import { gql } from '@apollo/client'

const getBooks = gql`
    query getBooksQuery {
        books {
            id 
            name
            year
            content
            genre
            image
            author {
                id
                name
                year
                content
                image
                books {
                    name
                }
            }
        }
    }
`

const getNameAuthors = gql`
    query getNameAuthors {
        authors {
            id
            name
        }
    }
`
export {getBooks, getNameAuthors}