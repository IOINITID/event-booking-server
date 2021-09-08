import { model, ObjectId, Schema } from 'mongoose';
import { Models } from '../enums';

type EventModelType = {
  title: string;
  description: string;
  price: number;
  date: Date;
  location: string;
  image: string;
  creator?: ObjectId;
};

const eventSchema = new Schema<EventModelType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: Models.User,
    },
  },
  { timestamps: true }
);

export const Event = model<EventModelType>(Models.Event, eventSchema);
