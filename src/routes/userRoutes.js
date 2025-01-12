const userController = require("./../controller/userController");   

function initRoutes(app) {
    //*********************************   User API routes  **************************** *//

    //  POST   http://localhost:8500/api/register   
    app.post("/api/register", userController().createUser); // User Register

    //  POST   http://localhost:8500/api/login
    app.post("/api/login", userController().loginUser); // User Login


}
module.exports = initRoutes