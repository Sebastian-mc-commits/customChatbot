import Global from "./Global.js"
import reducer from "./botReducerFunctions.js"
import { API, TYPES, elementStyles, root, elementMethods } from "./bot/index.js"

export default class Bot extends Global {

    #userInput
    #onKeySubmit
    #reducer
    _isPoliciesAccepted = false

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
        this._fetchUrl = fetchUrl
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
        this._store = [{
            name: null,
            body: {}
        }]
        this._globalChat = {
            chatBot: [],
            user: []
        }
        this._botImageElement = botImageElement
        this.#reducer = reducer.bind(this)
        this._formInputWrapper = formInputWrapper

        Object.assign(
            this,
            API.call(this),
            root.call(this),
            TYPES,
            {
                _getMessageElementHTML: () => elementStyles.call(this)
            },
            {
                _elementMethods: () => elementMethods.call(this)
            }
        )
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

    scrollIntoView = () => {

        setTimeout(() => {
            this._listMessages.scrollTo({
                top: this._listMessages.scrollHeight,
                behavior: "smooth"
            })
        }, 30)
    }

    insertInContent = (...entries) => entries.forEach(
        entry => this._listMessages.insertAdjacentHTML("beforeend", entry)
    )
}