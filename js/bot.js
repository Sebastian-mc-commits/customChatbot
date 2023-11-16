import Global from "./Global.js"
import reducer from "./botReducerFunctions.js"

export default class Bot extends Global {

    #userInput
    #fetchUrl
    #onKeySubmit
    #reducer
    #botImageElement
    _isPoliciesAccepted = true

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
        this._TYPES = {
            BY_TYPES: "byTypes",
            BY_MAIN_TREE: "byMainTree",
            TYPES: "types",
            TREE_QUESTION: "treeQuestion",
            USER_INPUT_REQUIRED: "userInputRequired",
            ASSOCIATED_METHODS: {
                HANDLE_USER_QUESTION: "handleUserQuestion",
                ON_HANDLE_DISPLAY_OPTIONS: "onHandleDisplayOptions"
            },
            RESPONSE: "response",
            HTML_FIELD: "isHtml"
        }
        this._listMessages = listMessages
        this._onChangeText = onChangeText
        this.#fetchUrl = fetchUrl
        this.#onKeySubmit = onKeySubmit
        this._chatBotTypeSelected = {
            types: {
                value: null,
                priority: 10,
                name: "byTypes",
                redirect: false,
                methodName: ""
            },

            treeQuestion: {
                value: null,
                priority: 0,
                name: "byMainTree",
                redirect: false,
                methodName: ""
            },

            userInputRequired: {
                value: null,
                priority: 0,
                name: "userInputRequired",
                redirect: true,
                methodName: "handleStoreUserInput"
            }
        }
        this._isOnSelectedTypePressed = false
        this.countMessageIteration = 0
        this.CLASSES = {
            botMessageW100Class: "botMessage-w-100",
            opacityHide: "hide-left"
        }
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

    _getHighestPriorityTypeValue = () => {
        let finalValue = this._chatBotTypeSelected.types
        const { priority: mainPriority } = this._chatBotTypeSelected.types

        for (const key in this._chatBotTypeSelected) {
            if (this._chatBotTypeSelected[key].priority > mainPriority) {
                finalValue = this._chatBotTypeSelected[key]
            }
        }

        return finalValue
    }

    _getAssociatedMethodByType = (name) => {
        let value = ""
        const {
            treeQuestion: { name: t_name },
            types: { name: ty_name }
        } = this._chatBotTypeSelected

        const {
            HANDLE_USER_QUESTION,
            ON_HANDLE_DISPLAY_OPTIONS
        } = this._TYPES.ASSOCIATED_METHODS

        switch (name) {
            case t_name: {
                value = HANDLE_USER_QUESTION
                break
            }
            case ty_name: {
                value = ON_HANDLE_DISPLAY_OPTIONS
                break
            }
        }

        return value
    }

    _isPriorityOfTypesSatisfied = () => {
        const { value } = this._getHighestPriorityTypeValue()
        return !!value
    }

    _resetPriorities = () => {
        for (const key in this._chatBotTypeSelected) {
            this._chatBotTypeSelected[key].priority = 0
        }
    }

    #onSubmit = (event) => {
        event?.preventDefault()
        const formData = new FormData(this.#userInput);

        this.#execReducer(event, this._onChangeText.name, this._onChangeText.value)
    }

    #execReducer = (event, caller, ...params) => {
        const callback = this.#reducer(event.target, event)[caller];

        if (typeof callback !== "function") return;

        callback.apply(this, params);
    }

    _getMessageElementHTML = () => ({
        user: (value) => `<p class='userMessage'>${value}</p>`,
        normalBotResponse: (value, subclass = "", attr = "") => `<p class="botMessage ${subclass}" ${attr}>${this.#botImageElement}${value}</p>`,
        reloadBotResponse: (value, onReload, subclass = "", attr = "") => this._getMessageElementHTML().normalBotResponse(`
        ${value} <span class='reload' data-type='refreshBotAnswer' data-reload-type=${onReload}>&#8634;</span>
        `, subclass, attr),
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
        ${this.#botImageElement}
            ¡Hola! Soy ROBLEBOOT, 
            el contacto digital de ROBLES S.A.S, estoy acá para 
            brindarte información y ayudarte con varios trámites 
            como PQR, ingresa dando 
            <span class="ancor" data-type="termsAndConditionsHandler">Click Aquí</span>
          </p>
          <p class="botMessage">
          ${this.#botImageElement}
            Para continuar, revisa nuestras políticas de privacidad, si deseas conocerlas da 
            <span class="ancor" data-type="termsAndConditionsHandler">Click.</span>
          </p>
        `,

        responseWithHelper: ({ value, helperValue, isNormal = true, onReload }) => {
            const dataText = `data-text='${helperValue}'`
            const { normalBotResponse, reloadBotResponse } = this._getMessageElementHTML()
            return isNormal ? normalBotResponse(value, "upperMessage", dataText) : reloadBotResponse(
                value,
                onReload,
                "upperMessage",
                dataText
            )
        }
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

                return await this._useFetch(url, true, {
                    method: "POST",
                    header: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(json)
                })
            },
            getChatBotAnswerByTypeId: async (id) => {
                const url = source(`?requestType=getChatBotAnswerByTypeId&id=${id}`)
                return await this._useFetch(url, true)
            },

            getAnswersByMainTree: async (id) => {
                const url = source(`?requestType=getAnswersByMainTree&id=${id}`)
                return await this._useFetch(url, true)
            },

            getResponseById: async (id) => {
                const url = source(`?requestType=getResponseById&id=${id}`)

                return await this._useFetch(url, true)
            },

            getResponseTitleById: async (id) => {
                const url = source(`?requestType=getResponseTitleById&id=${id}`)

                return await this._useFetch(url, true)
            },

            insertUserInputById: async ({
                responseId,
                userInput
            }) => {

                const json = JSON.stringify({
                    responseId,
                    userInput
                })
                const url = source(`?requestType=insertUserInputById`)
                return await this._useFetch(url, true, {
                    method: "POST",
                    header: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(json)
                })
            }

        }
    }

    _randomBotMessages = () => {
        const messages = [
            "Lo siento, no estoy seguro de entender tu pregunta. ¿Podrías reformularla de otra manera?",
            "Parece que tu pregunta es un poco confusa para mí. ¿Podrías intentar explicarlo de otra manera?",
            "Me temo que no entiendo lo que quieres decir. ¿Podrías proporcionar más detalles o reformular tu pregunta?",
            "¡Vaya! Parece que estoy un poco confundido. ¿Podrías darme más información o reformular tu pregunta?",
            "Parece que hemos tenido un pequeño malentendido. ¿Podrías expresar tu pregunta de otra manera?",
            "No puedo procesar esa entrada. ¿Podrías intentar reformular tu pregunta?",
            "Lo siento, parece que no comprendo lo que estás tratando de decir. ¿Podrías explicarlo de una manera diferente?"
        ];

        const notFoundMessage = [
            "Estoy intentando entenderte, pero parece que necesito un poco más de ayuda. ¿Podrías proporcionar más contexto?",
            "¡Gracias por tu pregunta! Parece que necesito un poco más de información para responder correctamente.",
            "No te preocupes, estoy aquí para ayudarte. ¿Podrías darme más detalles o reformular tu pregunta?",
            "A veces soy un poco despistado. ¿Podrías explicarlo de una manera diferente?",
            "No te preocupes si no me entiendes, a veces incluso yo me lío. ¿Puedes darme más detalles?",
            "¡Claro! Pero necesito un poco más de información para darte una respuesta precisa.",
            "¡Eso es interesante! Pero necesito un poco más de contexto para entender completamente tu pregunta."
        ];

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
            <p>¿Cuál es la razón por la que está utilizando el chatbot?</p>
            ${HTML}
            <p>Para empezar a interactuar con robleboot, puedes seleccionar un tipo de pregunta.

            </p>
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
        this.#userInput.addEventListener("submit", this.#onSubmit)
        this.#userInput.addEventListener("keypress", (e) => e.key === this.#onKeySubmit && this.#onSubmit(e))
        this.#userInput.addEventListener("click", (event) => {
            event.stopPropagation();
            const onClickType = this._getRequiredElement(event.target, "[data-type]")

            this.#execReducer(event, onClickType.dataset.type || null)
        })
    }

    toggleViewChangeText = ({ useOpacityHide = true, enable, useDisabled = true }) => {

        if (useOpacityHide) {
            const { opacityHide } = this.CLASSES
            const element = this._onChangeText.parentElement
            const contains = element.classList.contains(opacityHide)
            if (contains && enable) {
                element.classList.remove(opacityHide)
            }
            else if (!contains && !enable) {
                element.classList.add(opacityHide)
            }
        }

        this._onChangeText.disabled = useDisabled && !enable
    }

    _loadContent = () => {
        this._contentLoaded();
        this.scrollIntoView()
    }

    scrollIntoView = () => {

        setTimeout(() => {
            this._listMessages.scrollTo({
                top: this._listMessages.scrollHeight,
                behavior: "smooth"
            })
        }, 30)
    }
}