import {
  authorization,
  registration,
  userEvents,
  userBookings,
} from "./user.js";
import { events, createEvent, deleteEvent } from "./events.js";
import { bookEvent, cancelBooking } from "./booking.js";

const resolvers = {
  Query: {
    authorization,
    events,
    userEvents,
    userBookings,
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
