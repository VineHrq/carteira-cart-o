import './css/index.css'
import IMask, { MaskedPattern } from 'imask'

const ccBgColor01 = document.getElementById('color1')
const ccBgColor02 = document.getElementById('color2')
const ccLogo = document.getElementById('logo')

function setCardType(type) {
  const colors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'gray']
  }
  ccBgColor01.style.fill = colors[type][0]
  ccBgColor02.style.fill = colors[type][1]
  ccLogo.setAttribute('src', `cc-${type}.svg`)
}

//Security code
const securityCode = document.getElementById('security-code')
const securityCodePattern = {
  mask: '000'
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// expirationDate
const expirationDate = document.getElementById('expiration-date')
const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// card Number
const cardNumber = document.getElementById('card-number')
const cardNumberPattern = {
  mask: [
    { mask: '0000 0000 0000 0000', regex: /^4\d{0,15}/, cardtype: 'visa' },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard'
    },
    { mask: '0000 0000 0000 0000', cardtype: 'default' }
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '')
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Eventos DOM

const addButon = document.getElementById('add-card')

addButon.addEventListener('click', () => {
  alert('Cartão adicionado')
})

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
})

const cardHolder = document.getElementById('card-holder')
cardHolder.addEventListener('input', () => {
  const ccHolder = document.getElementById('valueHolder')
  let letras = cardHolder.value.length
  if (letras > 0) {
    ccHolder.innerHTML = cardHolder.value
  } else {
    ccHolder.innerHTML = 'FULANO DA SILVA'
  }
})

securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value')
  ccSecurity.innerHTML = code.length === 0 ? '123' : code
}

cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number')
  ccNumber.innerHTML = number.length === 0 ? '1234 5678 9012 3456' : number
}

expirationDateMasked.on('accept', () => {
  UpdateExpirationDate(expirationDateMasked.value)
})

function UpdateExpirationDate(date) {
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerHTML = date.length === 0 ? '02/32' : date
}
