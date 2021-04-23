const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing", "All-Night Cooding"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
