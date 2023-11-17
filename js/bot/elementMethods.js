import { getRandomValue } from "../helpers/index.js"

export default function () {

  return {
    deleteSingleEntry: ({ useRandom = true, animation = "" }, ...entries) => {

      entries.forEach(entry => {
        const animationName = useRandom ? getRandomValue(this.CLASSES.fadeAnimations) : animation
        entry.classList.add(animationName)
        setTimeout(() => {
          entry.remove()
        }, 600)
      })
    },

    deleteParentEntry: async ({
      useRandom = true,
      animation = "",
      whenDeleted = () => null
    }, ...entries) => {

      await new Promise(resolve => {

        entries.forEach(entry => {
          const animationName = useRandom ? getRandomValue(this.CLASSES.fadeAnimations) : animation
          entry.classList.add(animationName)
          setTimeout(() => {
            entry.innerHTML = ""
            whenDeleted()
            entry.classList.remove(animationName)
            resolve()
          }, 600)
        })
      })

    }
  }
}