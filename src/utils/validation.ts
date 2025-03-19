import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

export const CreateSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  customerID: Joi.string().lowercase().required(),
});

export const loginSchema = Joi.object().keys({
  customerID: Joi.string().lowercase(),
});

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: "7d" });
};

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
