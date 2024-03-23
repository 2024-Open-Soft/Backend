const express = require('express');
const prisma = require("../prisma/index");
const mongoose = require('mongoose');

const getComments = async (req,res) => {
    
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({message: "Invalid movie id"});
    }

    const movie = await prisma.embedded_movies.findFirst({
        where: {
            id: req.params.id,
        },
    })

    if(!movie){
        return res.status(404).json({message: "Movie does not exist"});
    }

    const comments = await prisma.comment.findMany({
        where: {
            movieId: req.params.id,
        },
    });
    
    res.status(200).json({message: "Comments fetched",data: comments});
}

module.exports = getComments;