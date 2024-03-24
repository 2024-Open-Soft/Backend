// createComment, getComments, deleteComment, editComment

const { Comment } = require('../models');

const getComments = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = req.user;

        const comments = await Comment.find({ movie: movieId }).populate('user', 'name')

        return res.json({
            message: 'Comments fetched successfully',
            data: {
                comments,
                user,
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
                comment: newComment,
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
        const comment = await Comment.findById(comment);

        if(comment.userId !== user._id) {
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

        if(myComment.userId !== user._id) {
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