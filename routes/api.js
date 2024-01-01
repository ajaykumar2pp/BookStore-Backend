const bookController = require("../app/controller/bookController");
const userController = require("../app/controller/userController");
const reviewController = require("../app/controller/reviewController");

function initRoutes(app) {
  //*********************************   API routes  **************************** *//


  //  POST  http://localhost:8500/books/addBook
  app.post("/books/addBook", bookController().create);

  //  GET  http://localhost:8500/books/:_id  // Get Single Book
  app.get("/books/:id", bookController().find);

  //  PUT  http://localhost:8500/books/:_id
  app.put("/books/:id", bookController().update);

  //  GET  npm start   All List Books
  app.get("/all-books", bookController().index);  //Get All Books

  // delete   http://localhost:8500/books/:_id
  app.delete("/books/:id", bookController().delete);

  // Search Books in API 
  app.get("/search/:key", bookController().search);

  // Book Search by Author Id  API 
  app.get("/books/author/:author_id", bookController().findBooksByAuthorId);

  //  POST      Add User
  app.post("/register", userController().createUser);
  //  POST    Login User
  app.post("/login", userController().loginUser);

  // POST  http://localhost:8500/books/review
  app.post("/books/review", reviewController().postReview); //  Review Book  

  // POST  http://localhost:8500/books/delete-review
  app.post("/books/delete-review/:id", reviewController().deleteReview); // Delete Review Book

  // POST  http://localhost:8500/books/get-reviews
  app.get("/books/get-reviews/:id", reviewController().getReviewsByBook); // Get Reviews By book
}
module.exports = initRoutes;
