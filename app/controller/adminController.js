require('dotenv').config()
const User = require("../model/userModel");


function authController() {
  return {

    async getAllUser(req, resp) {
      try {

        const users = await User.find({}, { password: 0 }).select("-updatedAt -createdAt -__v");
        if (!users || users.length === 0) {
          return resp.status(404).json({ message: "No Users Found" });
        }
        resp.json({ data: users });
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
      }
    },

    async getSingleUser(req, resp) {
      try {
        const userId = req.params.id;
        console.log(userId)

        const user = await User.findOne({ _id: userId }, { password: 0 });

        if (!user) {
          return resp.status(404).json({ message: 'User not found' });
        }

        return resp.status(200).json(user);
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
      }

    },

    async updateUser(req, resp) {
      try {
        const userId = req.params.id;
        const updatedUserData = req.body;

        // Check if the user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
          return resp.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId, 
          updatedUserData,
          {
            new: true,
          }
          );

        return resp.status(200).json(updatedUser);
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
      }
    },

    async deleteUser(req, resp) {
      try {
        const userId = req.params.id;
        console.log(userId)

        const deleteUser = await User.deleteOne({ _id: userId });

        if (deleteUser.deletedCount === 0) {
          return resp.status(404).json({ message: 'User not found' });
        }

        return resp.status(200).json({ message: "User Deleted Successfully" });
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
      }

    },

    async getAuthorDetail(req, resp) {
      try {

        const user = await User.find().populate({
          path: 'books',
          populate: {
            path: 'reviews',
            model: 'Review',
            select: '-updatedAt -createdAt -__v',
          }
        }).select("-updatedAt -createdAt -__v");
        resp.json({ data: user });
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "No User Found" });
      }
    }
  }
};

module.exports = authController;
