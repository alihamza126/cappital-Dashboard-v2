const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const userModel = require('./models/user')
const cors = require('cors');
const MongoStore = require('connect-mongo');

app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on your frontend URL
    credentials: true
}));
const uploadImg = require('./routes/upload/upload.js');
//routers
const auth = require('./routes/Auth');
const userRouter = require('./routes/user.js');
const reviews = require('./routes/reviews');
const homepage = require('./routes/homepage.js');
const course = require('./routes/course.js');
const referall = require('./routes/referal.js')
const purchase = require('./routes/purchases/purchases.js');
const adminDashInfo = require('./routes/dashboard/dashboardInfo.js');
const McQRouter = require('./routes/McQ/McQ.js');
const reportRouter = require('./routes/report/report.js');
const admin = require('./routes/Admin.js');


//dotenv variables
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const MongoUrl = process.env.MONGO_URL;


//mongoose sconnection is ok
const main = async () => {
    try {
        await mongoose.connect(MongoUrl);
        console.log("mongo connection is okk")
    } catch (error) {
        console.log(error);
    }
}
main();

// require files authenticate passport js
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportMongoose = require("passport-local-mongoose");
const multer = require('multer');
const wrapAsync = require('./utils/wrapAsync.js');
const { checkTrialStatus } = require('./utils/middleware.js');


const store = MongoStore.create({
mongoUrl: MongoUrl,
    crypto: {
        secret: 'capitalacademy'
    }
})

//session options
const sessionOption = {
    store,
    secret: 'capitalacademy',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 30 * 60 * 60 * 1000,
        maxAge: 24 * 60 * 60 * 1000
    }
}

app.use(cookieParser("capitalacademy"))
app.use(expressSession(sessionOption));

//passport js validations
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use('/uploads', express.static('uploads'));



app.use('/verify-session',checkTrialStatus, wrapAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const user = await userModel.findById(req.user._id);
            if (user) {
                res.json({ user: user });
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    } else {
        // res.status(401).send("User not registered");
    }
}));

app.get('/userinfo',checkTrialStatus, wrapAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        res.json({ user });
    } catch (error) {
        res.status(404).send('user expire');
    }
}));

//route paths
app.use('/upload', uploadImg);

app.use('/auth', auth);
app.use('/user', userRouter)
app.use('/reviews', reviews);
app.use('/homepage', homepage);
app.use('/course', course);
app.use('/referal', referall)
app.use('/purchase', purchase);
app.use('/adminDashboard', adminDashInfo);
app.use('/mcq', McQRouter);
app.use('/report', reportRouter);
app.use('/admin', admin);


//React app configurations
app.use(express.static(path.resolve(__dirname, 'client','dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client','dist','index.html'));
});


// ----------------------------------error Handling Middle-Ware--------------------------------
// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, 'page not found'))
// })

// ----------------------------------error Handling Middle-Ware--------------------------------
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Multer error: ' + err.message });
        console.log(err)
    } else {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' });
    }
    const { status = 500, message = "error is occour", name } = err;
    res.status(status).json({ message, name });
});

// -------------------------------------error Handling Middle-Ware--------------------------------


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
