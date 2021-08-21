import { authorization, registration } from "./user.js";
import { events, createEvent, deleteEvent } from "./events.js";
import { bookings, bookEvent, cancelBooking } from "./booking.js";

const resolvers = {
  Query: {
    authorization,
    events,
    bookings,
  },
  Mutation: {
    registration,
    createEvent,
    deleteEvent,
    bookEvent,
    cancelBooking,
  },
};

export { resolvers };
