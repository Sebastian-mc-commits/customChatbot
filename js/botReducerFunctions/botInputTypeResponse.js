export default function ({ context, target, event }) {
    event.preventDefault()
    target.parentElement.remove()
    const selectedQuestion = target.textContent

    context().question(selectedQuestion, {
        chatBotTypeAvoid: [""]
    })
}