const { login, createUser } = require("./auth");
const { events, createEvent } = require("./events");
const { bookings, bookEvent, cancelBooking } = require("./booking");

const resolvers = {
  Query: {
    login,
    events,
    bookings,
  },
  Mutation: {
    createUser,
    createEvent,
    bookEvent,
    cancelBooking,
  },
};

module.exports = resolvers;
