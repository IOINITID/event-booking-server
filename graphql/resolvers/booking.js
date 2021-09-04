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

export const bookingsStatistics = async (parent, args, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходима авторизация.");
  }

  try {
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    const events = await Promise.all(
      bookings.map(async (value) => {
        const { price } = await Event.findById(value.event);
        return price;
      })
    );

    const lowPriceSum = events.reduce((previousValue, currentValue) => {
      if (currentValue >= 0 && currentValue <= 3000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const mediumPriceSum = events.reduce((previousValue, currentValue) => {
      if (currentValue >= 3000 && currentValue <= 8000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const highPriceSum = events.reduce((previousValue, currentValue) => {
      if (currentValue >= 8000 && currentValue <= 10000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const veryHighPriceSum = events.reduce((previousValue, currentValue) => {
      if (currentValue >= 10000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    return { lowPriceSum, mediumPriceSum, highPriceSum, veryHighPriceSum };
  } catch (error) {
    throw error;
  }
};
