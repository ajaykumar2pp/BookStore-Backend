const bookController = require("../app/controller/bookController");
const userController = require("../app/controller/userController");
const reviewController = require("../app/controller/reviewController");
const authMiddleware = require("../app/middleware/authMiddleware")

function initRoutes(app) {
  //*********************************   API routes  **************************** *//

  //  POST   http://localhost:8500/register   
  app.post("/register", userController().createUser); // User Register

  //  POST   http://localhost:8500/login
  app.post("/login", userController().loginUser); // User Login

  //  POST  http://localhost:8500/books/addBook
  app.post("/books/addBook", authMiddleware, bookController().create); // Add Book

  //  GET  http://localhost:8500/books/:_id  
  app.get("/books/:id", authMiddleware, bookController().find); // Get Single Book

  //  GET  http://localhost:8500/all-books
  app.get("/all-books", authMiddleware, bookController().index);  //Get All Books

  //  PUT  http://localhost:8500/books/:_id
  app.put("/books/:id", authMiddleware, bookController().update);  //Update Book

  // DELETE   http://localhost:8500/books/:_id
  app.delete("/books/:id", authMiddleware, bookController().delete);  // Delete Book

  // GET   http://localhost:8500/search/:key
  app.get("/search/:key", authMiddleware, bookController().search);  //Book Search by Book Name and Author Name

  // Book Search by Author Id  API 
  app.get("/books/author/:author_id", authMiddleware, bookController().findBooksByAuthorId);



  // POST  http://localhost:8500/books/review
  app.post("/books/review", authMiddleware, reviewController().postReview); //  Review Book  

  // DELETE  http://localhost:8500/books/delete-review/:reviewId
  app.delete("/books/delete-review/:reviewId", authMiddleware, reviewController().deleteReview); // Delete Review Book

  // POST  http://localhost:8500/books/get-reviews
  app.get("/books/get-reviews/:id", authMiddleware, reviewController().getReviewsByBook); // Get Reviews By book
}
module.exports = initRoutes;
