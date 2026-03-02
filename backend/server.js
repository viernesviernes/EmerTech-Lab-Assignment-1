const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const mongoose = require('mongoose');

//.env variables
const MONGODB_URL = process.env.MONGODB_URL;
console.log(`Using MongoDB URI: ${MONGODB_URL}`);

// Configurations
const configureMongoose = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log(`Connected to MongoDB at ${MONGODB_URL}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Initialize the application
const startServer = async () => {

  await configureMongoose();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
};

startServer();