const { ConversationModel } = require("../models/conversationSchema");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const getConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");
    const conversation = getConversation.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
        const senderId = curr?.senderId.toString();
        if (senderId !== currentUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv?.messages[conv?.messages?.length - 1],
      };
    });
    return conversation;
  } else {
    return [];
  }
};
module.exports = { getConversation };
