require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const { connectMonggose } = require('./app/database/db')
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
// ******************  Enable CORS  ********************//
app.use(cors());

// ************************  Database Connection  **********************************//
connectMonggose();

// ****************    Security Headers   ****************************//
// app.use(helmet());

// *************************    Assets    ****************************************//
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use("/uploads", express.static("uploads"))

// *************   Body parsing middleware  ************************//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


// *********************************** API Routes ********************************//
adminRoutes(app);
userRoutes(app);
bookRoutes(app);
reviewRoutes(app);

// ************************   Port Start   ********************************//
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
    console.log(`My server start on this port ${PORT}`)
})
