import { codes } from './names'

function isObject(val) {
  return val !== null && !Array.isArray(val) && typeof val === 'object'
}

/**
 * Get the `keyCode` or `which` value from a keyboard event or `key` name.
 * @param {string|object} eventOrKey A keyboard event-like object or `key` name.
 * @param {string} [eventOrKey.key] If object, it must have one of these keys.
 * @param {string} [eventOrKey.keyCode] If object, it must have one of these keys.
 * @param {string} [eventOrKey.which] If object, it must have one of these keys.
 * @returns {*}
 */
export function getCode(eventOrKey) {
  if (isObject(eventOrKey)) {
    return eventOrKey.keyCode || eventOrKey.which || this[eventOrKey.key]
  }
  return this[eventOrKey]
}

/**
 * Get the key name from a keyboard event, `keyCode`, or `which` value.
 * @param {number|object} eventOrCode A keyboard event-like object or key code.
 * @param {number} [eventOrCode.key] If object with a `key` name, it will be returned.
 * @param {number} [eventOrCode.keyCode] If object, it must have one of these keys.
 * @param {number} [eventOrCode.which] If object, it must have one of these keys.
 * @param {number} [eventOrCode.shiftKey] If object, it must have one of these keys.
 * @returns {*}
 */
export function getKey(eventOrCode) {
  const isEvent = isObject(eventOrCode)

  // handle events with a `key` already defined
  if (isEvent && eventOrCode.key) {
    return eventOrCode.key
  }

  let name = codes[isEvent ? eventOrCode.keyCode || eventOrCode.which : eventOrCode]

  if (Array.isArray(name)) {
    if (isEvent) {
      name = name[eventOrCode.shiftKey ? 1 : 0]
    } else {
      name = name[0]
    }
  }

  return name
}
