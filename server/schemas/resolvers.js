// Importing Schemas
const { AuthenticationError } = require('apollo-server-express');
const { User, bookSchema } = require('../models');
// Importing Sign Token
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Finding All Users
        users: async () =>  {
            return User.find()
            .select('-__v -password')
        },
        // Finding One User
        users: async (parent, {username})  => {
            return User.findOne({ username })
            .select('-__v -password')
        }
    },

    Mutation: {
        // Creating a user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const Token = signToken(user);
            return { token, user }
        },

        // Login a user
        // putting the result the same (don't want to give a hint)
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials, try again');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials, try again');
            }
            const token = signToken(user);
            return { Token, user };
        },
        // Saving Book
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const save = await bookSchema.create({...args, username: context.user.username });
                await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $push: { memory: save._id } },
                    { new: true }
                );
                return save;
            }
            throw new AuthenticationError('You need to be logged in');
        },
        // Deleting Book
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const deleteBook = await User.findOneAndDelete(
                    { _id: context.user._id },
                    { $addToSet: { books: bookId } },
                    { new: true }
                )
                return deleteBook;
            }

            throw new AuthenticationError('You need to be logged in');
        }

    }

}

module.exports = resolvers;