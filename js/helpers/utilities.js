
export const getIdField = (obj, ...possibleIds) => {
  let id = ""
  for (const key in obj) {
    for (const val of possibleIds) {
      if (val === key && !!obj[key]) {
        id = obj[key]
        break
      }
    }

    if (id) break
  }

  return id
}

export const useForEach = async (array = [], callback) => {
  if (Array.isArray(array)) {
    array.forEach(callback)
    return
  }

  await Promise.resolve(callback(array))
}

export const validate = (val) => {
  let isValid = false

  if (Array.isArray(val)) {
    isValid = val.length > 0
  }
  else if (typeof val === "object") {
    isValid = Object.keys(val).length > 0
  }

  return isValid
}

export const getRandomValue = (value, inCaseOfObjectGetKeys = false) => {
  const { random, floor } = Math
  let newValue = null

  if (Array.isArray(value)) {
    newValue = value[floor(random() * value.length)]
  }

  else if (typeof value === "object") {

    const newArray = Array.from(Object?.[inCaseOfObjectGetKeys ? "keys" : "values"](value))
    newValue = newArray[floor(random() * newArray.length)]
  }

  return newValue
}