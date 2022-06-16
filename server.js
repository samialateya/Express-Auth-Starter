/* ---------------- import express and configuration packages --------------- */
const express = require('express');
require('dotenv').config();
require('express-async-errors');
//import middleware
const { ErrorHandlerMiddleware, NotFoundMiddleware } = require('./Middleware');

/* --------------------- initialize express application --------------------- */
const app = express();

/* ---------------------------- set static folder --------------------------- */
app.use('/profile',express.static('public/assets/profile'));

/* --------------------------- register the routes -------------------------- */
const authRoutes = require('./routes/AuthRoutes');
app.use('/auth',authRoutes);

/* --------------------------- register Middleware -------------------------- */
app.use(ErrorHandlerMiddleware);
app.use(NotFoundMiddleware);

/* ----------------------------- listen on port ----------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('listening on port 3000');
});