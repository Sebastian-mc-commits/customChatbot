export default function ({ context, target, event }) {
    event.preventDefault()
    const { deleteSingleEntry } = this._elementMethods()
    deleteSingleEntry({}, target.parentElement)

    const selectedQuestion = target.textContent

    context().question(selectedQuestion, true, {
        chatBotTypeAvoid: [""],
        id: target?.dataset?.id || null
    })
}