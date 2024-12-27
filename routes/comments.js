var express = require('express');
const {ObjectId, Timestamp} = require("mongodb");
var router = express.Router();

// POST a new comment
router.post('/', async function (req, res, next) {
    try {
        const db = req.app.locals.db;  // Access the shared database instance
        const comment = req.body;

        const newComment = {
            content: comment.content,
            postID: new ObjectId(comment.postID),
            authorID: new ObjectId(comment.authorID),
            createdAt: new Timestamp({ t: Math.floor(Date.now() / 1000), i: 0 }),
        };

        await db.collection('comments').insertOne(newComment);
        res.send('Created new post');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
