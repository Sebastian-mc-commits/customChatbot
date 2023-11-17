export default function () {

  const whatsappUrl = number => `https://wa.me/${number}`

  window.open(whatsappUrl("+57 300 4133311"), "_blank")
}