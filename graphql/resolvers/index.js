import { authorization, registration, userEvents } from "./user.js";
import { events, createEvent, deleteEvent } from "./events.js";
import { bookings, bookEvent, cancelBooking } from "./booking.js";

const resolvers = {
  Query: {
    authorization,
    events,
    userEvents,
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
