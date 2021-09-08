import { authorization, registration } from './user';
import { events, createEvent, deleteEvent, userEvents } from './events';
import { bookEvent, cancelBooking, userBookings, bookingsStatistics, bookingsControlsCounts } from './booking';

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
