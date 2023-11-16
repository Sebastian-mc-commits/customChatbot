import { getIdField, useForEach, validate } from "../helpers/index.js"

export default async function ({ utils, context }, {
  isByFetch = true,
  inCaseOfError = () => null,
  input,
  useReloadType = true,
  useDisplayOptions = true,
  respondInCaseOfError = true,
  useAPI = () => ({}),
}) {

  let botResponse = ""
  let isResponded = true
  const { value: id, name } = this._getHighestPriorityTypeValue()

  if (!id) {
    botResponse = inCaseOfError()
    isResponded = false
  }
  else if (isByFetch) {
    const {
      error,
      request,
      response = {}
    } = await useAPI()

    if (!request?.ok || error || !validate(response?.response)) {
      const {
        normalBotResponse
      } = this._getMessageElementHTML()
      botResponse = normalBotResponse(inCaseOfError())
      isResponded = false
    }
    else {
      const {
        response: chatBotAnswer = {}
      } = response;

      await useForEach(chatBotAnswer, async (val) => {
        const { value, type } = await context().responseFilter(getIdField(val, "responseId", "id"), {
          ...val,
          useReloadType,
          render: this._TYPES.BY_TYPES === name
        })

        botResponse += value
        if (type === this._TYPES.TREE_QUESTION && useDisplayOptions) {
          useDisplayOptions = false
        }
      })

    }
  }

  else {
    botResponse = await context().responseFilter(null, {
      responseContent: input,
      isHTML: 0,
      isMainTree: 0,
      useReloadType,
    }).value
  }


  if (isResponded || respondInCaseOfError) {
    this._listMessages.insertAdjacentHTML("beforeend", botResponse);
    if (useDisplayOptions) {
      const { value, name } = this._getHighestPriorityTypeValue()
      const method = this._getAssociatedMethodByType(name)
      this._listMessages.insertAdjacentHTML("beforeend", utils().displayMoreOptionsHTML(value, {
        datatype: method
      }));
    }
    this._storeChat("user", input)
    this._storeChat("chatBot", botResponse)
    this.scrollIntoView()
  }

  return {
    isResponded,
    input
  }
}

const j = {
  "response": [
    {
      "responseId": "1",
      "id": "1",
      "responseContent": "Good",
      "isTree": "0",
      "treeId": null,
      "questionId": "1",
      "isHTML": "0",
      "isMainTree": "0",
      "userInput": null,
      "hasUserInput": "0",
      "question": "How are you?",
      "typeId": "3"
    }
  ]
}