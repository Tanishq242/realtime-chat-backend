import Message from "./models/message.js";

const setupSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("sendMessage", async (data) => {

            try {

                console.log("Message received:");
                console.log(data);

                const {
                    senderName,
                    message
                } = data;

                if (!senderName || !message) {

                    console.log("Invalid message data");

                    return;
                }

                const newMessage = await Message.create({

                    message: {

                        senderName: senderName,

                        text: message

                    }

                });

                console.log("Message saved:");
                console.log(newMessage);

                io.emit("receiveMessage", {

                    id: newMessage._id,

                    senderName:
                        newMessage.message.senderName,

                    message:
                        newMessage.message.text,

                    time:
                        newMessage.message.time

                });

            } catch (error) {

                console.error(
                    "Error saving message:",
                    error
                );

            }

        });

        socket.on("disconnect", (reason) => {

            console.log(
                `User disconnected: ${socket.id}`
            );

            console.log(
                `Reason: ${reason}`
            );

        });

    });

};

export default setupSocket;