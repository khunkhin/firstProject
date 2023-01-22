var express = require("express");
var router = express.Router();
const staffController = require('../controllers/staffController');
const passport = require('../middleware/passportJWT')

/* GET staff listing. */
router.get("/", [ passport.isLogin ], staffController.index);

/* GET by id */
router.get("/:id", staffController.show);

/* POST staff listing. */
router.post("/", staffController.insert);

/* DELETE staff by id. */
router.delete("/:id", staffController.destroy);



module.exports = router;