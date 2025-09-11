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
			res.status(200).json({ book });
		})

		.catch((error) => {
			res.status(500).json({ error });
		});
};

exports.createBooks = (req, res) => {
	delete req.body._id;
	const book = new Book({
		...req.body,
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

/*exports.getBestBooks = (req, res) => {};
/*exports.updateBooks = (req, res) => {};
/*exports.deleteBooks = (req, res) => {};*/
