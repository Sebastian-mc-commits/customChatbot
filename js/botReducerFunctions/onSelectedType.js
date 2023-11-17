export default async function ({ event, target, utils, context }) {
    event.preventDefault()
    if (this._isOnSelectedTypePressed) return
    else if (!this._isPoliciesAccepted) {
        alert("Debes aceptar términos y condiciones")
        return
    }
    this.toggleViewChangeText({
        enable: true
    })
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

    const { deleteSingleEntry } = this._elementMethods()
    deleteSingleEntry({}, onSelectedType())
    const {
        body
    } = this._store.find(({
        name
    }) => name === "contentLoadedBotResponse")

    const {
        defaultMessage = "",
        id
    } = body.find(el => this._getMatchId(el.id, targetId))

    this.insertInContent(
        reloadBotResponse(`Has seleccionado: ${target.textContent}`, "setElementBack"),
        ...[!!defaultMessage ? normalBotResponse(defaultMessage) : []],
        ...[this._TYPES.GLOBAL.DISPLAY_OPTIONS ? utils().displayMoreOptionsHTML(id) : []]
    )

    this._resetPriorities()
    this._chatBotTypeSelected = {
        ...this._chatBotTypeSelected,
        [this._TYPES.TYPES]: {
            ...this._chatBotTypeSelected[this._TYPES.TYPES],
            value: targetId,
            priority: 10
        },
        [this._TYPES.TREE_QUESTION]: {
            ...this._chatBotTypeSelected[this._TYPES.TREE_QUESTION],
            value: id
        }
    }

    this.scrollIntoView()
    this._isOnSelectedTypePressed = true

    if (this._TYPES.GLOBAL.UNWRAP_CONTENT) {
        context().onHandleDisplayOptions(id)
    }
}