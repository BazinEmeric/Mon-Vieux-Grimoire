const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");

exports.getAllBooks = (req, res) => {
	Book.find()
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(500).json(error));
};

exports.getOneBooks = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			res.status(200).json(book);
		})

		.catch((error) => {
			res.status(500).json(error);
		});
};

exports.createBooks = (req, res) => {
	const bookObject = JSON.parse(req.body.book);
	delete bookObject._id;
	delete bookObject.userId;
	if (bookObject.ratings[0].grade === 0) {
		delete bookObject.ratings;
	}
	const filename =
		req.file.originalname.split(" ").join("_") + Date.now() + ".webp";
	sharp(req.file.buffer)
		.webp({ quality: 40 })
		.toFile("./images/" + filename)
		.then(() => {
			const book = new Book({
				ratings: [],
				averageRating: 0,
				...bookObject,
				userId: req.auth.userId,
				imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
			});
			book
				.save()
				.then(() => {
					res.status(201).json({ message: "Livre créé !" });
				})

				.catch((error) => {
					res.status(500).json({ error });
				});
		})
		.catch((error) => res.status(400).json(error));
};

exports.getBestBooks = (req, res) => {
	Book.find()
		.then((book) => {
			const sortBook = book.sort((b, a) => a.averageRating - b.averageRating);
			const bestRating = [];
			for (let i = 0; i < 3; i++) {
				bestRating[i] = sortBook[i];
			}
			res.status(200).json(bestRating);
			//res.status(200).json(book);
		})
		.catch((error) => res.status(400).json(error));
};

exports.createRatingBooks = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			const exists = book.ratings.find(
				(rating) => rating.userId === req.auth.userId
			);
			if (req.body.rating > 5 || req.body.rating < 0) {
				return res
					.status(400)
					.json({ message: "Valeur incorrect de la note attribué" });
			}
			if (!exists) {
				book.ratings.push({
					userId: req.auth.userId,
					grade: req.body.rating,
				});
				let cumulrating = 0;
				book.ratings.map((item) => {
					cumulrating += item.grade;
				});
				const averageRating =
					Math.round((100 * cumulrating) / book.ratings.length) / 100;
				book.averageRating = averageRating;
				book
					.save()
					.then((book) => res.status(201).json(book))
					.catch((error) => res.status(400).json(error));
			} else {
				return res
					.status(401)
					.json({ message: "L'utilisateur a déjà noté ce livre" });
			}
		})

		.catch((error) => {
			res.status(500).json(error);
		});
};

exports.deleteBooks = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			const valid = req.auth.userId === book.userId;
			if (!valid) {
				return res.status(403).json({ message: "Unauthorized request" });
			}
			const filename = book.imageUrl.split("/images/")[1];
			fs.unlink("images/" + filename, () => {
				book
					.deleteOne()
					.then(() => res.status(200).json({ message: "Livre supprimé ! " }))
					.catch((error) => res.status(400).json(error));
			});
		})
		.catch((error) => res.status(500).json(error));
};

exports.updateBooks = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			const valid = req.auth.userId === book.userId;
			if (!valid) {
				return res.status(403).json({ message: "Unauthorized request" });
			}
			let bookObject = {};
			if (!req.file) {
				bookObject = { ...req.body };
				delete bookObject.userId;
				book
					.updateOne(bookObject)
					.then(() => res.status(201).json({ message: "Livre modifié" }))
					.catch((error) => res.status(400).json(error));
			} else {
				console.log(req.file);
				const deletefilename = book.imageUrl.split("images/")[1];
				fs.unlink("images/" + deletefilename, (err) => {
					if (err) {
						console.error("Erreur suppression image:", err);
					} else {
						console.log(`${deletefilename} supprimée`);
					}
				});
				const filename =
					req.file.originalname.split(" ").join("_") + Date.now() + ".webp";
				sharp(req.file.buffer)
					.webp({ quality: 40 })
					.toFile("./images/" + filename)
					.then(() => {
						bookObject = {
							...JSON.parse(req.body.book),
							imageUrl: `${req.protocol}://${req.get(
								"host"
							)}/images/${filename}`,
						};
						delete bookObject.userId;
						book
							.updateOne(bookObject)
							.then(() => res.status(201).json({ message: "Livre modifié" }))
							.catch((error) => res.status(400).json(error));
					})
					.catch((error) => res.status(400).json(error));
			}
		})
		.catch((error) => res.status(500).json(error));
};
