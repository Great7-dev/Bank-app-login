import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  firstname: string;
  lastname: string;
  customerID: string;
}

const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    customerID: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
