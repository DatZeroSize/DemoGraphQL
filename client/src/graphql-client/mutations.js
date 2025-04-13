import { gql } from '@apollo/client'

const deleteBookById = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      name
    }
  }
`;
const updateBook = gql`
  mutation updateBook($id: ID!, $name: String, $content: String, $year: String, $genre: String, $image: String) {
    updateBook(id: $id, name: $name, content: $content, year: $year, genre: $genre, image: $image) {
      id
      name
      content
      year
      genre
      image
    }
  }
`;
const updateAuthor = gql`
  mutation updateAuthor($id: ID!, $name: String!, $content: String!, $year: String!, $image: String!) {
    updateAuthor(id: $id, name: $name, content: $content, year: $year, image: $image) {
      id
      name
      content
      year
      image
    }
  }
`;
const createAuthor = gql`
  mutation createAuthor($name: String, $year: String, $content: String, $image: String) {
    createAuthor(name: $name, year: $year, content: $content, image: $image) {
      name
      year
      content
      image
    }
  }
`;
const createBook = gql`
  mutation createBook($name: String!, $year: String!, $content: String!, $genre: String!, $authorId: ID!, $image: String!) {
    createBook(name: $name, year: $year, content: $content, genre: $genre, authorId: $authorId, image: $image) {
      id
      name
    }
  }
`;


export { deleteBookById, updateBook, updateAuthor, createAuthor, createBook };
