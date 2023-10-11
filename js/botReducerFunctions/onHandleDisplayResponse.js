export default async function ({ event, target }) {
    event.preventDefault()
    const id = target.dataset.id

    const {
        onSelectedStyle,
        buttonMessage
    } = this._getMessageElementHTML()

    const { getChatBotAnswerByTypeId } = this._apis()
    const { error, response } = await getChatBotAnswerByTypeId(id)

    if (error) {
        this._errorHandler("No se pudo obtener respuestas")
        return
    }

    const { response: responses } = response

    const html = onSelectedStyle(iterateBy(responses, buttonMessage))

    this._insertBotMessage(html)
}

const iterateBy = (array, stylesCallback) => {
    let HTML = ""
    for (const { id, question } of array) {
        HTML += stylesCallback(id, question, "botInputTypeResponse")
    }

    return HTML
}