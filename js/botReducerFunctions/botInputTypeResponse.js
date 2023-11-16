export default function ({ context, target, event }) {
    event.preventDefault()
    target.parentElement.remove()
    const selectedQuestion = target.textContent

    context().question(selectedQuestion, true, {
        chatBotTypeAvoid: [""],
        id: target?.dataset?.id || null
    })
}