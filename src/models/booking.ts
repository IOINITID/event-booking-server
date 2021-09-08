import { model, ObjectId, Schema } from 'mongoose';
import { Models } from '../enums';

type BookingModelType = {
  event?: ObjectId;
  user?: ObjectId;
};

const bookingSchema = new Schema<BookingModelType>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: Models.Event,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: Models.User,
    },
  },
  { timestamps: true }
);

export const Booking = model<BookingModelType>(Models.Booking, bookingSchema);
