export const strToMoney = (str) => {
  const amount = String(str)
    .replace(/[./]/, '')
    .replace(',', '.')

  return parseFloat(amount).toFixed(2)
}

export const strToDatetime = (date, withTime) => {
  const str = date.replace(/[/]/gi, '')

  const day = str.slice(0, 2)
  const month = str.slice(2, 4)
  const year = str.slice(4, 8)
  const time = withTime && str.slice(8) ? str.slice(8) : ''

  return `${year}${month}${day}${time}`
}
