const authMiddleware =  require("./../middleware/authMiddleware");
const adminController = require("./../controller/adminController");
const adminMiddleware = require("./../middleware/adminMiddleware");


function initRoutes(app) {
  //*******************   Admin Route routes  **************************** *//

  //  GET   http://localhost:8500/users
  app.get("/users", authMiddleware, adminMiddleware, adminController().getAllUser); // Get All User

  //  GET   http://localhost:8500/user/:id
  app.get("/users/:id", authMiddleware, adminMiddleware, adminController().getSingleUser); // Get Single User

  //  PUT   http://localhost:8500/update-user/:id
  app.put("/update-users/:id", authMiddleware, adminMiddleware, adminController().updateUser); // Update User


  //  DELETE   http://localhost:8500/users/:id 
  app.delete("/users/:id", authMiddleware, adminMiddleware, adminController().deleteUser); // Delete User

  // POST http://localhost:8500/users/:id/block
  app.post("/users/:id/block",   adminController().blockUser)  // Block User
}
module.exports = initRoutes;
