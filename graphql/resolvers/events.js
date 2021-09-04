import Event from "../../models/event.js";
import { v2 as cloudinary } from "cloudinary";
import { dateToString } from "../../helpers/index.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const events = async (parent, args, context, info) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

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

export const createEvent = async (
  parent,
  { title, description, price, date, location, image },
  { req },
  info
) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  try {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "event-booking",
      eager: { quality: "75", fetch_format: "jpg" },
    });

    const event = new Event({
      title,
      description,
      price,
      date,
      location,
      image: uploadedResponse.eager[0].secure_url,
      creator: req.userId,
    });

    await event.save();

    return {
      id: event._id,
      title: event.title,
      description: event.description,
      price: event.price,
      date: dateToString(event.date),
      location: event.location,
      image: event.image,
      creator: event.creator,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (parent, { eventId }, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  try {
    const eventToDelete = await Event.findByIdAndDelete(eventId);

    return { id: eventToDelete._id };
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
