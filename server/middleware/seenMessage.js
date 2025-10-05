const mongoose = require("mongoose");
const {
  MessageModel,
  ConversationModel,
} = require("../models/conversationSchema");
const markMessageAsSeen = async (senderId, receiverId) => {
  const conversation = await ConversationModel.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  }).populate({
    path: "messages",
    match: { senderId: senderId },
    options: { sort: { updatedAt: -1 } },
  });
  if (!conversation) {
    console.log("no conversation");
    return;
  }
  console.log(conversation, "conver");
  const messages = conversation?.messages || [];
  const unSeenMessageIds = [];
  for (const msg of messages) {
    if (msg.seen) break;
    unSeenMessageIds.push(msg?._id);
  }

  if (unSeenMessageIds.length > 0) {
    const bulkOps = unSeenMessageIds.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { seen: true } },
      },
    }));
    await MessageModel.bulkWrite(bulkOps);
  }
  return {
    success: true,
    message: "Messages marked as seen",
  };
};

module.exports = { markMessageAsSeen };
