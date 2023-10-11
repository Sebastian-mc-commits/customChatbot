export default async function ({event, target}) {
    event.preventDefault()

    const {
        defaultStartedMessage
    } = this._getMessageElementHTML()

    this._listMessages.innerHTML = defaultStartedMessage()
    await this._contentLoaded()
    target.disabled = true
    this._onChangeText.disabled = true
    this._isOnSelectedTypePressed = false
}