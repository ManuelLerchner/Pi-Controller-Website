// --- Relay ---
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

// --- Register ---
var Register_Form = document.getElementById("register_contact");
var Register_Name = document.getElementById("name_register");
var Register_Email = document.getElementById("email_register");
var Register_Password1 = document.getElementById("password_register1");
var Register_Password2 = document.getElementById("password_register2");
var Register_ResponseMobile = document.getElementById("registerResponse_mobile");
var Register_ResponsePC = document.getElementById("registerResponse_pc");

Register_Form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    Register_Name.value &&
    Register_Email.value &&
    Register_Password1.value &&
    Register_Password2.value
  ) {
    socket.emit("register form", {
      username: Register_Name.value,
      email: Register_Email.value,
      password1: Register_Password1.value,
      password2: Register_Password2.value,
    });
    Register_Name.value = "";
    Register_Email.value = "";
    Register_Password1.value = "";
    Register_Password2.value = "";
    document.querySelector("label[for=" + Register_Name.id + "]").classList.remove("active");
    document.querySelector("label[for=" + Register_Email.id + "]").classList.remove("active");
    document.querySelector("label[for=" + Register_Password1.id + "]").classList.remove("active");
    document.querySelector("label[for=" + Register_Password2.id + "]").classList.remove("active");
    Register_Name.classList.remove("valid");
    Register_Email.classList.remove("valid");
    Register_Password1.classList.remove("valid");
    Register_Password2.classList.remove("valid");
  }
});

socket.on("registration-event-response", (response) => {
  Register_ResponsePC.innerHTML = response;
  Register_ResponsePC.classList.remove("hidden");
  Register_ResponseMobile.innerHTML = response;
  Register_ResponseMobile.classList.remove("hidden");
});
