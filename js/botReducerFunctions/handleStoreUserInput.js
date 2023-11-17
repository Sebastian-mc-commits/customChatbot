export default async function ({ context, utils }, { userInputValue }) {

  const { insertUserInputById, getResponseTitleById } = this._apis()

  const { TREE_QUESTION, USER_INPUT_REQUIRED, TYPES } = this._TYPES
  const { value: i_value } = this._chatBotTypeSelected[TREE_QUESTION]
  const { value: r_value } = this._chatBotTypeSelected[USER_INPUT_REQUIRED]
  const [{ response: { response: isInserted } }, { response: { response: { endTitle, useRedirect } } }] = await Promise.all([
    insertUserInputById({
      responseId: i_value,
      userInput: userInputValue
    }),
    getResponseTitleById(r_value)
  ])

  const { isResponded } = await context().botResponse({
    isByFetch: false,
    input: endTitle,
    useReloadType: false,
    useDisplayOptions: false,
    respondInCaseOfError: true
  })

  this._resetPriorities()
  if (isResponded && isInserted && useRedirect == 1) {
    setTimeout(() => {
      context().redirectVirtualContact()
      context().onClean()
      this._chatBotTypeSelected[TYPES] = {
        ...this._chatBotTypeSelected[TYPES],
        value: null,
        priority: 10
      }
    }, 1000)
  }

  else {
    this._chatBotTypeSelected[TYPES] = {
      ...this._chatBotTypeSelected[TYPES],
      priority: 10
    }
    const { value } = this._getHighestPriorityTypeValue()

    this.insertInContent(utils().displayMoreOptionsHTML(value))
  }
}