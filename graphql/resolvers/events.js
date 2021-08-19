import Event from "../../models/event.js";
import User from "../../models/user.js";
import { transformEvent } from "./merge.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const events = async (parent, args, { req, res }, info) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (parent, args, { req }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  const uploadedResponse = await cloudinary.uploader.upload(
    args.eventInput.image,
    {
      folder: "event-booking",
      eager: {
        quality: "75",
        fetch_format: "jpg",
      },
    }
  );

  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: args.eventInput.price,
    date: new Date(args.eventInput.date),
    location: args.eventInput.location,
    image: uploadedResponse.eager[0].secure_url,
    creator: req.userId,
  });

  let createdEvent;

  try {
    const result = await event.save();

    createdEvent = transformEvent(result);

    const creator = await User.findById(req.userId);

    if (!creator) {
      throw new Error("Пользователь не найден.");
    }

    creator.createdEvents.push(event);

    await creator.save();

    return createdEvent;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteEvent = async (parent, args, { req, res }, info) => {
  if (!req.isAuth) {
    throw new Error("Необходимо авторизоваться.");
  }

  try {
    const eventToDelete = await Event.findByIdAndDelete(args.eventId);

    return eventToDelete;
  } catch (error) {
    throw error;
  }
};
