export default function () {

  return {
    user: (value) => `<p class='userMessage'>${value}</p>`,
    normalBotResponse: (value, subclass = "", attr = "") => `<p class="botMessage ${subclass}" ${attr}>${this._botImageElement}${value}</p>`,
    reloadBotResponse: (value, onReload, subclass = "", attr = "") => this._getMessageElementHTML().normalBotResponse(`
      ${value} <span class='reload' data-type='refreshBotAnswer' data-reload-type=${onReload}>&#8634;</span>
      `, subclass, attr),
    botInputTypeResponse: (labelValue, id = Date.now(), type = "radio") => `
          <label for='${id.toString()}' data-type='botInputTypeResponse'>
              <input type='${type}' name='botInputTypeResponse' id='${id.toString()}'/>
              <span>${labelValue}</span>
          </label>
      `,
    onSelectedStyle: (HTML) => `<div class='onSelectStyle' id='onSelectedType'>${HTML}</div>`,
    buttonMessage: (id, title, dataType = "onSelectedType") => `
      <button data-id=${id} data-type='${dataType}'>
          ${title}
      </button>
      `,
    defaultStartedMessage: () => `
      <p class="botMessage">
      ${this._botImageElement}
          ¡Hola! Soy ROBLEBOOT, 
          el contacto digital de ROBLES S.A.S, estoy acá para 
          brindarte información y ayudarte con varios trámites 
          como PQR, ingresa dando 
          <span class="ancor" data-type="termsAndConditionsHandler">Click Aquí</span>
        </p>
        <p class="botMessage">
        ${this._botImageElement}
          Para continuar, revisa nuestras políticas de privacidad, si deseas conocerlas da 
          <span class="ancor" data-type="termsAndConditionsHandler">Click.</span>
        </p>
      `,

    responseWithHelper: ({ value, helperValue, isNormal = true, onReload }) => {
      const dataText = `data-text='${helperValue}'`
      const { normalBotResponse, reloadBotResponse } = this._getMessageElementHTML()
      return isNormal ? normalBotResponse(value, "upperMessage", dataText) : reloadBotResponse(
        value,
        onReload,
        "upperMessage",
        dataText
      )
    }
  }
}