var Relay_Form = document.getElementById("form_relay");
var Relay_Firstname = document.getElementById("first_name_relay");
var Relay_Password = document.getElementById("password_relay");

var Relay_StateMobile = document.getElementById("relayState_mobile");
var Relay_StatePC = document.getElementById("relayState_pc");

var Relay_ResponseMobile = document.getElementById("relayResponse_mobile");
var Relay_ResponsePC = document.getElementById("relayResponse_pc");

Relay_Form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (Relay_Firstname.value && Relay_Password.value) {
        socket.emit("relay authentification", {
            username: Relay_Firstname.value,
            password: Relay_Password.value,
        });

        Relay_Firstname.value = "";
        Relay_Password.value = "";
        document.querySelector("label[for=" + Relay_Firstname.id + "]").classList.remove("active");
        document.querySelector("label[for=" + Relay_Password.id + "]").classList.remove("active");
        Relay_Firstname.classList.remove("valid");
        Relay_Password.classList.remove("valid");
    }
});

socket.on("relay_state-update", (relayOn) => {
    const state = relayOn
        ? "<span style='color:green'>Current State: ON</span>"
        : "<span style='color:red'>Current State: OFF</span>";
    Relay_StateMobile.innerHTML = state;
    Relay_StatePC.innerHTML = state;
});

socket.on("relay-event-response", (message) => {
    Relay_ResponsePC.innerHTML = message;
    Relay_ResponsePC.classList.remove("hidden");
    Relay_ResponseMobile.innerHTML = message;
    Relay_ResponseMobile.classList.remove("hidden");
});
