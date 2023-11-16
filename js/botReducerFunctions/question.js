export default async function ({ target, context, utils }, userInputValue, useShake = true, params = {}) {

    console.log(this._isPriorityOfTypesSatisfied())
    if (!this._isPriorityOfTypesSatisfied()) return
    else if (!userInputValue.length && useShake) {
        this._shakeElement(target, {
            onShakeCallback: target => target.disabled = true,
            onAfterShakeCallback: target => target.disabled = false
        })
        return
    }
    const { value, name, redirect, methodName } = this._getHighestPriorityTypeValue()

    userInputValue = userInputValue.trim()
    if (redirect) {
        return context()[methodName]({
            userInputValue,
            ...params
        })
    }

    const {
        user,
    } = this._getMessageElementHTML()

    this._listMessages.insertAdjacentHTML("beforeend", user(userInputValue));

    if ("value" in target) target.value = "";

    this.countMessageIteration += 1

    const { isResponded } = await context().botResponse({
        isByFetch: true,
        inCaseOfError: () => {
            const {
                messages,
                notFoundMessage
            } = this._randomBotMessages()

            this._globalChat.chatBot = []
            return this._getRandomElement(messages, notFoundMessage)
        },
        input: userInputValue,
        useReloadType: true,
        useDisplayOptions: this._TYPES.BY_TYPES === name,
        respondInCaseOfError: this.countMessageIteration < 3,
        useAPI: useAPIMethod(() => this, this._apis(), {
            chatBotType: value,
            userQuestion: userInputValue,
            ...params
        })[name],
        ...params
    })

    if (!isResponded && this.countMessageIteration >= 3) {
        await context().botResponse({
            isByFetch: false,
            input: `Lamentamos no poder responder a tus preguntas en este momento. 
            Si lo prefieres, puedes consultar a un asesor haciendo clic en: ${utils().redirectHTML()} para 
            obtener la información que necesitas.`,
            useReloadType: false,
            useDisplayOptions: true,
        })
    }
    else if (this.countMessageIteration >= 3) {
        this.countMessageIteration = 0
    }
}

const useAPIMethod = (context, {
    getChatBotAnswer,
    getResponseById
}, {
    chatBotType = null,
    userQuestion = null,
    id = null,
    ...params
}) => {

    return {
        byTypes: async () => {

            return await getChatBotAnswer({
                chatBotType,
                userQuestion,
                ...params
            })
        },

        byMainTree: async () => {

            return await getResponseById(id || chatBotType)
        }
    }
}