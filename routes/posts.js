const express = require('express');
const {ObjectId, Timestamp} = require("mongodb");
const router = express.Router();
const multer = require('multer');
const uploadToCloudinary = require('../config/uploadToCloudinary');

// GET all posts
router.get('/', async function (req, res, next) {
    const searchParams = req.query;
    console.log(searchParams);
    try {
        const db = req.app.locals.db;  // Access the shared database instance
        const posts = await db.collection('posts')
            .aggregate([
                {
                    $match: {
                        $or: [
                            { title: { $regex: searchParams.q, $options: 'i' } }, // Case-insensitive match in title
                            { content: { $regex: searchParams.q, $options: 'i' } } // Case-insensitive match in content
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',                // The collection to join
                        localField: 'authorID',       // Field from `posts`
                        foreignField: '_id',          // Field from `users`
                        as: 'authors'              // Output array containing matched users
                    }
                },
                {
                    $lookup: {
                        from: 'comments',             // Join with the `comments` collection
                        localField: '_id',            // Field from `posts` (post ID)
                        foreignField: 'postID',       // Field from `comments` (reference to post ID)
                        as: 'comments'                // Output array containing matched comments
                    }
                },
            ])
            .sort({createdAt: -1}) // Sort descending by `createdAt`
            .toArray();
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

// POST a new post
router.post('/', multer().single('image'), uploadToCloudinary, async function (req, res) {
    console.log(req.body);
    try {
        const db = req.app.locals.db;
        const newPost = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.file.cloudinaryUrl,
            authorID: new ObjectId(req.body.authorID),
            createdAt: new Timestamp({ t: Math.floor(Date.now() / 1000), i: 0 }),
        }
        await db.collection('posts')
            .insertOne(newPost)
        res.send('Successfully created post');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
