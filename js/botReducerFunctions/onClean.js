export default async function ({ event, target }) {
    event?.preventDefault()

    const {
        defaultStartedMessage
    } = this._getMessageElementHTML()

    // this._listMessages.innerHTML = defaultStartedMessage()
    this._listMessages.innerHTML = ""
    await this._contentLoaded()
    if ("disabled" in target) target.disabled = true
    this.toggleViewChangeText({
        enable: false
    })
    this._isOnSelectedTypePressed = false
}