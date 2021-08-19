import Event from "../../models/event.js";
import Booking from "../../models/booking.js";
import { transformBooking, transformEvent } from "./merge.js";

export const bookings = async (parent, args, { req }, info) => {
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
};

export const bookEvent = async (parent, args, { req }, info) => {
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
};

export const cancelBooking = async (parent, args, { req }, info) => {
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
};
