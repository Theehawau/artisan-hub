const express = require("express");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const Artisan = require("../models/artisan");

//To get all artisans
router.get("/artisansList", async (req, res) => {
	try {
		const artisans = await Artisan.find({});
		res.status(200).send(artisans);
	} catch (error) {
		res.status(500).send("Unable to get Artists");
	}
});

//Filter By Category /artisans?category=painter
router.get("/artisans", async (req, res) => {
	try {
		if (req.query) {
			// const query = JSON.stringify(req.query);
			// const artisans = await Artisan.find(JSON.parse(query));
			req.query.subscribed = true;
			const artisans = await Artisan.find(
				req.query,
				"name lga category address"
			);
			res.send(artisans);
		}
	} catch (error) {
		res.status(500).send("Unable to get Artists" + error);
	}
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
module.exports = router;
