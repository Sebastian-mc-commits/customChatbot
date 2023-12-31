export default function ({ target, context }) {
  const type = target.dataset?.reloadType || ""

  const onRefreshReducer = {
    setElementBack: async () => {
      await this._loadContent()
    }
  }

  const callback = onRefreshReducer[type]

  if (typeof callback === "function") {
    callback()
    target.parentNode.remove()
    this._isOnSelectedTypePressed = false
  }
  else {
    const {
      user
    } = this._getLastMessagesBetween()
    context().question(user, true, {
      chatBotTypeAvoid: this._globalChat.chatBot
    })
  }

  this.scrollIntoView()
}