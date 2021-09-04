import {
  authorization,
  registration,
  userEvents,
  userBookings,
} from "./user.js";
import { events, createEvent, deleteEvent } from "./events.js";
import { bookEvent, cancelBooking, bookingsStatistics } from "./booking.js";

const resolvers = {
  Query: {
    authorization,
    events,
    userEvents,
    userBookings,
    bookingsStatistics,
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
