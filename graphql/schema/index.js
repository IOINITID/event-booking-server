import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Booking {
    id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    location: String
    image: String
    creator: ID!
  }

  type User {
    id: ID!
    createdEvents: [Event!]
  }

  type Authorization {
    id: ID!
    token: String!
  }

  type Query {
    authorization(email: String!, password: String!): Authorization!
    events: [Event]!
    bookings: [Booking]!
  }

  type DeletedEvent {
    id: ID!
  }

  type Mutation {
    registration(email: String!, password: String!): Authorization!
    createEvent(
      title: String!
      description: String!
      price: Float!
      date: String!
      location: String!
      image: String!
    ): Event!
    deleteEvent(eventId: ID!): DeletedEvent!
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }
`;

export { typeDefs };
