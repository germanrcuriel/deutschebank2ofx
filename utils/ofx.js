const statement = ({
  amount,
  date,
  id,
  memo
}) => {
  return `<STMTTRN>
            <TRNTYPE>OTHER
            <DTPOSTED>${date}
            <TRNAMT>${amount}
            <FITID>${id}
            <MEMO>${memo}
          </STMTTRN>`
}

export const generateOFX = ({
  balance,
  bankAccount,
  bankBranch,
  bankId,
  currency,
  from,
  serverDate,
  statements,
  to
}) => {
  return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <DTSERVER>${serverDate}
      <LANGUAGE>ENG
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>1
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <STMTRS>
        <CURDEF>${currency}
        <BANKACCTFROM>
          <BANKID>${bankId}
          <BRANCHID>${bankBranch}
          <ACCTID>${bankAccount}
          <ACCTTYPE>CHECKING
        </BANKACCTFROM>
        <BANKTRANLIST>
          <DTSTART>${from}
          <DTEND>${to}
          ${statements.map(statement)}
        </BANKTRANLIST>
        <LEDGERBAL>
          <BALAMT>${balance}
          <DTASOF>${serverDate}
        </LEDGERBAL>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>`
}
