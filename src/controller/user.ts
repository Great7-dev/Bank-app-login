import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // Import the correct Mongoose User model
import {
  CreateSchema,
  generateToken,
  loginSchema,
  options,
} from "../utils/validation";
import UserSchema from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const RegisterUser: RequestHandler = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    // Validate the request body
    const ValidateUser = CreateSchema.validate(req.body, options);
    if (ValidateUser.error) {
      return res
        .status(400)
        .json({ Error: ValidateUser.error.details[0].message });
    }

    // Create new user instance
    const newUser = new UserSchema({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      customerID: req.body.customerID,
      twoFactorAuth: "",
    });

    // Save user to database
    const record = await newUser.save();

    return res.status(201).json({
      status: "Success",
      msg: "User created successfully",
      record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to register user",
      route: "/create",
    });
  }
};

export const LoginUser: RequestHandler = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    // Validate request body
    const { customerID } = req.body;
    if (!customerID) {
      return res.status(400).json({ msg: "Customer ID is required" });
    }

    // Check if user exists
    const user = await UserSchema.findOne({ customerID });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Customer ID" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, customerID: user.customerID },
      process.env.JWT_SECRET as string, // Ensure `JWT_SECRET` is set in .env
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "Success",
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        customerID: user.customerID,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser: RequestHandler = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const { customerID } = req.params; // Extract customerID from URL parameters

    if (!customerID) {
      return res.status(400).json({ msg: "Customer ID is required" });
    }

    // Find user by customerID and return only the 'firstname' and 'lastname' fields
    const user = await UserSchema.findOne(
      { customerID },
      { firstname: 1, lastname: 1, _id: 0 } // Correct projection
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Failed to get user",
      route: "/users",
    });
  }
};
