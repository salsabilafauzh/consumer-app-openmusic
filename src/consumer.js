require("dotenv").config();
const ampq = require("amqplib");
const MailSender = require("./MailSender");
const Listener = require("./listener");
const PlaylistService = require("./playlistService");

const init = async () => {
    const playlistService = new PlaylistService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistService, mailSender);

    const connection = await ampq.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue("exports:playlist", {
        durable: true,
    });

    await channel.consume("exports:playlist", listener.listen, {
        noAck: true,
    });
};

init();
