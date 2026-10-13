import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    isPrivate: { type: Boolean, default: false },
    passcode: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    autoDelete: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);