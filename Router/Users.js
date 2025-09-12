const express = require("express");
const router = express.Router();
const CrtlUser = require("../Controllers/Users");

router.post("/signup", CrtlUser.signup);
router.post("/login", CrtlUser.login);

module.exports = router;
