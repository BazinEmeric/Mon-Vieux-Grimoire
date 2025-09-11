const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const UserRouter = require("./Router/Users");
const BookRouter = require("./Router/Books");

mongoose
	.connect(
		"mongodb+srv://emericperso_db_user:AiTJ1H0c1Wwkn68H@cluster0.0yvbwrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");

	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use("/api/books", BookRouter);
app.use("/api/auth", UserRouter);

module.exports = app;
