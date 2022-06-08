/* ---------------- import express and configuration packages --------------- */
const express = require('express');
require('dotenv').config();
require('express-async-errors');

/* --------------------- initialize express application --------------------- */
const app = express();

/* --------------------------- register the routes -------------------------- */
const authRoutes = require('./routes/AuthRoutes');
app.use('/auth',authRoutes);

/* ----------------------------- listen on port ----------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('listening on port 3000');
});