import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    expireAt: { type: Date },
  },
  { timestamps: true }
);


messageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Message", messageSchema);