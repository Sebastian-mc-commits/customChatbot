export default function () {

  const whatsappUrl = number => `https://wa.me/${number}`

  window.open(whatsappUrl("+573004133311"), "_blank")
}