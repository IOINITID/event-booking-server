import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

export const login = async (
  parent,
  { email, password },
  { req, res },
  info
) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Пользователь с такой почтой не найден.");
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Пароль не верный.");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      { expiresIn: "1h" }
    );

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      message: "Вход успешно выполнен.",
    };
  } catch (error) {
    throw error;
  }
};

export const createUser = async (parent, args, context, info) => {
  try {
    const existingUser = await User.findOne({
      email: args.userInput.email,
    });

    if (existingUser) {
      throw new Error("Пользователь с такой почтой уже есть.");
    }

    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });

    const result = await user.save();

    return { ...result._doc, _id: result.id, password: null };
  } catch (error) {
    throw error;
  }
};
