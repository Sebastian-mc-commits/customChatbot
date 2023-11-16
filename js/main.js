import Bot from "./bot.js";

const serverUrl = (view = "") => window.location.href + `${view}`
const userInput = document.querySelector("#getInput")

const bot = new Bot({
  // fetchUrl: "http://localhost:8000/chatBotConfig.php",
  fetchUrl: serverUrl("chatBotConfig.php"),
  listMessages: document.querySelector("#listMessages"),
  onChangeText: document.querySelector("#onChangeText"),
  userInput,
  onKeySubmit: "Enter",
  formInputWrapper: userInput.querySelector("#formInputWrapper"),
  botImageElement: `<img
    src="./assets/chat_bot.png"
  alt="Avatar"
/>`
})

bot.init()

const initialText = `
¡Hola! Soy ROBLEBOT, ¿En que puedo ayudarte?
`

const initialBotText = document.querySelector("#useTimeOut")

const initialPageElement = document.querySelector("#initialPage")
const policiesBotElement = document.querySelector("#policiesBotElement")

const initialPageClass = "hide-initial-page"
const hideLeft = "hide-left"
initialPageElement.querySelector("button").addEventListener("click", event => {
  event.target.parentElement.classList.toggle(initialPageClass)
  useTimeOutText(initialBotText, initialText, () => {
    policiesBotElement.classList.toggle(hideLeft)
  })
})


const useTimeOutText = (element, text, whenClear = () => null) => {
  let iterationsPass = 0
  text = text.trim()
  const textHandler = setInterval(() => {

    if (iterationsPass > text.length - 1) {
      whenClear(element)
      return clearTimeout(textHandler)
    }
    element.textContent += text[iterationsPass]
    iterationsPass++
  }, 70)
}