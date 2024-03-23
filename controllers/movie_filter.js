// import asynchHandler(perhaps i didn't used it)
const asyncHandler = require("express-async-handler");

// import prisma to connect with mongo-db
const prisma = require("../prisma/index");



// global variables to trace the total number of movies and pages to be there
var total_number_of_movies = 0;//by def 0
var total_number_of_pages = 0;//by def 0


// let's write a function which returns us the total number of the movies found

const total_No_Of_Movies = async (lang, genre) => {

    // define the prisma query
    const moviesQuery = {
        // add genre if genre is not undefined , and same for language(lang)
        where: {
            ...(genre && {
                genres: {
                    hasSome: [genre],
                }
            }),
            ...(lang && {
                languages: {
                    hasSome: [lang]
                }
            })
        },
    };

    // search in the database
    const movies = await prisma.embedded_movies.findMany(moviesQuery);

    // finally return the total number of the movies
    console.log("The total_global count of such movies is ", movies.length);
    return movies.length;
}

// let's create the getAllMovies function for the   router

const getAllMovies = async (req, res) => {
    try {
        // Extract query parameters from the request
        const { page, lang, genre } = req.query;

        // declare the page_size_variable
        const page_size = 10;


        // if page is 1 , call the function and fill the global values such as total_number of movies and pages
        if (page == 1) {

            // It is the first time, so call it and wait it until its finishes its execution
            total_number_of_movies = await total_No_Of_Movies(lang, genre);

            // get the toal number of pages
            let flag = Math.floor(total_number_of_movies / page_size);

            if (flag * page_size == total_number_of_movies) {
                total_number_of_pages = flag;
            }
            else {
                total_number_of_pages = flag + 1;
            }
        }

        // console.log("____________\n");
        // console.log(`Page Number : ${page}`);
        // console.log(`Language : ${lang}`);
        // console.log(`Genre : ${genre}`);

        // console.log("____________\n");

        const skip_val = (page - 1) * page_size;//get the skip_val


        // get the take_val and incorporate the case if it is last page or something greater than total number of pages
        const take_val = (page <= total_number_of_pages) ? (page == total_number_of_pages ? (total_number_of_movies - (page_size * (total_number_of_pages - 1))) : 10) : 0;

        // define the prisma query
        const moviesQuery = {
            skip: skip_val,//set the skip value
            take: take_val,//set the take value

            // if genre is not undefined add genre to where,same for lagnuage (lang)
            where: {
                ...(genre && {
                    genres: {
                        hasSome: [genre]
                    }
                }),
                ...(lang && {
                    languages: {
                        hasSome: [lang]
                    }
                })
            },
        };


        // Search and filter the database according to the movisQuery
        const movies = await prisma.embedded_movies.findMany(moviesQuery);

        // console.log("***************\n");
        // console.log(movies);
        // console.log("***************\n");


        // console.log(`Total number of such movies : ${totalMoviesCount}`);

        // Response object
        const response = {
            movies: movies,
            currentPage: page,
            totalPages: take_val,
            totalMovies: total_number_of_movies
        };

        // Send the response
        res.status(200).json(response);
    }
    catch (error) {
        // Handle errors
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Enable the export feature to get it imported in the router 
module.exports = { getAllMovies }