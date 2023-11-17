export default function () {

  return {
    _contentLoaded: async () => {
      const type = "getChatBotTypes";
      const {
        requestType
      } = this._apis()

      const {
        buttonMessage,
        onSelectedStyle
      } = this._getMessageElementHTML()
      const {
        error,
        request,
        response
      } = await requestType(type);

      if (!request?.ok || error) return;

      const {
        response: chatBotResponse
      } = response;

      let HTML = "";
      for (const {
        title,
        id
      } of chatBotResponse) {
        HTML += buttonMessage(id, title)
      }

      HTML = onSelectedStyle(`
          <p>Para iniciar la interacción, por favor selecciona una de las siguientes opciones.</p>
          ${HTML}
      `)

      const index = this._store.findIndex(({
        name
      }) => name === "contentLoadedBotResponse")

      if (index === -1) {
        this._store.push({
          name: "contentLoadedBotResponse",
          body: chatBotResponse
        })
      }

      this._listMessages.insertAdjacentHTML("beforeend", HTML);
    },

    _loadContent: () => {
      const { deleteParentEntry } = this._elementMethods()
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
  }
}