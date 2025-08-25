require('dotenv').config();
// const UserReportCronService = require('./service/admin/cronjob.service');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongooseConnection = require('./src/config/db');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// router
const userRouter = require('./src/routes/app/user.routes');
const adminRouter = require('./src/routes/admin/admin.routes');
const imageRouter = require('./src/routes/upload/upload.route');
const paymentRouter = require('./src/routes/payment/payment.routes'); // New payment routes

const app = express();
const PORT = process.env.PORT || 3006;

// Use a lint-friendly base dir instead of __dirname
const ROOT_DIR = path.resolve();

mongooseConnection();

// CORS (restrict origin in production)
app.use(cors({
  origin: '*',
  credentials: true
}));

// Webhook endpoint MUST be before any other body-parsing middleware
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload());
app.use(express.json({ limit: '50mb' }));

// Static file serving (use ROOT_DIR to avoid __dirname)
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'profile')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'banner')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'linkLogo')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'tempUploads')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'default')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'themeImg')));
app.use('/images', express.static(path.join(ROOT_DIR, 'public', 'linkCategory')));

// UserReportCronService.startCronJob();

// Routes
app.use('/api/v1', userRouter);
app.use('/api/admin/v1', adminRouter);
app.use('/api/upload', imageRouter);
app.use('/api/payment', paymentRouter); // New payment routes

app.use((request, response) => {
  response.status(404).json({
    status: false,
    message: 'This endpoint does not exist. Please provide a valid endpoint .'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
