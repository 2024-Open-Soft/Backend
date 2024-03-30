const router = require("express").Router();

const { forgotPassword, resetPassword, validToken } = require("../controllers/password");

const { body, header } = require("express-validator");
const { validate } = require("../utils/validator");

router.post("/forgot", [
    body("email", "Email Id required").exists().isEmail(),
],
    validate, forgotPassword);

router.post("/reset", [
    body("password", "Password required").exists(),
    header("Authorization", "Authorization token is required").exists(),
],
    validate, resetPassword);

router.get("/valid-token", [
    header("Authorization", "Authorization token is required").exists(),
],
    validate, validToken);

module.exports = router;