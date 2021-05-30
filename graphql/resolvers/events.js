const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  events: async (parent, args, { req, res }, info) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (parent, args, { req }, info) => {
    if (!req.isAuth) {
      throw new Error("Необходимо авторизоваться.");
    }

    // const folder = "public/images";
    // const localPath = "http://localhost:8080";
    // const serverPath = "https://ioinitid-event-booking.herokuapp.com";

    // if (!fs.existsSync(folder)) {
    //   fs.mkdirSync(folder, { recursive: true });
    // }

    // const { createReadStream, filename, mimetype, encoding } = await args
    //   .eventInput.image;

    // const stream = createReadStream();
    // const fileName = `${nanoid() + path.extname(filename)}`;
    // const pathName = `public/images/${fileName}`;
    // await stream.pipe(fs.createWriteStream(pathName));

    const uploadedResponse = await cloudinary.uploader.upload(
      args.eventInput.image,
      { folder: "event-booking" }
    );

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      location: args.eventInput.location,
      image: uploadedResponse.secure_url,
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
  },
  deleteEvent: async (parent, args, { req, res }, info) => {
    if (!req.isAuth) {
      throw new Error("Необходимо авторизоваться.");
    }

    try {
      const eventToDelete = await Event.findByIdAndDelete(args.eventId);

      return eventToDelete;
    } catch (error) {
      throw error;
    }
  },
};
