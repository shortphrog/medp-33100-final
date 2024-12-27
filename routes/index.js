var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    try {
        const db = req.app.locals.db;
        const posts = await db.collection('posts')
            .aggregate([
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
        res.render('index', {title: 'Posts', posts});
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router;

