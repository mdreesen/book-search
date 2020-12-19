const express = require('express');

// implementing the Apollo Server
const { ApolloServer } = require('apollo-server-express');


const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Adding middleware to require Auth for a JWT
const { authMiddleWare } = require('./utils/auth');
// Create a new Apollo Server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare
})

// Integrate our Apollo Server with the express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // created wildcard get route for the server
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/build/index.html'));
});
}


app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
