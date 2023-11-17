export default function () {

  const source = (query) => this._fetchUrl + query
  return {
    _apis: () => ({

      requestType: (value) => this._useFetch(source(`?requestType=${value}`), true),
      getChatBotAnswer: async ({
        chatBotType,
        userQuestion,
        ...params
      }) => {
        const url = source(`?requestType=getChatBotAnswer&chatBotType=${chatBotType}&userQuestion=${userQuestion}`)
        const json = JSON.stringify({
          chatBotType,
          userQuestion,
          ...params
        })

        return await this._useFetch(url, true, {
          method: "POST",
          header: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(json)
        })
      },
      getChatBotAnswerByTypeId: async (id) => {
        const url = source(`?requestType=getChatBotAnswerByTypeId&id=${id}`)
        return await this._useFetch(url, true)
      },

      getAnswersByMainTree: async (id) => {
        const url = source(`?requestType=getAnswersByMainTree&id=${id}`)
        return await this._useFetch(url, true)
      },

      getResponseById: async (id) => {
        const url = source(`?requestType=getResponseById&id=${id}`)

        return await this._useFetch(url, true)
      },

      getResponseTitleById: async (id) => {
        const url = source(`?requestType=getResponseTitleById&id=${id}`)

        return await this._useFetch(url, true)
      },

      insertUserInputById: async ({
        responseId,
        userInput
      }) => {

        const json = JSON.stringify({
          responseId,
          userInput
        })
        const url = source(`?requestType=insertUserInputById`)
        return await this._useFetch(url, true, {
          method: "POST",
          header: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(json)
        })
      }

    }),

    _randomBotMessages: () => {
      const messages = [
        "Lo siento, no estoy seguro de entender tu pregunta. ¿Podrías reformularla de otra manera?",
        "Parece que tu pregunta es un poco confusa para mí. ¿Podrías intentar explicarlo de otra manera?",
        "Me temo que no entiendo lo que quieres decir. ¿Podrías proporcionar más detalles o reformular tu pregunta?",
        "¡Vaya! Parece que estoy un poco confundido. ¿Podrías darme más información o reformular tu pregunta?",
        "Parece que hemos tenido un pequeño malentendido. ¿Podrías expresar tu pregunta de otra manera?",
        "No puedo procesar esa entrada. ¿Podrías intentar reformular tu pregunta?",
        "Lo siento, parece que no comprendo lo que estás tratando de decir. ¿Podrías explicarlo de una manera diferente?"
      ];

      const notFoundMessage = [
        "Estoy intentando entenderte, pero parece que necesito un poco más de ayuda. ¿Podrías proporcionar más contexto?",
        "¡Gracias por tu pregunta! Parece que necesito un poco más de información para responder correctamente.",
        "No te preocupes, estoy aquí para ayudarte. ¿Podrías darme más detalles o reformular tu pregunta?",
        "A veces soy un poco despistado. ¿Podrías explicarlo de una manera diferente?",
        "No te preocupes si no me entiendes, a veces incluso yo me lío. ¿Puedes darme más detalles?",
        "¡Claro! Pero necesito un poco más de información para darte una respuesta precisa.",
        "¡Eso es interesante! Pero necesito un poco más de contexto para entender completamente tu pregunta."
      ];

      return {
        messages: this._getRandomElement(...messages),
        notFoundMessage: this._getRandomElement(...notFoundMessage)
      }
    }
  }
}