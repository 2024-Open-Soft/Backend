const { Comment } = require("../models");

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    // Check if the user is the owner of the comment
    const comment = await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ error: "Error deleting comment" });
  }
};

module.exports = {
  deleteComment,
};

