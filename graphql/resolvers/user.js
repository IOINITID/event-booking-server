import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import Event from "../../models/event.js";
import Booking from "../../models/booking.js";
import { dateToString } from "../../helpers/index.js";

export const authorization = async (
  parent,
  { email, password },
  context,
  info
) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Пользователь с такой почтой не найден.");
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Пароль неверный.");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "somesupersecretkey",
      { expiresIn: "1h" }
    );

    return { id: user.id, token };
  } catch (error) {
    throw error;
  }
};

export const registration = async (
  parent,
  { email, password },
  context,
  info
) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Пользователь с такой почтой уже есть.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPassword });

    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "somesupersecretkey",
      { expiresIn: "1h" }
    );

    return { id: user.id, token };
  } catch (error) {
    throw error;
  }
};

export const userEvents = async (parent, args, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  try {
    const events = await Event.find({ creator: req.userId }).sort({
      createdAt: -1,
    });

    return events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      price: event.price,
      date: dateToString(event.date),
      location: event.location,
      image: event.image,
      creator: event.creator,
    }));
  } catch (error) {
    throw error;
  }
};

export const userBookings = async (parent, args, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  try {
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    return bookings.map(async (booking) => {
      const event = await Event.findOne({ _id: booking.event });

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
