const bookController = require("../app/controller/bookController");
const userController = require("../app/controller/userController");

function initRoutes(app) {
  //*********************************   API routes  **************************** *//


  //  POST  http://localhost:8500/books/addBook
  app.post("/books/addBook", bookController().create);

  //  GET  http://localhost:8500/books/:_id  // Get Single Book
  app.get("/books/:id", bookController().find);

  //  PUT  http://localhost:8500/books/:_id
  app.put("/books/:id", bookController().update);

  //  GET  http://localhost:8500/books   All List Books
  app.get("/books", bookController().index);

  // delete   http://localhost:8500/books/:_id
  app.delete("/books/:id", bookController().delete);

  // Search Books in API 
  app.get("/search/:key", bookController().search);

  // Book Search by Author Id  API 
  app.get("/books/author_id/:author_id", bookController().findBooksByAuthorId);

  //  POST      Add User
  app.post("/register", userController().createUser);
  //  POST    Login User
  app.post("/login", userController().loginUser);
}
module.exports = initRoutes;
