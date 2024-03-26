const { Movie } = require("../models");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const videoUpload = async (req,res) => {
    // Logic for Updating the database
    const Movie = new Movie({
        name: req.body.name,
        description: req.body.description,
    });
    cloudinary.uploader.upload_stream({ 
        resource_type: 'video',
        eager: { 
            streaming_profile: "full_hd",
            format: "m3u8",
        },
        eager_async: true,
    }, (error, result) => {
        if(error) {
            console.log('Error:', error);
        } else {
            console.log('Result:', result);
            // Now use the url to save in the database
            Movie.url = result.url;
            res.status(200).json({
                message: "Video uploaded successfully",
                data: result,
            });
        }
    }).end(req.file.buffer);
}

module.exports = {
    videoUpload,
}
