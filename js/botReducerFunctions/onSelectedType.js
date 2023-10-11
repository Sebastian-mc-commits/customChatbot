export default async function ({ event, target, utils }) {
    event.preventDefault()
    if (this._isOnSelectedTypePressed) return
    this._onChangeText.disabled = false;
    const targetId = target?.dataset.id

    this._onChangeText.focus();
    const {
        onSelectedType,
        formInputsWrapper
    } = this._getElements()

    const {
        cleanButton
    } = formInputsWrapper()

    cleanButton().disabled = false

    const {
        normalBotResponse,
        reloadBotResponse,
    } = this._getMessageElementHTML()
    onSelectedType().remove();


    const {
        body
    } = this._store.find(({
        name
    }) => name === "contentLoadedBotResponse")

    const {
        defaultMessage = "",
        id
    } = body.find(el => this._getMatchId(el.id, targetId))

    const insertBotMessage = (value) => this._listMessages.insertAdjacentHTML("beforeend", value);

    [
        reloadBotResponse(`Has seleccionado: ${target.textContent}`, "setElementBack"),
        normalBotResponse(defaultMessage),
        utils().displayMoreOptionsHTML(id)
    ].forEach(insertBotMessage)

    this._chatBotTypeSelected = targetId;
    this._isOnSelectedTypePressed = true
}