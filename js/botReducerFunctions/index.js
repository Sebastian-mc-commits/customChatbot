export { default as question } from "./question.js"
export { default as onSelectedType } from "./onSelectedType.js"
export { default as refreshBotAnswer } from "./refreshBotAnswer.js"
export { default as onClean } from "./onClean.js"
export { default as botInputTypeResponse } from "./botInputTypeResponse.js"
export { default as onHandleDisplayResponse } from "./onHandleDisplayResponse.js"
export { default as botResponse } from "./botResponse.js"
export { default as redirectVirtualContact } from "./redirectVirtualContact.js"
export { default as handleUserQuestion } from "./handleUserQuestion.js"
export { default as handleStoreUserInput } from "./handleStoreUserInput.js"
export { default as responseFilter } from "./responseFilter.js"
export const termsAndConditionsHandler = async function () {
  const value = await fetch(`${window.location.href}/policies.html`)
  const newValue = await value.text()

  let newWin = window.open("about:blank", "hello", "width=800,height=700");

  if (!newWin) {
    alert('Por favor habilita las ventanas emergentes.');
    return
  }
  newWin.document.write(String(newValue));
  newWin.opener = {
    onSubmitPolicies: (isPoliciesAccepted) => {
      this._isPoliciesAccepted = isPoliciesAccepted
      if (isPoliciesAccepted) {
        this._loadContent()
      }
      newWin.close()
    }
  }
}