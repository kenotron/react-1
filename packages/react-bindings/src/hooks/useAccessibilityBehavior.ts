import { Accessibility } from '@stardust-ui/accessibility'

import getAccessibility from '../accessibility/getAccessibility'
import { AccessibilityActionHandlers } from '../accessibility/types'

type UseAccessibilityBehaviorOptions<Props> = {
  actionHandlers?: AccessibilityActionHandlers
  mapPropsToBehavior?: () => Props
}

const useAccessibilityBehavior = <Props>(
  behavior: Accessibility<Props>,
  options: UseAccessibilityBehaviorOptions<Props>,
) => {
  const { actionHandlers, mapPropsToBehavior = () => ({}) } = options

  return getAccessibility('Foo', behavior, mapPropsToBehavior(), true, actionHandlers)
}

export default useAccessibilityBehavior
