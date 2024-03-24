// createComment, getComments, deleteComment, editComment

const { User, Comment } = require('../models');

const getComments = async (req, res) => {
    try {
        const { movieId } = req.params;

        console.log("movieId: ", movieId);

        // const comments = await Comment.find({ movie: movieId });

        // const updatedComments = comments.map(async (comment) => {
        //     const user = await User.findById(comment.user);
        //     return { ...comment.toObject(), user: user.name };
        // });

        const comments = await Comment.find({ movie: movieId });

        const updatedComments = [];
        for (let i = 0; i < comments.length; i++) {
            const user = await User.findById(comments[i].user);
            updatedComments.push({ ...comments[i].toObject(), user: user.name });
        }

        return res.json({
            message: 'Comments fetched successfully',
            data: {
                updatedComments,
            }
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error fetching comments' });
    }
}

const createComment = async (req, res) => {
    try {
        const { movieId, comment } = req.body;
        const user = req.user;

        const newComment = new Comment({
            date: new Date(),
            user: user._id,
            movie: movieId,
            text: comment,
        });

        await newComment.save();

        return res.json({
            message: 'Comment created successfully',
            data: {
                comment: newComment.toObject(),
                user,
            }
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error creating comment' });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const user = req.user;

        // Check if the user is the owner of the comment
        const comment = await Comment.findById(commentId);

        if(comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.json({
            message: 'Comment deleted successfully',
            data: {}
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error deleting comment' });
    }
}

const editComment = async (req, res) => {
    try {
        const { commentId, comment } = req.body;
        const user = req.user;

        const myComment = await Comment.findById(commentId);

        console.log("myComment.user: ", myComment.user);
        console.log("user._id: ", user._id);

        if(myComment.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Comment.findByIdAndUpdate(commentId, { text: comment });

        return res.json({
            message: 'Comment edited successfully',
            data: {}
        });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error editing comment' });
    }
}

module.exports = {
    getComments,
    createComment,
    deleteComment,
    editComment,
};