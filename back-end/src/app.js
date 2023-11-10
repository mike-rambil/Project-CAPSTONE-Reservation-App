const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const app = express();
const cors = require('cors');

const notFound = require('./errors/notFound');
const errorHandler = require('./errors/errorHandler');

const reservationsRouter = require('./reservations/reservations.router');
const tablesRouter = require('./tables/tables.router');

// <------------------------------CORS -------------------------->

app.use(cors());

// <---------------------- Body Parser -------------------------->

app.use(express.json());

// <------------------------- Routes ---------------------------->

app.use('/reservations', reservationsRouter);
app.use('/tables', tablesRouter);

// <----------------------- 404 Not Found ----------------------->

app.use(notFound);

// <-------------------- Global Error Handler -------------------->

app.use(errorHandler);

module.exports = app;
