export default function ({ context, target, event }) {
  event.preventDefault()
  const value = target.textContent
  const id = target?.dataset?.id || null

  this._chatBotTypeSelected.treeQuestion = {
    ...this._chatBotTypeSelected.treeQuestion,
    value: id
  }

  context().question(value, true, {
    id
  })
}