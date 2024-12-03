const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const confRoutes = require('./routes/confRoutes');
const rateLimiter = require('./middlewares/rateLimiter');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/', rateLimiter, confRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
