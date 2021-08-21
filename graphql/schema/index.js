import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    location: String
    image: String
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  type Authorization {
    id: ID!
    token: String!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
    location: String!
    image: String!
  }

  type Query {
    authorization(email: String!, password: String!): Authorization!
    events: [Event!]!
    bookings: [Booking!]!
  }

  type Mutation {
    registration(email: String!, password: String!): Authorization!
    createEvent(eventInput: EventInput): Event
    deleteEvent(eventId: ID!): Event!
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }
`;

export { typeDefs };
