const express = require("express");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const Admin = require("../models/admin");
const Artisan = require("../models/artisan");

router.get("/", async (req, res) => {
	res.render("admin/index");
});
// Create Admin
router.post("/create", async (req, res) => {
	try {
		const admin = new Admin(req.body);
		await admin.save();
		res.status(201).send(admin);
	} catch (error) {
		res.status(400).send(error);
	}
});
// Login Admin
router.post("/admin/login", async (req, res) => {
	try {
		const admin = await Admin.findByCredentials(
			req.body.email,
			req.body.password
		);
		const artisans = await Artisan.find();
		res.status(200).send({ admin, artisans });
	} catch (error) {
		res.status(400).send("Unable to Login" + error);
	}
});
//update artisans
router.patch("/admin/:id/update", async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		"name",
		"address",
		"phoneNumber",
		"subscribed",
		"lga",
	];
	const isUpdateValid = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isUpdateValid) {
		return res.status(400).send({
			error: "Invalid update!",
		});
	}
	try {
		const artisan = await Artisan.findById(req.params.id);
		updates.forEach(
			(updateField) => (artisan[updateField] = req.body[updateField])
		);
		await artisan.save();
		res.send(artisan);
	} catch (error) {
		res.status(500).send(error);
	}
});
// add avatar
const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			cb(new Error("Please upload a picture"));
		}
		cb(undefined, true);
	},
});
//Creating new artisans
router.post(
	"/artisan/new",
	upload.single("avatar"),
	async (req, res) => {
		try {
			const artisan = new Artisan(req.body);
			if (req.file.buffer) {
				const buffer = await sharp(req.file.buffer)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				artisan.avatar = buffer;
			}
			await artisan.save();
			res.status(200).send(`${artisan.category} ${artisan.name} added to List`);
		} catch (error) {
			res.status(400).send(error);
		}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
router.post("/artisan/new/noavatar", async (req, res) => {
	try {
		const artisan = new Artisan(req.body);
		await artisan.save();
		// res.status(200).send(`${artisan.category} ${artisan.name} added to List`);
		res.redirect("/admin");
	} catch (error) {
		res.status(400).send("Unable to save");
	}
});
router.post(
	"/:id/addavatar",
	upload.single("avatar"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		const artisan = await Artisan.findById(req.params.id);
		artisan.avatar = buffer;
		await artisan.save();
		res.status(200).send("Avatar added");
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
// delete avatar
router.delete("/admin/:id/deleteavatar", async (req, res) => {
	try {
		const artisan = await Artisan.findById(req.params.id);
		artisan.avatar = undefined;
		await artisan.save();
		res.status(200).send("Avatar Deleted");
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});
module.exports = router;
