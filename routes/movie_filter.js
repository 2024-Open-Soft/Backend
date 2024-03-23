// import the express
const express=require("express");

// import the router
const router=express.Router();

// import the corresponding controller function
const {getAllMovies}=require("../controllers/movie_filter")

// Tell the router to use getAllMovies Function if api is /movie/filter/
router.route("/").get(getAllMovies);

// Enabling the export features and defining the to be exported attributes
module.exports=router;



