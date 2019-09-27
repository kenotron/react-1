import { KeyActions } from '@stardust-ui/accessibility'
import keyboardKey from '@stardust-ui/keyboard-key'
import * as React from 'react'

import shouldHandleOnKeys from './shouldHandleOnKeys'
import { AccessibilityActionHandlers, AccessibilityKeyHandlers } from './types'

const rtlKeyMap = {
  [keyboardKey.ArrowRight]: keyboardKey.ArrowLeft,
  [keyboardKey.ArrowLeft]: keyboardKey.ArrowRight,
}

/**
 * Assigns onKeyDown handler to the slot element, based on Component's actions
 * and keys mappings defined in Accessibility behavior
 * @param {AccessibilityActionHandlers} componentActionHandlers Actions handlers defined in a component.
 * @param {KeyActions} behaviorKeyActions Mappings of actions and keys defined in Accessibility behavior.
 * @param {boolean} isRtlEnabled Indicates if Left and Right arrow keys should be swapped in RTL mode.
 */
const getKeyDownHandlers = (
  componentActionHandlers: AccessibilityActionHandlers,
  behaviorKeyActions: KeyActions,
  isRtlEnabled?: boolean,
): AccessibilityKeyHandlers => {
  const keyHandlers = {}

  if (!componentActionHandlers || !behaviorKeyActions) return keyHandlers

  for (const componentPart in behaviorKeyActions) {
    const componentPartKeyAction = behaviorKeyActions[componentPart]
    const componentHandlers = Object.keys(componentActionHandlers)
    const handledActions = Object.keys(componentPartKeyAction).filter(
      actionName => componentHandlers.indexOf(actionName) !== -1,
    )
    if (!handledActions.length) continue

    // @ts-ignore FIX ME
    keyHandlers[componentPart] = {
      onKeyDown: (event: React.KeyboardEvent) => {
        handledActions.forEach(actionName => {
          let keyCombinations = componentPartKeyAction[actionName].keyCombinations

          if (isRtlEnabled) {
            keyCombinations = keyCombinations.map(keyCombination => {
              const keyToRtlKey = rtlKeyMap[keyCombination.keyCode]
              if (keyToRtlKey) {
                keyCombination.keyCode = keyToRtlKey
              }
              return keyCombination
            })
          }

          if (shouldHandleOnKeys(event, keyCombinations)) {
            componentActionHandlers[actionName](event)
          }
        })
      },
    }
  }

  return keyHandlers
}

export default getKeyDownHandlers
