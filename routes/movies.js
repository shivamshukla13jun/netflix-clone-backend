const router = require("express").Router();
const moviesController = require("../controllers/movies.controller");
const verify = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadFile");
var uploadMovie = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "Thumbnail", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.get("/cat", moviesController.Gegenrelist);
router
  .route("/:id")
  .get(moviesController.FindById)
  .put( uploadMovie, moviesController.Update)
  .delete( moviesController.Delete);
router
  .route("/")
  .post(verify, uploadMovie, moviesController.Add)
  .get(moviesController.GetRandomList);

module.exports = router;
