const authMiddleware = require("../app/middleware/authMiddleware")
const adminController = require("../app/controller/adminController");
const adminMiddleware = require("../app/middleware/adminMiddleware");


function initRoutes(app) {
  //*********************************   Admin Route routes  **************************** *//

    //  GET   http://localhost:8500/users
    app.get("/users", authMiddleware,adminMiddleware, adminController().getAllUser); // Get All User

 //  GET   http://localhost:8500/user
 app.get("/users/:id", authMiddleware,adminMiddleware, adminController().getSingleUser); // Get Single User

 //  DELETE   http://localhost:8500/users/:id 
 app.delete("/users/:id", authMiddleware,adminMiddleware, adminController().deleteUser); // Delete User


}
module.exports = initRoutes;
