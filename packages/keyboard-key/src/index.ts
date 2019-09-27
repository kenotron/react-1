import { aliases, codes, names } from './names'
import { getCode, getKey } from './utils'

const keyboardKey = {
  codes,
  getCode,
  getKey,
  ...names,
  ...aliases,
}

export default keyboardKey
