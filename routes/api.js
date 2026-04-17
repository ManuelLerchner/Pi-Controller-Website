const express = require("express");
const router = express.Router();

const Authentification = require("../ServerFunctions/HandleAuthentification.js");
const RelayGPIO = require("../ServerFunctions/HandleGPIO.js");
const HandleSession = require("../ServerFunctions/HandleSession.js");
const Email = require("../ServerFunctions/HandleEMail.js");

const Auth = new Authentification();
const Relay = new RelayGPIO();
const Sessions = new HandleSession();

router.post("/relay", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let [succ, msg] = await Sessions.checkIfTooManyRequests(ip);

    if (!succ) {
        res.status(400).send(msg);
        return;
    }

    try {
        username = req.body.username;
        password = req.body.password;
    } catch (err) {
        res.sendStatus(400);
    }

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    var [success, response] = await Auth.login({ username, password });

    if (success) {
        Relay.activateRelay(process.env.RELAY_ON_TIME);
        res.sendStatus(200);
        Email.sendMail("RaspberryPi Door-Service", `${username} just opened the Door!`, true);
    } else if (response != null) {
        res.sendStatus(401);
    } else {
        res.sendStatus(500);
    }
});

router.get("/relay", (req, res) => {
    res.send("Make a POST request to /api/relay");
});

module.exports = router;
