const { login, createUser } = require("./auth");
const { events, createEvent, deleteEvent } = require("./events");
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
    deleteEvent,
    bookEvent,
    cancelBooking,
  },
};

module.exports = resolvers;
