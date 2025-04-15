import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all users except the logged-in user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res
      .status(200)
      .json({ message: "Users fetched successfully", users: filteredUsers });
  } catch (error) {
    console.log("Error getting users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user._id;

    // Find all messages between the logged-in user and the selected user
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: id },
        { senderId: id, receiverId: loggedInUserId },
      ],
    });

    res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    console.log("Error getting messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    // Upload image to Cloudinary
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    // Save message to database
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    newMessage.save();

    // realtime functionality of messaging (check the reciever is active in online or not)
    const receiverSocketId = getReceiverSocketId(receiverId);

    // Emit message to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ message: newMessage });
  } catch (error) {
    console.log("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
