var express = require('express');
var router = express.Router();
router.get('/', async function (req, res, next) {
  try {
    const db = req.app.locals.db; // Access the database from app.locals
    const posts = await db.collection('posts')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'authorID',
            as: 'authors',
          },
        },
      ])
      .toArray();

    console.log(posts);
    res.render('index', { title: 'Blog', posts });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error handler
  }
});

module.exports = router;