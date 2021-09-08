import { Event } from '../../models/event';
import { Booking } from '../../models/booking';
import { dateToString } from '../../helpers';

export const bookEvent = async (parent: any, { eventId }: any, { req }: any, info: any) => {
  if (!req.isAuth) {
    throw new Error('Необходима авторизация.');
  }

  try {
    const fetchedEvent = await Event.findOne({ _id: eventId });
    const booking: any = new Booking({ event: fetchedEvent, user: req.userId });

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

export const cancelBooking = async (parent: any, { bookingId }: any, { req }: any, info: any) => {
  if (!req.isAuth) {
    throw new Error('Необходима авторизация.');
  }

  try {
    const booking: any = await Booking.findByIdAndDelete(bookingId);

    return { id: booking._id };
  } catch (error) {
    throw error;
  }
};

export const userBookings = async (parent: any, args: any, { req }: any, info: any) => {
  if (!req.isAuth) {
    throw new Error('Необходимо авторизоваться.');
  }

  try {
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    return bookings.map(async (booking: any) => {
      const event: any = await Event.findOne({ _id: booking.event });

      return {
        id: booking._id,
        event: {
          id: event._id,
          title: event.title,
          description: event.description,
          price: event.price,
          date: event.date,
          location: event.location,
          image: event.image,
          creator: event.creator,
        },
        user: booking.user,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const bookingsStatistics = async (parent: any, args: any, { req }: any, info: any) => {
  if (!req.isAuth) {
    throw new Error('Необходима авторизация.');
  }

  try {
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    const events = await Promise.all(
      bookings.map(async (value: any) => {
        const { price }: any = await Event.findById(value.event);
        return price;
      })
    );

    const lowPriceSum = events.reduce((previousValue: any, currentValue: any) => {
      if (currentValue >= 0 && currentValue < 3000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const mediumPriceSum = events.reduce((previousValue: any, currentValue: any) => {
      if (currentValue >= 3000 && currentValue < 8000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const highPriceSum = events.reduce((previousValue: any, currentValue: any) => {
      if (currentValue >= 8000 && currentValue < 10000) {
        return previousValue + currentValue;
      } else {
        return previousValue;
      }
    }, 0);

    const veryHighPriceSum = events.reduce((previousValue: any, currentValue: any) => {
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

export const bookingsControlsCounts = async (parent: any, args: any, { req }: any, info: any) => {
  if (!req.isAuth) {
    throw new Error('Необходима авторизация.');
  }

  const eventsCount = await Event.find({ creator: req.userId });
  const bookingsCount = await Booking.find({ user: req.userId });

  return {
    eventsCount: eventsCount.length,
    bookingsCount: bookingsCount.length,
  };
};
