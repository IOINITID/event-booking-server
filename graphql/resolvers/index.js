import { authorization, registration } from "./user.js";
import { events, createEvent, deleteEvent, userEvents } from "./events.js";
import {
  bookEvent,
  cancelBooking,
  userBookings,
  bookingsStatistics,
  bookingsControlsCounts,
} from "./booking.js";

const resolvers = {
  Query: {
    authorization,
    events,
    userEvents,
    userBookings,
    bookingsStatistics,
    bookingsControlsCounts,
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
