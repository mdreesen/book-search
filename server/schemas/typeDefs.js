const { gql } = require ('apollo-server-express');

const typeDefs = gql `
# Me Query
    type Me {
        _id: ID
        username: String
        email: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: Sting!, email: String!, password: String!): Auth
        saveBook(author: String!, description: Sting!, title: String!, bookId: ID!, image: String!): [Author]
        removeBook(bookId: ID!): User
    }

    type User {
        id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        author: [Authors]
        description: String!
        title: Sting!
        image: String!
        link: String!
    }

    type Auth {
        token: ID!
        user: User
    }
`