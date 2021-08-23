import Event from "../../models/event.js";
import Booking from "../../models/booking.js";
import { dateToString } from "../../helpers/index.js";

export const bookEvent = async (parent, { eventId }, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходима авторизация.");
  }

  try {
    const fetchedEvent = await Event.findOne({ _id: eventId });
    const booking = new Booking({ event: fetchedEvent, user: req.userId });

    await booking.save();

    return {
      id: booking._id,
      event: {
        id: booking.event._id,
        title: booking.event.title,
        description: booking.event.description,
        price: booking.event.price,
        date: dateToString(booking.event.date),
        location: booking.event.location,
        image: booking.event.image,
        creator: booking.event.creator,
      },
      user: booking.user,
    };
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (parent, { bookingId }, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходима авторизация.");
  }

  try {
    const booking = await Booking.findByIdAndDelete(bookingId);

    return { id: booking._id };
  } catch (error) {
    throw error;
  }
};
