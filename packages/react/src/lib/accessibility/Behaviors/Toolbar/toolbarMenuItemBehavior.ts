import { Accessibility, AccessibilityAttributes } from '../../types'
import { IS_FOCUSABLE_ATTRIBUTE } from '../../FocusZone/focusUtilities'
import * as keyboardKey from 'keyboard-key'
// TODO: extend menuItemBehavior and ignore vertical
/**
 * @description
 * The behavior is designed for particular structure of menu item. The item consists of root element and anchor inside the root element.
 *
 * @specification
 * Adds role 'presentation' to 'wrapper' slot.
 * Adds role 'menuitem' to 'root' slot.
 * Adds attribute 'tabIndex=0' to 'root' slot.
 * Adds attribute 'data-is-focusable=false' to 'root' slot if 'disabled' property is true. Sets the attribute to 'true' otherwise.
 * Adds attribute 'aria-label' based on the property 'aria-label' to 'root' slot.
 * Adds attribute 'aria-labelledby' based on the property 'aria-labelledby' to 'root' slot.
 * Adds attribute 'aria-describedby' based on the property 'aria-describedby' to 'root' slot.
 * Adds attribute 'aria-expanded=true' based on the property 'menuOpen' if the component has 'menu' property to 'root' slot.
 * Adds attribute 'aria-haspopup=true' to 'root' slot if 'menu' property is set.
 * Adds attribute 'aria-disabled=true' to 'root' slot based on the property 'disabled'. This can be overriden by providing 'aria-disabled' property directly to the component.
 * Triggers 'performClick' action with 'Enter' or 'Spacebar' on 'root'.
 * Triggers 'closeMenuAndFocusTrigger' action with 'Escape' on 'wrapper'.
 * Triggers 'closeAllMenusAndFocusNextParentItem' action with 'ArrowRight' on 'wrapper'.
 * Triggers 'closeMenu' action with 'ArrowLeft' on 'wrapper'.
 * Triggers 'openMenu' action with 'ArrowRight' on 'wrapper'.
 */
const toolbarMenuItemBehavior: Accessibility<ToolbarMenuItemBehaviorProps> = props => ({
  attributes: {
    wrapper: {
      role: 'presentation',
    },
    root: {
      role: 'menuitem',
      tabIndex: 0,
      'aria-expanded': props.menu ? props.menuOpen || false : undefined,
      'aria-haspopup': props.menu ? 'true' : undefined,
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
      'aria-describedby': props['aria-describedby'],
      'aria-disabled': props.disabled,
      [IS_FOCUSABLE_ATTRIBUTE]: !props.disabled,
    },
  },

  keyActions: {
    root: {
      performClick: {
        keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: keyboardKey.Spacebar }],
      },
    },
    wrapper: {
      closeAllMenus: {
        keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: keyboardKey.Spacebar }],
      },
      closeAllMenusAndFocusNextParentItem: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowRight }],
      },
      closeMenuAndFocusTrigger: {
        keyCombinations: [{ keyCode: keyboardKey.Escape }],
      },
      closeMenu: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowLeft }],
      },
      openMenu: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowRight }],
      },
    },
  },
})

export default toolbarMenuItemBehavior

export type ToolbarMenuItemBehaviorProps = {
  /** Indicated if menu item has submenu. */
  menu?: boolean | object
  /** Defines if submenu is opened. */
  menuOpen?: boolean
  /** If a menu item can is currently unable to be interacted with. */
  disabled?: boolean
} & Pick<AccessibilityAttributes, 'aria-label' | 'aria-labelledby' | 'aria-describedby'>