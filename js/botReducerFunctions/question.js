export default async function ({ target, utils }, userInputValue, useShake = true, params = {}) {
    if (!this._chatBotTypeSelected) return
    else if (userInputValue.length < 3 && useShake) {
        this._shakeElement(target, {
            onShakeCallback: target => target.disabled = true,
            onAfterShakeCallback: target => target.disabled = false
        })
        return
    }

    userInputValue = userInputValue.trim()

    const {
        user,
        normalBotResponse,
        reloadBotResponse
    } = this._getMessageElementHTML()
    const {
        getChatBotAnswer
    } = this._apis()

    this._listMessages.insertAdjacentHTML("beforeend", user(userInputValue));

    this._listMessages.scrollTop = this._listMessages.scrollHeight

    target.value = "";
    const typeSelected = this._chatBotTypeSelected

    const {
        error,
        request,
        response = {}
    } = await getChatBotAnswer({
        chatBotType: typeSelected,
        userQuestion: userInputValue,
        ...params
    });

    if (!request?.ok || error || !response?.response?.length) {
        const {
            messages,
            notFoundMessage
        } = this._randomBotMessages()

        const botNotFoundedMessage = this._getRandomElement(messages, notFoundMessage)

        this._listMessages.insertAdjacentHTML("beforeend", normalBotResponse(botNotFoundedMessage));
        this._globalChat.chatBot = []
        return
    };


    const {
        response: chatBotAnswer = {}
    } = response;

    const {
        response: answer = ""
    } = chatBotAnswer[0]

    this._listMessages.insertAdjacentHTML("beforeend", reloadBotResponse(answer));
    const id = this._chatBotTypeSelected
    this._listMessages.insertAdjacentHTML("beforeend", utils().displayMoreOptionsHTML(id));
    this._storeChat("user", userInputValue)
    this._storeChat("chatBot", answer)
}
