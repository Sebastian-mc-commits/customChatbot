import Global from "./Global.js"
import reducer from "./botReducerFunctions.js"

export default class Bot extends Global {

    #userInput
    #fetchUrl
    #onKeySubmit
    #reducer
    #botImageElement

    constructor({
        userInput,
        listMessages,
        onChangeText,
        fetchUrl,
        formInputWrapper,
        botImageElement,
        onKeySubmit = "Enter"
    }) {
        super()
        this.#userInput = userInput
        this._listMessages = listMessages
        this._onChangeText = onChangeText
        this.#fetchUrl = fetchUrl
        this.#onKeySubmit = onKeySubmit
        this._chatBotTypeSelected = ""
        this._isOnSelectedTypePressed = false
        this._store = [{
            name: null,
            body: {}
        }]
        this._globalChat = {
            chatBot: [],
            user: []
        }
        this.#botImageElement = botImageElement
        this.#reducer = reducer.bind(this)
        this._formInputWrapper = formInputWrapper
    }

    #onSubmit = (event) => {
        event?.preventDefault()
        const formData = new FormData(this.#userInput);
        const data = Object.fromEntries(formData);

        this.#execReducer(event, this._onChangeText.name, this._onChangeText.value)
    }

    #execReducer = (event, caller, ...params) => {
        const callback = this.#reducer(event.target, event)[caller];

        if (typeof callback !== "function") return;

        callback.apply(this, params);
    }

    _getMessageElementHTML = () => ({
        user: (value) => `<p class='userMessage'>${value}</p>`,
        normalBotResponse: (value) => `<p class="botMessage">${this.#botImageElement}${value}</p>`,
        reloadBotResponse: (value, onReload = "") => this._getMessageElementHTML().normalBotResponse(`
        ${value} <span class='reload' data-type='refreshBotAnswer' data-reload-type=${onReload}>&#8634;</span>
        `),
        botInputTypeResponse: (labelValue, id = Date.now(), type = "radio") => `
            <label for='${id.toString()}' data-type='botInputTypeResponse'>
                <input type='${type}' name='botInputTypeResponse' id='${id.toString()}'/>
                <span>${labelValue}</span>
            </label>
        `,
        onSelectedStyle: (HTML) => `<div class='onSelectStyle' id='onSelectedType'>${HTML}</div>`,
        buttonMessage: (id, title, dataType = "onSelectedType") => `
        <button data-id=${id} data-type='${dataType}'>
            ${title}
        </button>
        `,
        defaultStartedMessage: () => `
        <p class="botMessage">
            ¡Hola! Soy SenaBot 👋🏼, el contacto digital de MADERABLE, estoy acá para
            hacerte la vida más fácil. Puedo brindarte información y ayudarte
            con varios trámites. Para PQRSF ingresa al portal dando clic
            <a href="#">Aqui</a>
        </p>
        <p class="botMessage">
            Para continuar, revisa nuestra política de privacidad, si deseas
            conocerlos da clic <button>Aqui</button>
        </p>
        `
    })

    _insertBotMessage = (value) => this._listMessages.insertAdjacentHTML("beforeend", value);

    _getElements = () => ({
        onSelectedType: () => document.querySelector("#onSelectedType"),
        lastInsertedMessage: () => this._listMessages.lastElementChild,
        formInputsWrapper: () => {
            const inputs = this._formInputWrapper.querySelectorAll("input, button")

            return {
                cleanButton: () => Array.from(inputs).find(input => input.dataset.type === "onClean")
            }
        }
    })

    _apis = () => {
        const source = (query) => this.#fetchUrl + query

        return {
            requestType: (value) => this._useFetch(source(`?requestType=${value}`), true),
            getChatBotAnswer: async ({
                chatBotType,
                userQuestion,
                ...params
            }) => {
                const url = source(`?requestType=getChatBotAnswer&chatBotType=${chatBotType}&userQuestion=${userQuestion}`)
                const json = {
                    chatBotType,
                    userQuestion,
                    ...params
                }

                return this._useFetch(url, true, {
                    method: "POST",
                    header: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(json)
                })
            },
            getChatBotAnswerByTypeId: async (id) => {
                const url = source(`?requestType=getChatBotAnswerById&id='${id}'`)
                return this._useFetch(url, true)
            }

        }
    }

    _randomBotMessages = () => {
        const messages = [
            "No entendi tu pregunta",
            "¿Puedes intentar otra pregunta?",
            "¿Fue eso un saludo?", "mmmmmm",
            "._.",
            "¿Que quieres decir?",
            "No te entiendo :("
        ]

        const notFoundMessage = [
            "No tengo mas respuestas que darte",
            "¿Puedes cambiar tu pregunta?",
            "Tu pregunta fue el problema, no yo",
            "Tu pregunta es complicada"
        ]

        return {
            messages: this._getRandomElement(...messages),
            notFoundMessage: this._getRandomElement(...notFoundMessage)
        }
    }

    _storeChat = (type, ...messages) => {
        const existMessage = this._globalChat[type].some(message => messages.some(providedMessage => providedMessage === message))

        if (existMessage) return

        this._globalChat[type] = [...this._globalChat[type], ...messages]
    }

    _getLastMessagesBetween = () => {

        const {
            chatBot,
            user
        } = this._globalChat
        return {
            user: user[user.length - 1],
            chatBot: chatBot[chatBot.length - 1]
        }
    }

    _contentLoaded = async () => {
        const type = "getChatBotTypes";
        const {
            requestType
        } = this._apis()

        const {
            buttonMessage,
            onSelectedStyle
        } = this._getMessageElementHTML()
        const {
            error,
            request,
            response
        } = await requestType(type);

        console.log(response)
        if (!request?.ok || error) return;

        const {
            response: chatBotResponse
        } = response;

        let HTML = "";
        for (const {
            title,
            id
        } of chatBotResponse) {
            HTML += buttonMessage(id, title)
        }

        HTML = onSelectedStyle(`
            <p>Elige el motivo por el cual has recurrido al chatbot</p>
            ${HTML}
        `)

        const index = this._store.findIndex(({
            name
        }) => name === "contentLoadedBotResponse")

        if (index === -1) {
            this._store.push({
                name: "contentLoadedBotResponse",
                body: chatBotResponse
            })
        }

        this._listMessages.insertAdjacentHTML("beforeend", HTML);
    }

    init = () => {
        document.addEventListener("DOMContentLoaded", this._contentLoaded);

        this.#userInput.addEventListener("submit", this.#onSubmit)
        this.#userInput.addEventListener("keypress", (e) => e.key === this.#onKeySubmit && this.#onSubmit(e))
        this.#userInput.addEventListener("click", (event) => {
            event.stopPropagation();
            const onClickType = this._getRequiredElement(event.target, "[data-type]")

            this.#execReducer(event, onClickType.dataset.type || null)
        })
    }
}