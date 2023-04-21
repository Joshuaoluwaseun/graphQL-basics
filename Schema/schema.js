import { 
    GraphQLObjectType,
    GraphQLSchema, 
    GraphQLString,
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} from "graphql";
import _ from "lodash"
import Book from "../models/bookModel.js";
import Author from "../models/authorModel.js";

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // this is any author that matches the book(parent) author id
                return Author.findById(parent.authorId)

            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books:{
            type: new GraphQLList(BookType), 
            resolve(parent, args) {
                // Here you are checking the book collection with the same author id as the parent(Author)
                return Book.find({authorId: parent.id})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: { type: GraphQLID } },
            resolve(parent, args) {
                // return Book.findById({id: parent.authorId})
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let {name, age} = args;
                let newAuthor = Author.create({
                    name, age
                })
                Author.save()
                return newAuthor;
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull (GraphQLString)},
                
                genre: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const {name, genre, authorId} = args;

                let newBook = Book.create({
                    name, genre, authorId 
                })

                if (!newBook) return;
                return newBook;

            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})