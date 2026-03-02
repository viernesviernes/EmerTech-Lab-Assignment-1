const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'src', 'config', '.env') });
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT ?? 4000;
console.log(`Using MongoDB URI: ${MONGODB_URL}`);

const configureMongoose = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log(`Connected to MongoDB at ${MONGODB_URL}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await configureMongoose();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(
    '/graphql',
    cors({
      origin: true,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server)
  );

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();