var express = require('express');
const {ObjectId} = require("mongodb");
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const db = req.app.locals.db;  // Access the shared database instance
    const users = await db.collection('users').find({}).toArray(); // Adjust collection name as needed
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
