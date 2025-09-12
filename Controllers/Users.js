const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user
				.save()
				.then(() => {
					console.log(user);
					res.status(201).json({ message: "Utilisateur créé !" });
				})
				.catch((err) => {
					console.log(req.body.email);
					res.status(400).json({ err });
				});
		})
		.catch((err) => res.status(500).json({ err }));
};

exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: "l'email et/ou le mot de passe ne sont pas correct",
				});
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({
							message: "l'email et/ou le mot de passe ne sont pas correct",
						});
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
							expiresIn: "24h",
						}),
					});
				})
				.catch((Error) => res.status(500).json({ Error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
