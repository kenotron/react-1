import { Accessibility } from '@stardust-ui/accessibility'
import * as React from 'react'

import getAccessibility from '../accessibility/getAccessibility'
import { AccessibilityBehavior, AccessibilityActionHandlers } from '../accessibility/types'

type UseAccessibilityBehaviorOptions<Props> = {
  actionHandlers?: AccessibilityActionHandlers
  mapPropsToBehavior?: () => Props
}

const enhanceElement = (
  slotName: string,
  element: React.ReactElement,
  definition: AccessibilityBehavior,
): React.ReactElement => {
  const finalProps = {
    ...definition.attributes[slotName],
    ...element.props,
  }

  if (definition.keyHandlers[slotName]) {
    const onKeyDown = (e: React.KeyboardEvent, ...args: any[]) => {
      definition.keyHandlers[slotName].onKeyDown(e)
      if (element.props.onKeyDown) {
        element.props.onKeyDown(e, ...args)
      }
    }

    finalProps.onKeyDown = onKeyDown
  }

  return React.cloneElement(element, finalProps)
}

const useAccessibilityBehavior = <Props>(
  behavior: Accessibility<Props>,
  options: UseAccessibilityBehaviorOptions<Props>,
) => {
  const { actionHandlers, mapPropsToBehavior = () => ({}) } = options
  const latestDefinition = React.useRef<AccessibilityBehavior>(null)

  latestDefinition.current = getAccessibility(
    'Foo',
    behavior,
    mapPropsToBehavior(),
    true,
    actionHandlers,
  )

  return React.useCallback(
    (slotName: string, element: React.ReactElement) =>
      enhanceElement(slotName, element, latestDefinition.current),
    [],
  )
}

export default useAccessibilityBehavior
