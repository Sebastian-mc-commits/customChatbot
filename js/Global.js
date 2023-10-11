export default class Global {

  _useFetch = async (url, returnJson, params = {}) => {
    let request = null
    let response = null
    let error = false

    console.log("url")
    console.log(url)
    try {
      request = await fetch(url, params)

      if (returnJson) {
        response = await request.json()
      }
    } catch (e) {
      console.log("Error: " + e.message)
      error = true
    }

    return {
      response,
      request,
      error
    }
  }

  _getMatchId = (...ids) => {
    return ids.every(id => +(ids[0]) === +id)
  }

  _getRequiredElement = (target, requiredQuery) => {
    return target?.closest(requiredQuery) || target
  }

  _getRandomElement = (...props) => {
    const randomNumber = Math.random() * props.length

    return props[Math.floor(randomNumber)]
  }

  _errorHandler = (errorMessage) => {
    alert(errorMessage)
  }

  _shakeElement = (element, { onShakeCallback = () => { }, onAfterShakeCallback = () => { } }) => {
    element.classList.add("shake")
    onShakeCallback(element)
    setTimeout(() => {
      element.classList.remove("shake")
      onAfterShakeCallback(element)
      element.focus()

    }, 500)
  }
}