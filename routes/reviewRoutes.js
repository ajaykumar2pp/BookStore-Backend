const reviewController = require("../app/controller/reviewController");
const authMiddleware = require("../app/middleware/authMiddleware")

function initRoutes(app) {
    //*********************************  User Reviews API routes  **************************** *//

  // POST  http://localhost:8500/books/review
  app.post("/books/review", authMiddleware, reviewController().postReview); //  Review Book  

  // DELETE  http://localhost:8500/books/delete-review/:reviewId
  app.delete("/books/delete-review/:reviewId", authMiddleware, reviewController().deleteReview); // Delete Review Book

  // POST  http://localhost:8500/books/get-reviews
  app.get("/books/get-reviews/:id", authMiddleware, reviewController().getReviewsByBook); // Get Reviews By book

  


}
module.exports = initRoutes