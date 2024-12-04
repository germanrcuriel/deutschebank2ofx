import md5 from 'md5'
import { basename, extname } from 'node:path'
import xlsx from 'node-xlsx'
import { generateOFX } from '../utils/ofx.js'
import { strToDatetime, strToMoney } from '../utils/str.js'

const SERVER_DATE_ROW_INDEX = 1
const BANK_DETAILS_ROW_INDEX = 3
const TIME_RANGE_ROW_INDEX = 4
const BALANCE_ROW_INDEX = 5
const STATEMENTS_START_ROW_INDEX = 8

const initialInput = () => {
  return {
    balance: null,
    bankAccount: null,
    bankBranch: null,
    bankId: null,
    currency: null,
    from: null,
    serverDate: null,
    statements: [],
    to: null
  }
}

const getDestinationFile = (file) => {
  const name = basename(file, extname(file))

  return `${name}.ofx`
}

const setServerDate = (input, { date }) => {
  const str = date.replace('-', '/')
  input.serverDate = strToDatetime(str, true)
}

const setBankDetails = (input, { account, currency }) => {
  input.bankId = account.slice(4, 8)
  input.bankBranch = account.slice(8, 12)
  input.bankAccount = account.slice(12)
  input.currency = currency.toUpperCase()
}

const setDateRange = (input, { from, to }) => {
  input.from = strToDatetime(from)
  input.to = strToDatetime(to)
}

const setBalance = (input, { balance }) => {
  input.balance = strToMoney(balance)
}

const setStatement = (input, { amount, date, memo }) => {
  const statementAmount = strToMoney(amount)
  const statementDate = strToDatetime(date)
  const hash = md5(`${statementAmount}${statementDate}${memo}`)

  input.statements.push({
    amount: statementAmount,
    date: statementDate,
    id: hash,
    memo
  })
}

export const convert = ({ buffer, originalname }) => {
  try {
    const [{ data }] = xlsx.parse(buffer)
    const input = initialInput()

    data.forEach((row, index) => {
      if (index === SERVER_DATE_ROW_INDEX) {
        return setServerDate(input, {
          date: row[2]
        })
      }

      if (index === BANK_DETAILS_ROW_INDEX) {
        return setBankDetails(input, {
          account: row[2],
          currency: row[8]
        })
      }

      if (index === TIME_RANGE_ROW_INDEX) {
        return setDateRange(input, {
          from: row[3],
          to: row[6]
        })
      }

      if (index === BALANCE_ROW_INDEX) {
        return setBalance(input, {
          balance: row[3]
        })
      }

      if (index >= STATEMENTS_START_ROW_INDEX) {
        const amount = row[8]
        const date = row[2]
        const memo = row[3]

        if (!amount && !date && !memo) return

        return setStatement(input, {
          amount: row[8],
          date: row[2],
          memo: row[3]
        })
      }
    })

    const filename = getDestinationFile(originalname)
    const ofx = generateOFX(input)

    return {
      content: ofx,
      filename: filename
    }
  } catch (err) {
    console.error(err)
  }
}
