const Book = require("../models/Book");
const fs = require("fs");

exports.getAllBooks = (req, res) => {
	Book.find()
		.then((book) => {
			res.status(200).json(book);
		})
		.catch((error) => res.status(500).json({ error }));
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
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
	});
	book
		.save()
		.then(() => {
			res.status(201).json({ message: "Livre créé !" });
		})

		.catch((error) => {
			res.status(500).json({ error });
		});
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
			const valid = book.ratings.find(
				(rating) => rating.userId === req.auth.userId
			);
			if (req.body.rating > 5 || req.body.rating < 0) {
				return res
					.status(400)
					.json({ message: "Valeur incorrect de la note attribué" });
			}
			if (!valid) {
				book.ratings.push({
					userId: req.auth.userId,
					grade: req.body.rating,
				});
				book
					.save()
					.then((book) => {
						let cumulrating = 0;
						book.ratings.map((item, index) => {
							cumulrating += item.grade;
						});
						const averageRating = cumulrating / book.ratings.length;
						console.log(averageRating);
						res.status(201).json(book);
					})
					.catch((error) => res.status(400).json(error));
			} else {
				res.status(401).json({ message: "L'utilisateur a déjà noté ce livre" });
			}
		})

		.catch((error) => {
			res.status(500).json(error);
		});
};

/*exports.updateBooks = (req, res) => {};
/*exports.deleteBooks = (req, res) => {};*/
