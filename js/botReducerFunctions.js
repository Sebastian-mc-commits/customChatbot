import {
  onClean,
  onSelectedType,
  question,
  refreshBotAnswer,
  botInputTypeResponse,
  onHandleDisplayResponse
} from "./botReducerFunctions/index.js"

export default function reducer(target, event) {

  const context = () => reducer.call(this, target, event)
  const utils = () => contextUtils.call(this)
  const setContext = (callback) => (...params) => callback.apply(this, [{ target, event, context, utils }, ...params])

  return {
    question: setContext(question),

    onSelectedType: setContext(onSelectedType),

    refreshBotAnswer: setContext(refreshBotAnswer),

    onClean: setContext(onClean),

    botInputTypeResponse: setContext(botInputTypeResponse),

    onHandleDisplayOptions: setContext(onHandleDisplayResponse),

  }
}

function contextUtils() {

  return {
    displayMoreOptionsHTML: (id) => {
      const {
        normalBotResponse,
        buttonMessage
      } = this._getMessageElementHTML()

      return normalBotResponse(buttonMessage(id, "Mostrar Opciones", "onHandleDisplayOptions"))
    }
  }
}
