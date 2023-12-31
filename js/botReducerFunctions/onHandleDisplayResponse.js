export default async function ({ event, target }, {
    useId = null
} = {
        useId: null
    }) {
    event?.preventDefault()
    const id = target?.dataset?.id || useId

    const {
        onSelectedStyle,
        buttonMessage
    } = this._getMessageElementHTML()

    const { getChatBotAnswerByTypeId } = this._apis()
    const { error, response } = await getChatBotAnswerByTypeId(id)

    if (error || Array.from(response?.response || []).length === 0) {
        this._errorHandler("No se pudo obtener respuestas")
        return
    }

    const { response: responses } = response

    const html = onSelectedStyle(iterateBy(responses, buttonMessage))

    this.insertInContent(html)
    this.scrollIntoView()
}

const iterateBy = (array, stylesCallback) => {
    let HTML = ""
    for (const { id, question } of array) {
        HTML += stylesCallback(id, question, "botInputTypeResponse")
    }

    return HTML
}