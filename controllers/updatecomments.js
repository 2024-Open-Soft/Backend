const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const updatedComment = await prisma.user.comment.update({
      where: {
        id: commentId,
      },
      data: {   
        comment,
      },
    });

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateComment,
};
