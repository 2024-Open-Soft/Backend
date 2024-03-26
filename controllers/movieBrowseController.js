const Movie = require("../models/movie");

exports.movieLatest = async (req, res, next) => {
    const page = req.params.page;
    const perPage = 50;

    if (page < 1) return res.status(400).json({ message: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({ released: { $lte: new Date() } }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (page > totalPage) return res.status(400).json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $lte: new Date() } })
            .sort({ released: -1 })
            .skip(skip)
            .limit(perPage)
            // .select("title released");
        return res.status(200).json(movies);
    }
    catch (error) {
        return res.status(500).json({ message: "Interval server error" });
    }
}

exports.movieUpcoming = async (req, res, next) => {
    const page = req.params.page;
    const perPage = 50;

    if (page < 1) return res.status(400).json({ message: "Invalid page requested", data: {} });

    const skip = (page - 1) * perPage;

    try {
        const totalResults = await Movie.find({ released: { $gt: new Date() } }).countDocuments();
        const totalPage = Math.floor((totalResults + perPage - 1) / perPage);

        if (page > totalPage) return res.status(400).json({ message: "Invalid page requested", data: {} });

        const movies = await Movie.find({ released: { $gt: new Date() } })
            .sort({ released: 1 })
            .skip(skip)
            .limit(perPage)
        // .select("title released");

        return res.status(200).json(movies);
    }
    catch (error) {
        return res.status(500).json({ message: "Interval server error" });
    }
}
