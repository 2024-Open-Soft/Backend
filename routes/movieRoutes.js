const router = require('express').Router();

const { isLoggedIn } = require('../middleware');
const { updateHistoryController, deleteHistoryController } = require('../controllers/movieHistoryController');
const { updateWatchlistController, deleteWatchlistController } = require('../controllers/movieWatchlistController');



const { body, header, oneOf, validationResult, withMessage } = require("express-validator");

// Middleware function to validate email or phoneNumber
const validateAddToHistory = [
    // Check if email or phoneNumber is provided
    oneOf([
        body("movieId",).exists().isMobilePhone(),
        [
            body("email").exists().isEmail(),
            header("Authorization").exists()
        ]
    ], { message: "Email with Authentication or phoneNumber is required" }),
    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


router.post("/history",
    [
        body("movieId", "Movie Id required").exists(),
        body("timestamp", "Timestamp required").optional().isLength({ min: 5, max: 8 }),
        header("Authorization", "Authorization token is required").exists()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    isLoggedIn, updateHistoryController
);

router.delete("/history",
    [
        body("movieId", "Movie Id required").exists(),
        header("Authorization", "Authorization token is required").exists()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    isLoggedIn, deleteHistoryController
);

router.post("/watchlist",
    [
        body("movieId", "Movie Id required").exists(),
        header("Authorization", "Authorization token is required").exists()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    isLoggedIn, updateWatchlistController
);

router.delete("/watchlist",
    [
        body("movieId", "Movie Id required").exists(),
        header("Authorization", "Authorization token is required").exists()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    isLoggedIn, deleteWatchlistController
);