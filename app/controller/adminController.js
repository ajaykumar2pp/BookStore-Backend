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

        const User = await User.findOne({ _id: userId }, { password: 0 });

        if (!User) {
          return resp.status(404).json({ message: 'User not found' });
        }

        return resp.status(200).json(User);
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Internal server error" });
      }

    },

    async updateUser(req, resp) {
      try {
        const id = req.params.id;
        const updatedUserData = req.body;

        const updateUser = await User.updateOne(
          { _id: id },
          {
            $set: updatedUserData,
          }
        );
        return resp.status(200).json(updateUser);
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

        if (!deleteUser) {
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
