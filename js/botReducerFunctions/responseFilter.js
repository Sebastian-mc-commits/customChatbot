export default async function ({ context }, idField, {
  responseContent,
  isHTML,
  isMainTree,
  useReloadType = true,
  render = false,
  requiresUserInput = 0,
  responseTitleId = null,
}) {

  let value = ""
  let type = ""
  const {
    onSelectedStyle,
    buttonMessage,
    normalBotResponse,
    reloadBotResponse,
  } = this._getMessageElementHTML()

  if (isMainTree == 1) {
    if (render) {
      value = onSelectedStyle(buttonMessage(idField, responseContent, "handleUserQuestion"))
    }
    else {
      const {
        getAnswersByMainTree
      } = this._apis()

      const { response: { response: data } = { response: [] }, error } = await getAnswersByMainTree(idField)

      if (error) {
        value = normalBotResponse("No logré procesar tu pregunta.")
      }
      else if (data.length === 1 && data[0].isMainTree == 0) {
        return context().responseFilter(idField, data[0])
      }
      else {
        for (const { id, responseContent } of data) {
          value += buttonMessage(id, responseContent, "handleUserQuestion")
        }

        value = onSelectedStyle(value)
      }


    }
    type = this._TYPES.TREE_QUESTION

    this._resetPriorities()
    this._chatBotTypeSelected.treeQuestion = {
      ...this._chatBotTypeSelected.treeQuestion,
      priority: 10,
      value: idField
    }

  }

  else if (isHTML == 1) {
    value = eval(responseContent)
    type = this._TYPES.HTML_FIELD
  }

  else if (requiresUserInput == 1) {
    const {
      getResponseTitleById
    } = this._apis()
    const { response: { response: data } } = await getResponseTitleById(responseTitleId)
    const { title, id } = data
    value = normalBotResponse(title)

    this._chatBotTypeSelected[this._TYPES.USER_INPUT_REQUIRED] = {
      ...this._chatBotTypeSelected[this._TYPES.USER_INPUT_REQUIRED],
      value: id,
      priority: 10
    }

    const { deleteSingleEntry } = this._elementMethods()
    const children = Array.from(this._listMessages.children)
    await deleteSingleEntry({}, ...children.slice(0, -1))

    type = this._TYPES.USER_INPUT_REQUIRED
  }

  else if (responseContent.length > 0) {

    const HTMLclass = responseContent.length > 24 ? this.CLASSES.botMessageW100Class : ""
    const responseFn = useReloadType ? reloadBotResponse : normalBotResponse
    value = responseFn(responseContent, HTMLclass)

    this._resetPriorities()
    this._chatBotTypeSelected.types = {
      ...this._chatBotTypeSelected.types,
      priority: 10
    }

    type = this._TYPES.RESPONSE
  }

  return {
    value,
    type
  }
}