import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Authorization {
    id: ID!
    token: String!
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

  type Booking {
    id: ID!
    event: Event!
    user: ID!
  }

  type DeletedEvent {
    id: ID!
  }

  type CancelBooking {
    id: ID!
  }

  type BookingsStatistics {
    lowPriceSum: Float!
    mediumPriceSum: Float!
    highPriceSum: Float!
    veryHighPriceSum: Float!
  }

  type BookingsControlsCounts {
    eventsCount: Float!
    bookingsCount: Float!
  }

  type Query {
    authorization(email: String!, password: String!): Authorization!
    events: [Event]!
    userEvents: [Event]!
    userBookings: [Booking]!
    bookingsStatistics: BookingsStatistics!
    bookingsControlsCounts: BookingsControlsCounts!
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
    cancelBooking(bookingId: ID!): CancelBooking!
  }
`;

export { typeDefs };
