import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signUpController = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (fullName === "" || email === "" || password === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate Token
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error creating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
    generateToken(user._id, res);
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error logging out:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfilePicController = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  try {
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload profile picture to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(profilePic);

    // Update profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating profile picture:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfileNameController = async (req, res) => {
  const { fullName } = req.body;
  const userId = req.user._id;

  try {
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Update profile Name in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating profile picture:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authenticatedUser = (req, res) => {
  try {
    res.status(200).json({ message: "Authenticated user", user: req.user });
  } catch (error) {
    console.log("Error getting authenticated user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Delete profile picture from Cloudinary
    if (user.profilePic) {
      await cloudinary.uploader.destroy(
        user.profilePic.split("/").pop().split(".")[0]
      );
    }

    // Update profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: "" },
      { new: true }
    ).select("-password");
    res.status(200).json({
      message: "Profile picture removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error removing profile picture:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiveId = req.params.id;

    if (userId.toString() !== receiveId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete other's profile" });
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);

    // Delete profile picture from Cloudinary
    if (req.user.profilePic) {
      await cloudinary.uploader.destroy(
        req.user.profilePic.split("/").pop().split(".")[0]
      );
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log("Error deleting profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
