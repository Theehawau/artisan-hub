const express = require("express");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const Artisan = require("../models/artisan");
const Comment = require("../models/comments");

router.get("", async (req, res) => {
	const artisans = await Artisan.find({}).limit(8);
	res.render("artisan/index", { artisans });
});
//To get all artisans
router.get("/artisansList", async (req, res) => {
	try {
		const artisans = await Artisan.find({}, "name lga category");
		res.status(200).send(JSON.stringify(artisans));
	} catch (error) {
		res.status(500).send("Unable to get Artists");
	}
});
router.get("/search", async (req, res) => {
	try {
		var q = req.query.q;
		const artisans = await Artisan.find({
			$or: [
				{ category: { $regex: q, $options: "i" } },
				{ name: { $regex: q, $options: "i" } },
			],
		});
		res.json(artisans);
	} catch (error) {
		res.status(500).send("Unable to get Artists");
	}
});
router.get("/artisans/search", async (req, res) => {
	try {
		var q = req.query.q;
		const artisans = await Artisan.find({
			$or: [
				{ category: { $regex: q, $options: "i" } },
				{ name: { $regex: q, $options: "i" } },
			],
		});
		res.render("artisan/results", {
			artisans: artisans,
			length: artisans.length,
		});
	} catch (error) {
		res.status(500).send("Unable to get Artists");
	}
});
//Filter By Category /artisans?category=painter
router.get("/artisans", async (req, res) => {
	try {
		if (Object.keys(req.query).length < 1) {
			res.render("artisan/index");
		}
		if (req.query) {
			req.query.subscribed = true;
			const artisans = await Artisan.find(
				req.query,
				"name category address avatar"
			);

			res.render("artisan/results", {
				artisans: artisans,
				length: artisans.length,
			});
		}
	} catch (error) {
		res.status(500).send("Unable to get Artists" + error);
	}
});
router.get("/artisan/:id", async (req, res) => {
	const artisan = await Artisan.findById(
		req.params.id,
		"name category address avatar lga phoneNumber"
	);
	if (!artisan) {
		throw new Error();
	}
	await artisan
		.populate({
			path: "comments",
			options: {
				limit: 2,
			},
		})
		.execPopulate();
	res.render("artisan/result", {
		artisan,
		comments: artisan.comments,
	});
});
router.get("/artisan/:id/avatar", async (req, res) => {
	try {
		const artisan = await Artisan.findById(req.params.id);
		if (!artisan || !artisan.avatar) {
			throw new Error();
		}
		res.set("Content-Type", "image/png");
		res.send(artisan.avatar);
	} catch (error) {
		res.status(400).send();
	}
});
router.post("/artisan/:id/comment", async (req, res) => {
	const comment = new Comment(req.body);
	try {
		comment.owner = req.params.id;
		await comment.save();
		res.send("Successful");
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = router;
