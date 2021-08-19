import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

if (process.env.MODE !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 8080;

import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { isAuth } from "./middleware/is-auth.js";

const startApolloServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      req,
      res,
    }),
    playground: true,
    introspection: true,
  });

  await server.start();

  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  //   res.setHeader(
  //     "Access-Control-Allow-Headers",
  //     "Content-Type, Authorization"
  //   );

  //   if (req.method === "OPTIONS") {
  //     return res.sendStatus(200);
  //   }

  //   next();
  // });

  app.use(cors());

  app.use(express.json({ limit: "50mb" }));

  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(isAuth);

  app.use(express.static("public"));

  server.applyMiddleware({ app: app });

  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qwu0m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    )
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}...`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

startApolloServer();
