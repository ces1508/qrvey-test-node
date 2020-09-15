const bcrypt = require('bcrypt')
const SALT_LENGTH = 10

const encrypt = async text => {
  try {
    const salt = await bcrypt.genSalt(SALT_LENGTH)
    const hash = await bcrypt.hash(text, salt)

    return hash
  } catch (e) {
    const error = new Error()
    error.message`an error occurred try to encryptTextWithbcrypt ${e.message}`
    throw error
  }
}

const compare = async (hash, plainPassword) => {
  const isEqual = await bcrypt.compare(plainPassword, hash)

  return isEqual
}

module.exports = {
  encrypt,
  compare
}
