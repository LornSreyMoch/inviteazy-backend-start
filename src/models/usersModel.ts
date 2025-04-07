import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "public" | "tourist";
}

const userSchema: Schema = new Schema(
    {
      full_name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["admin", "public", "tourist"], required: true },
      phone_number: { type: String },
      profile_picture: { type: String },
      address: { type: String },
    },
    { timestamps: true }
  );
  

export const UserModel = mongoose.model<IUser>("User", userSchema);
