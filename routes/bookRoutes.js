const bookController = require("../app/controller/bookController");
const authMiddleware = require("../app/middleware/authMiddleware")

function initRoutes(app) {
    //********************************* Author Book API routes  **************************** *//

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

 


}
module.exports = initRoutes