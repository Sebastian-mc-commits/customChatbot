export default function () {

  const whatsappUrl = number => `https://wa.me/${number}`

  window.open(whatsappUrl("3023492663"), "_blank")
}