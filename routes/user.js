const router = require("express").Router();
const { body, header, oneOf } = require("express-validator");

const { isLoggedIn } = require("../middlewares");
const { getProfile, updateProfile } = require("../controllers/user");
const register = require("../controllers/register");
const { loginUser } = require("../controllers/login");
const { userSubscription } = require('../controllers/plansController');
const { validate } = require("../utils/validator");

router.post(
  "/register", // Register user endpoint
  [
    body("name", "Name field is required").isString(),
    body("password", "Password length should be atleast 8 characters").isLength(
      {
        min: 8,
      },
    ),
    header("Authorization", "Token is required").exists(),
  ],
  validate,
  register,
);

router.post(
  "/login",
  [
    body("password").notEmpty().withMessage("Password is required"),
    oneOf(
      [body("phoneNumber").isMobilePhone()],
      "Phone number is required",
    ),
  ],
  validate,
  loginUser,
);

router.get("/profile", isLoggedIn, getProfile);

router.put("/profile", isLoggedIn, updateProfile);

module.exports = router;
