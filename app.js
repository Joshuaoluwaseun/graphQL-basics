import "dotenv/config";
import express from 'express';
import { graphqlHTTP }from "express-graphql";
import mongoose from 'mongoose';
import schema from "./Schema/schema.js"

const app = express();

mongoose.connect(process.env.DB_URI)
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


app.get("/", (req, res) => {
    res.status(200).send("Server is working properly");
});
  

const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server is up and running on port on ${port}`);
})