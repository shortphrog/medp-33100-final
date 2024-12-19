var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
    const db = req.app.locals.db;
   // const posts = await db.collection('posts')
     // .find()
     //.toArray();

    const posts = await db.collection('posts')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'authorID',
            as: 'authors'
          }
        }
      ])
      .toArray();

    console.log(posts);
   res.render('index', {title:'Blog', posts: posts});
  } catch (error) {
    console.log(error);
    }
});

module.exports = router;
