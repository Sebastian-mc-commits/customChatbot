export default async function ({ context }, { userInputValue }) {

  const { insertUserInputById } = this._apis()

  const { value } = this._chatBotTypeSelected[this._TYPES.TREE_QUESTION]
  const { response: { response: isInserted } } = await insertUserInputById({
    responseId: value,
    userInput: userInputValue
  })

  const { isResponded } = await context().botResponse({
    isByFetch: false,
    input: `No comprendo tu solicitud.
    Te contactaremos pronto con un asesor.`,
    useReloadType: false,
    useDisplayOptions: false,
    respondInCaseOfError: true
  })

  if (isResponded && isInserted) {
    setTimeout(() => {
      context().redirectVirtualContact()
      context().onClean()
      this._resetPriorities()
      this._chatBotTypeSelected[this._TYPES.TYPES] = {
        ...this._chatBotTypeSelected[this._TYPES.TYPES],
        value: null,
        priority: 10
      }
    }, 2000)
  }
}