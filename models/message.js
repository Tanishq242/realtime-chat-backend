import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        senderName: {
            type: String,
            required: true,
            trim: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        },

        time: {
            type: Date,
            default: Date.now
        }
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;