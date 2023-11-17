export default async function ({ event, target }) {
    event?.preventDefault()

    const { deleteParentEntry } = this._elementMethods()
    if ("disabled" in target) target.disabled = true
    this.toggleViewChangeText({
        enable: false
    })
    this._isOnSelectedTypePressed = false
    this._onChangeText.value = ""
    deleteParentEntry({
        whenDeleted: async () => {
            await this._contentLoaded()
        }
    }, this._listMessages)
}