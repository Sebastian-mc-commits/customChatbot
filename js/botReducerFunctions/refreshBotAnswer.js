export default function ({ target, context }) {
  const type = target.dataset?.reloadType || ""

  const onRefreshReducer = {
    setElementBack: async () => {
      await this._contentLoaded()
      this._onChangeText.disabled = true
    }
  }

  const callback = onRefreshReducer[type]

  if (typeof callback === "function") {
    callback()
    target.parentNode.remove()
    this._isOnSelectedTypePressed = false
    return
  }

  const {
    user
  } = this._getLastMessagesBetween()
  context().question(user, true, {
    chatBotTypeAvoid: this._globalChat.chatBot
  })

}