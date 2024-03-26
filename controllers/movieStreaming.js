const { Movie } = require("../models");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const movieStreaming = async(req,res) => {
    try{
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        console.log('IP:', ip)
        const movieId = req.params.movieId;
        const user = req.user;
        const movie = await Movie.findById(movieId);
        if(!movie){
            return res.status(404).json({ message: "Movie not found" });
        }
        if(!movie.url){
            return res.status(404).json({ message: "Movie not available" });
        }
        if(user){
            user.history = user.history.filter((movie) => movie.toString() !== movieId);
            user.history.push(movieId);
            await user.save();
        }
        // Schema se sort kardena
        const activeSubscription = user.subscriptions.find(
            (subscription) => subscription.status === "ACTIVE"
        );
        const maxResolutionFeature = activeSubscription.features.find(
            (feature) => feature.name === "MAX_RESOLUTION"
        ) || null;

        const maxResolution = maxResolutionFeature.value || "360p"
        // Expiration Date 5h from now
        const expirationTime = Date.now() + 10*1000
        const signed_url = cloudinary.url(movie.url, {
            resource_type: "video",
            sign_url: true,
            secure: true,
            streaming_profile: `auto:maxres_${maxResolution}`,
            auth_token: {
                key: process.env.CLOUDINARY_API_KEY,
                ip: ip,
                expiration: expirationTime,
            },
        });

        return res.status(200).json({
            message: "Movie streaming started",
            data: {
                url: signed_url,
            },
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    movieStreaming
}