const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    console.log(`Fetching user with ID: ${req.params.id}`);
    
    if (!req.params.id) {
      console.log('No ID provided');
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      console.log(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`User found: ${user.name} (${user.email})`);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const getGenderOptions = (req, res) => {
  try {
    res.json(["Male", "Female", "Other"]);
  } catch (error) {
    console.error("Error getting gender options:", error);
    res.status(500).json({
      message: "Error fetching gender options",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = new User(req.body);
    const newUser = await user.save();
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      userId: deletedUser._id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getGenderOptions,
  createUser,
  updateUser,
  deleteUser,
};
