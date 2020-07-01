import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import randomstring from 'randomstring';
import Promise from 'bluebird';

import CONFIG from '../../conf';
import logger from '../../lib/logger';
import { BadRequestError } from '../../lib/errors';
import { Images } from '../../models';

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, CONFIG.SHARED_PATHS.UPLOAD);
	},
	filename(req, file, cb) {
		cb(null, randomstring.generate(20) + path.extname(file.originalname));
	},
});

export const upload = multer({ storage }).single('image');

export const resize = async (req, res, next) => {
	let reqFile = req.file,
		reqFilePath = reqFile && reqFile.path,
		{ MAX_IMAGE_SIZE } = CONFIG.APP;

	try {
		if (reqFilePath) {
			const tmpFilePath = `${reqFile.destination}/tmp-${reqFile.filename}`;

			fs.copyFileSync(reqFilePath, tmpFilePath);

			await sharp(tmpFilePath)
				.rotate()
				.resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE, { fit: 'inside', withoutEnlargement: true })
				.toFile(reqFilePath);

			fs.unlinkSync(tmpFilePath);
		}

		next();
	} catch (err) {
		res.error(err);
	}
};

const readImage = name => {
	const data = fs.readFileSync(`${CONFIG.SHARED_PATHS.UPLOAD}/${name}`);
	return new Buffer.from(data).toString('base64');
};

const create = async (req, res) => {
	let reqFile = req.file,
		reqFilePath = reqFile && reqFile.path;

	if (reqFilePath) {
		logger.info('Photo finished uploading.', 'file:', reqFilePath);
		const count = await Images.countDocuments({});
		const image = await new Images({
			path: reqFile.filename,
			name: reqFile.originalname,
			type: reqFile.mimetype,
			order: count,
		}).save();
		const result = readImage(reqFile.filename);
		res.json({ base64: result, type: image.type, name: image.name, id: image._id });
	} else {
		logger.error('Unable to receive the uploaded photo from client:');
		res.error(new BadRequestError());
	}
};

/**
 * Get all images
 */
const downloadImage = async (req, res) => {
	try {
		const images = await Images.find().sort('order');
		const result = images.map(img => {
			const base64 = readImage(img.path);
			return { base64, type: img.type, name: img.name, id: img._id };
		});
		res.json(result);
	} catch (error) {
		res.error(error);
	}
};

/**
 * Reorder Image
 * @param {Number} req.body.from
 * @param {Number} req.body.to
 */
const reorderImage = async (req, res) => {
	try {
		const { from, to } = req.body;
		const image = await Images.findOne({ order: Number(from) });
		if (from > to) {
			const images = await Images.find({ order: { $gte: to, $lt: from } });
			await Promise.map(images, async img => {
				img.order += 1;
				await img.save();
			});
		} else if (from < to) {
			const images = await Images.find({ order: { $gt: from, $lte: to } });
			await Promise.map(images, async img => {
				img.order -= 1;
				await img.save();
			});
		}
		image.order = to;
		await image.save();

		const images = await Images.find().sort('order');
		const result = images.map(img => {
			const base64 = readImage(img.path);
			return { base64, type: img.type, name: img.name, id: img._id };
		});
		res.json(result);
	} catch (error) {
		res.error(error);
	}
};

/**
 * Remove image
 * @param {ObjectID} req.params.id
 */
const removeImage = async (req, res) => {
	try {
		const file = await Images.findById(req.params.id);
		fs.unlinkSync(`${CONFIG.SHARED_PATHS.UPLOAD}/${file.path}`);
		const images = await Images.find({ order: { $gt: file.order } });
		await Promise.map(images, async img => {
			img.order -= 1;
			await img.save();
		});
		await Images.findByIdAndRemove(req.params.id);
		res.json('Removed file');
	} catch (error) {
		res.error(error);
	}
};

export default express
	.Router()
	.get('/', downloadImage)
	.post('/upload', upload, resize, create)
	.post('/reorder', reorderImage)
	.delete('/:id', removeImage);
