import { model, ObjectId, Schema } from 'mongoose';
import { Models } from '../enums';

type UserModelType = {
  email: string;
  password: string;
  createdEvents?: ObjectId;
};

const userSchema = new Schema<UserModelType>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: Models.Event,
    },
  ],
});

export const User = model<UserModelType>(Models.User, userSchema);
