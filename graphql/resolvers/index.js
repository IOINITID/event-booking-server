import { login, createUser } from "./auth.js";
import { events, createEvent, deleteEvent } from "./events.js";
import { bookings, bookEvent, cancelBooking } from "./booking.js";

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

export { resolvers };
