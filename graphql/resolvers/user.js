import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

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
