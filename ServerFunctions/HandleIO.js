const dotenv = require("dotenv");

const GPIO = require("./HandleGPIO.js");
const Authentification = require("./HandleAuthentification.js");
const SessionService = require("./HandleSession.js");
const Email = require("./HandleEMail.js");

dotenv.config({ path: "./config/config.env" });

const Relay = new GPIO();
const Auth = new Authentification();
const Session = new SessionService();

setTimeout(() => { Session.deleteOldRequest(); }, 10 * 1000);
setInterval(() => { Session.deleteOldRequest(); }, 24 * 60 * 60 * 1000);

var relayState = false;

class HandleIO {
    constructor(io) {
        this.io = io;
    }

    getIp(socket) {
        let clientIp;
        try {
            clientIp = socket.request.headers["x-forwarded-for"];
        } catch {}
        return clientIp ?? socket.request.connection._peername.address;
    }

    handleEvents() {
        this.io.on("connection", (socket) => {
            console.log("New Connection from: " + this.getIp(socket));

            socket.on("relay authentification", async (data) => {
                let [success, msg] = await Session.checkIfTooManyRequests(this.getIp(socket));
                if (!success) {
                    socket.emit("relay-event-response", `<span style='color:red'>${msg}</span>`);
                    return;
                }
                const [ok, response] = await Auth.login(data);
                socket.emit("relay-event-response", `<span style='color:${ok ? "green" : "red"}'>${response}</span>`);
                if (ok) {
                    this.activateRelay(process.env.RELAY_ON_TIME);
                    Email.sendMail("RaspberryPi Door-Service", `${data.username} just opened Door!`, true);
                }
            });

            socket.on("register form", (data) => {
                Auth.register(data).then(([ok, response]) => {
                    socket.emit("registration-event-response", `<span style='color:${ok ? "green" : "red"}'>${response}</span>`);
                });
            });

            this.io.emit("relay_state-update", relayState);
        });
    }

    activateRelay(time) {
        relayState = true;
        Relay.on();
        this.io.emit("relay_state-update", relayState);
        setTimeout(() => {
            relayState = false;
            Relay.off();
            this.io.emit("relay_state-update", relayState);
        }, time);
    }
}

module.exports = HandleIO;
