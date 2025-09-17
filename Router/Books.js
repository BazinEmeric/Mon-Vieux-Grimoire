const express = require("express");
const router = express.Router();
const CrtlBook = require("../Controllers/Books");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.get("/bestrating", CrtlBook.getBestBooks);
router.get("/", CrtlBook.getAllBooks);
router.post("/:id" + "/rating", auth, CrtlBook.createRatingBooks);
router.get("/:id", CrtlBook.getOneBooks);
router.post("/", auth, multer, CrtlBook.createBooks);
router.delete("/:id", auth, CrtlBook.deleteBooks);
router.put("/:id", auth, multer, CrtlBook.updateBooks);

module.exports = router;
