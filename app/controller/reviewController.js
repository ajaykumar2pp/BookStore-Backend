require('dotenv').config()
const Book = require("../model/bookModel");
const Review = require("../model/reviewModel");
const User = require("../controller/userController")
let moment = require('moment');
moment().format();

function reviewController() {
    return {
        //*************************  Post Review Book *************** */
        async postReview(req, resp) {
            try {
                const { username, email, rating, comment, bookId } = req.body;
                console.log(req.body)
                if (!username || !email || !rating || !comment || !bookId) {
                    return resp.status(400).json({ error: 'All fields are mandatory' });
                }

                const newReview = new Review({
                    username,
                    email,
                    rating,
                    comment,
                    bookId,
                    date: moment().format('MMMM Do YYYY')
                });

                const savedReview = await newReview.save();

                const book = await Book.findById(bookId);
                book.reviews.push(savedReview._id);
                await book.save();
                resp.status(201).json({ data: { review: savedReview } });
            } catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'Failed to post review' });
            }

        },

        //*************************  Delete  Review Book *************** */
        async deleteReview(req, resp) {
            try {
                const reviewId = req.params.reviewId;
                console.log(reviewId)

                const existingReview = await Review.findById(reviewId);

                if (!existingReview) {
                    return resp.status(404).json({ message: 'Review not found' });
                }

                const deleteReview = await Review.findByIdAndDelete(reviewId);
                if (!deleteReview) {
                    return resp.status(404).json({ message: 'Review not found' });
                }

                console.log('Review deleted:', deleteReview);

                resp.status(200).json({
                    data: {
                        message: "Review deleted successfully",
                        deletedReview: deleteReview
                    }
                });

            } catch (error) {
                console.error('Error deleting review:', error);
                resp.status(500).json({ error: 'Failed to delete review' });
            }
        },

        //*************************  Get Review By  Book *************** */
        async getReviewsByBook(req, resp) {
            try {
                const bookId = req.params.id;


                // Find the book by ID
                const book = await Book.findById(bookId);
                // console.log(book)

                if (!book) {
                    return resp.status(404).json({ error: 'Book not found' });
                }

                const reviews = await Review.find({ bookId }).select('username date rating comment').sort({ date: -1 });

                resp.status(200).json({ data: { reviews } });
            } catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'Failed to fetch reviews for the book' });
            }
        },

    };
}

module.exports = reviewController;