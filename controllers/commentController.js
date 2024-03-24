// createComment, getComments, deleteComment, editComment

const { User, Comment } = require("../models");

const getComments = async (req, res) => {
  try {
    const { movieId } = req.params;

    let comments = await Comment.find({ movie: movieId });

    comments.map(async (comment) => ({
      ...comment,
      user: await User.findById(comment.user).toObject(),
    }));

    return res.json({
      message: "Comments fetched successfully",
      data: {
        comments,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error fetching comments" });
  }
};

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
      message: "Comment created successfully",
      data: {
        comment: newComment.toObject(),
        user,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: "Error creating comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const user = req.user;

    // Check if the user is the owner of the comment
    const comment = await Comment.findById(commentId);

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.json({
      message: "Comment deleted successfully",
      data: {},
    });
  } catch (error) {
    return res.status(400).json({ error: "Error deleting comment" });
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId, comment } = req.body;
    const user = req.user;

    const myComment = await Comment.findById(commentId);

    if (myComment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Comment.findByIdAndUpdate(commentId, { text: comment });

    return res.json({
      message: "Comment edited successfully",
      data: {},
    });
  } catch (error) {
    return res.status(400).json({ error: "Error editing comment" });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  editComment,
};

