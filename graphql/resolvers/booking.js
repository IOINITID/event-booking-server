const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (parent, args, { req }, info) => {
    if (!req.isAuth) {
      throw new Error("Необходима авторизация.");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (parent, args, { req }, info) => {
    if (!req.isAuth) {
      throw new Error("Необходима авторизация.");
    }

    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (parent, args, { req }, info) => {
    if (!req.isAuth) {
      throw new Error("Необходима авторизация.");
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");

      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (error) {
      throw error;
    }
  },
};
