require('dotenv').config()
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const multer = require("multer")
const path = require("path")
const fs = require('fs')
const Book = require("../model/bookModel");
const User = require('../model/userModel')


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 10 },
}).single('image'); // 10mb

function bookController() {
  return {


    // ****************************  Book Create ******************************//

    async create(req, resp) {
      try {
        handleMultipartData(
          req, resp, async (err) => {
            if (err) {
              console.error(err);
              return resp.status(500).json({ error: 'Internal server error' });
            }

            const { bookTitle, authorName, price, content, author_id } = req.body;
            const uploadedFile = req.file;
            console.log(req.body)


            if (!bookTitle || !authorName || !price || !content || !author_id || !uploadedFile) {
              return resp.status(400).json({ error: 'All required fields, including a file, are mandatory' });
            }

            try {
              // Upload file to Cloudinary
              const result = await cloudinary.uploader.upload(uploadedFile.path, {
                folder: 'books',
              });

              const createBook = await Book.create({
                bookTitle,
                authorName,
                content,
                author_id,
                price,
                image: result.secure_url,
              });

              const user = await User.findById(author_id);
              if (user) {
                user.books.push(createBook);
                await user.save();
              }

              resp.status(201).json({ data: { book: createBook } });
            } catch (uploadError) {
              console.error('Upload error:', uploadError);
              return resp.status(500).json({ error: 'Failed to upload image or save book' });
            }

          })
      } catch (err) {
        console.error(err);
        resp.status(500).json({ error: 'Unexpected error occurred' });
      }
    },

    // *****************  Find List All Book *******************************//
    async index(req, resp) {
      try {
        const books = await Book.find().select("-updatedAt -createdAt -__v").sort({ _id: -1 });

        if (books.length > 0) {
          resp.json({ data: { book: books } });
        } else {
          resp.json({ data: { book: "No Books Found" } });
        }
      } catch (err) {
        console.error(err);
        resp.status(500).json({ error: "Failed to fetch book" });
      }
    },

    //****************** Book Update by Id  **************************** */
    async update(req, resp) {
      try {
        handleMultipartData(req, resp, async (err) => {
          if (err) {
            console.error(err);
            return resp.status(500).json({ error: 'Internal server error' });
          }

          const { bookTitle, content, authorName, price } = req.body;
          console.log(req.body)



          let filePath;
          if (req.file) {
            // filePath = req.file.path
            filePath = req.file.path.replace(/\\/g, '/');
          }


          const imageURL = `http://${req.headers.host}/${filePath}`;
          // const imageURL = `http://${req.headers.host}/${filePath.replace(/\\/g, '/')}`;
          // console.log(req.file)
          console.log(filePath)

          const existingBook = await Book.findById(req.params.id);
          console.log("Exists Book : ", existingBook)

          if (!existingBook) {
            return resp.status(404).json({ error: 'Book not found' });
          }




          // If a new image is uploaded, delete the previous image
          if (req.file && existingBook.image) {
            try {
              const imageUrl = existingBook._doc.image;
              // Extract the path from the URL
              const imagePath = imageUrl.replace(`http://${req.headers.host}/`, '');

              await fs.promises.unlink(imagePath);
              // fs.unlink(imagePath, (err) => {
              //   if (err) {
              //     console.error(err);
              //     return resp.status(500).json({ error: "Image Not Deleted" });
              //   }
              // });
            } catch (err) {
              console.error(err);
              return resp.status(500).json({ error: "Failed to delete previous image" });
            }
          }


          let image;
          if (imageURL) {
            image = imageURL;
          } else {
            image = existingBook.image;
          }

          const updateBook = await Book.findByIdAndUpdate(
            { _id: req.params.id },
            {
              bookTitle,
              authorName,
              content,
              price,
              ...(req.file && { image: imageURL }),
            },
            { new: true }
          ).select("-updatedAt -createdAt -__v")
            .sort({ _id: -1 });

          if (!updateBook) {
            return resp.status(404).json({ error: "Book not found" });
          }

          console.log(updateBook)
          resp.status(201).json({
            data: {
              book: updateBook,
              message: "Book Update sucessfully"
            }
          })
        })
      } catch (err) {
        console.error(err);
        resp.status(500).json({ error: 'Failed to update book' });
      }
    },
    // ******************  Delete Book by Id  ******************************//
    async delete(req, resp) {
      try {
        const bookId = req.params.id;
        const deleteBook = await Book.findOneAndRemove({ _id: bookId });
        if (!deleteBook) {
          return resp.status(404).json({ error: "Book not found" });
        }

        const imageUrl = deleteBook._doc.image;
        // Extract the path from the URL 
        const imagePath = imageUrl.replace("http://localhost:8500/", '');
        console.log(imagePath)

        await fs.promises.unlink(imagePath);

        // Find the author and remove the book reference
        const authorId = deleteBook._doc.author_id;
        const author = await User.findById(authorId);

        if (author) {
          author.books.pull(bookId); // Remove the book reference
          await author.save();
        } else {
          console.error(`Author with id ${authorId} not found.`);
        }

        return resp.status(204).json({ data: { message: "Book deleted successfully" } });

      } catch {
        console.error(err);
        resp.status(500).json({ error: "Failed to delete book" });
      }
    },

    //*************  Find One Book  ************* *//
    async find(req, resp) {
      try {
        const bookId = req.params.id;
        const findOneBook = await Book.findOne({ _id: bookId }).select(
          "-updatedAt -createdAt -_v"
        );
        if (!findOneBook) {
          return resp.status(404).json({ error: "Book not found" });
        }
        resp.json(findOneBook);
      } catch (err) {
        resp.status(500).json({ error: "Failed to fetch book" });
      }
    },

    //******************  Search Book  *********************** */
    async search(req, resp) {
      try {
        let searchKey = req.params.key;
        let searchBook = await Book.find({
          "$or": [
            { bookTitle: { $regex: searchKey, $options: 'i' } },
            { authorName: { $regex: searchKey, $options: 'i' } },
          ],
        }).select("-updatedAt -createdAt -_v");
        if (searchBook.length === 0) {
          return resp.status(404).json({ error: "Book not found" });
        }
        resp.json(searchBook);
      } catch (err) {
        console.error('Error searching for books:', err);
        resp.status(500).json({ error: "Failed to search book" });
      }
    },

    //****************** All Book Find By Author_id  *********************** *//
    async findBooksByAuthorId(req, resp) {
      try {
        const { author_id } = req.params;
        // console.log(author_id)

        // Valid author_id is a valid ObjectId 
        if (!mongoose.Types.ObjectId.isValid(author_id)) {
          return resp.status(400).json({ error: 'Invalid author_id' });
        }

        const books = await Book.find({ author_id })
          .select("-updatedAt -createdAt -__v")
          .sort({ _id: -1 });

        if (books.length > 0) {
          return resp.json({ data: { books } });
        }

        return resp.json({ data: { message: "No books found for the specified author_id" } });
      } catch (err) {
        console.error(err);
        return resp.status(500).json({ error: "Failed to fetch books" });
      }
    }
  };
}
module.exports = bookController;
