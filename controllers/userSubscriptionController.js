const User = require('../models/user');

const { parseToken } = require('../utils/token');

exports.userSubscription = async (req, res, next) => {
    const { userId } = parseToken(req);

    try {
        const user = await User.findById(userId).populate({
            path: 'subscriptions',
            populate: {
                path: 'plan',
                populate: {
                    path: 'features'
                }
            }
        }).exec();

        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error" });
    }


}