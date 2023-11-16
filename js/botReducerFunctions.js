import {
  onClean,
  onSelectedType,
  question,
  refreshBotAnswer,
  botInputTypeResponse,
  onHandleDisplayResponse,
  termsAndConditionsHandler,
  botResponse,
  redirectVirtualContact,
  handleUserQuestion,
  handleStoreUserInput,
  responseFilter
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

    termsAndConditionsHandler: setContext(termsAndConditionsHandler),

    botResponse: setContext(botResponse),

    redirectVirtualContact: setContext(redirectVirtualContact),

    handleUserQuestion: setContext(handleUserQuestion),

    handleStoreUserInput: setContext(handleStoreUserInput),

    responseFilter: setContext(responseFilter)
  }
}

function contextUtils() {

  return {
    displayMoreOptionsHTML: (id, {
      datatype,
      message = "Mostrar Opciones"
    } = {
        datatype: "onHandleDisplayOptions",
        message: "Mostrar Opciones"
      }) => {
      const {
        normalBotResponse,
        buttonMessage
      } = this._getMessageElementHTML()

      return normalBotResponse(buttonMessage(id, message, datatype))
    },

    redirectHTML: () => {
      const {
        buttonMessage
      } = this._getMessageElementHTML()

      return buttonMessage(null, "Contactar", "redirectVirtualContact")
    },

  }
}
