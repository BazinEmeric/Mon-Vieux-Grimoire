const express = require("express");
const router = express.Router();
const CrtlBook = require("../Controllers/Books");

router.get("/" + "", CrtlBook.getAllBooks);
router.get("/:id", CrtlBook.getOneBooks);
router.post("/", CrtlBook.createBooks);

/*router.get("/bestrating", CrtlBook.getBestBooks);
router.put("/:id", CrtlBook.updateBooks);
router.delete("/:", CrtlBook.deleteBooks);
router.post("/:id/rating", CrtlBook.createRatingBooks);*/

module.exports = router;
