import Bot from "./bot.js";

const userInput = document.querySelector("#getInput")

const bot = new Bot({
  fetchUrl: "http://localhost:8000/chatBotConfig.php",
  // fetchUrl: "http://127.0.0.1:8081/chatBotConfig.php",
  listMessages: document.querySelector("#listMessages"),
  onChangeText: document.querySelector("#onChangeText"),
  userInput,
  onKeySubmit: "Enter",
  formInputWrapper: userInput.querySelector("#formInputWrapper"),
  botImageElement: `<img
    src="./assets/sena.png"
  alt="Avatar"
/>`
})

bot.init()