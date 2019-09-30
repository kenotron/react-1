import { FocusZoneMode, FocusZoneDefinition } from '@stardust-ui/accessibility'
import {
  AccessibilityBehavior,
  AccessibilityActionHandlers,
  deprecated_getAccessibility as getAccessibility,
} from '@stardust-ui/react-bindings'
import * as React from 'react'
import * as _ from 'lodash'

import callable from './callable'
import getElementType from './getElementType'
import getUnhandledProps from './getUnhandledProps'
import logProviderMissingWarning from './providerMissingHandler'
import {
  ComponentStyleFunctionParam,
  ComponentVariablesObject,
  ComponentSlotClasses,
  ComponentSlotStylesPrepared,
  ThemePrepared,
  ComponentSlotStylesInput,
} from '../themes/types'
import { Props, ProviderContextPrepared } from '../types'
import { emptyTheme } from './mergeThemes'
import { FocusZoneProps, FocusZone } from './accessibility/FocusZone'
import { FOCUSZONE_WRAP_ATTRIBUTE } from './accessibility/FocusZone/focusUtilities'
import Debug, { isEnabled as isDebugEnabled } from './debug'
import resolveComponentStyling from '@stardust-ui/react-bindings/src/styles/resolveComponentStyling'

export interface RenderResultConfig<P> {
  ElementType: React.ElementType<P>
  classes: ComponentSlotClasses
  unhandledProps: Props
  variables: ComponentVariablesObject
  styles: ComponentSlotStylesPrepared
  accessibility: AccessibilityBehavior
  rtl: boolean
  theme: ThemePrepared
}

export type RenderComponentCallback<P> = (config: RenderResultConfig<P>) => any

export interface RenderConfig<P> {
  className?: string
  defaultProps?: { [key: string]: any }
  displayName: string
  handledProps: string[]
  props: Record<string, any>
  actionHandlers: AccessibilityActionHandlers
  render: RenderComponentCallback<P>
  saveDebug: (debug: Debug | null) => void
}

/**
 * This function provides compile-time type checking for the following:
 * - if FocusZone implements FocusZone interface,
 * - if FocusZone properties extend FocusZoneProps, and
 * - if the passed properties extend FocusZoneProps.
 *
 * Should the FocusZone implementation change at any time, this function should provide a compile-time guarantee
 * that the new implementation is backwards compatible with the old implementation.
 */
function wrapInGenericFocusZone<
  COMPONENT_PROPS extends FocusZoneProps,
  PROPS extends COMPONENT_PROPS,
  COMPONENT extends FocusZone & React.Component<COMPONENT_PROPS>
>(
  FocusZone: { new (...args: any[]): COMPONENT },
  props: PROPS | undefined,
  children: React.ReactNode,
) {
  props[FOCUSZONE_WRAP_ATTRIBUTE] = true
  return <FocusZone {...props}>{children}</FocusZone>
}

const renderWithFocusZone = <P extends {}>(
  render: RenderComponentCallback<P>,
  focusZoneDefinition: FocusZoneDefinition,
  config: RenderResultConfig<P>,
): any => {
  if (focusZoneDefinition.mode === FocusZoneMode.Wrap) {
    return wrapInGenericFocusZone(
      FocusZone,
      {
        ...focusZoneDefinition.props,
        isRtl: config.rtl,
      },
      render(config),
    )
  }
  if (focusZoneDefinition.mode === FocusZoneMode.Embed) {
    const originalElementType = config.ElementType
    config.ElementType = FocusZone as any
    config.unhandledProps = { ...config.unhandledProps, ...focusZoneDefinition.props }
    config.unhandledProps.as = originalElementType
    config.unhandledProps.isRtl = config.rtl
  }
  return render(config)
}

const resolveStyles = (
  styles: ComponentSlotStylesInput,
  styleParam: ComponentStyleFunctionParam,
): ComponentSlotStylesPrepared => {
  return Object.keys(styles).reduce(
    (acc, next) => ({ ...acc, [next]: callable(styles[next])(styleParam) }),
    {},
  )
}

const renderComponent = <P extends {}>(
  config: RenderConfig<P>,
  context?: ProviderContextPrepared,
): React.ReactElement<P> => {
  const {
    className,
    defaultProps,
    displayName,
    handledProps,
    props,
    state,
    actionHandlers,
    render,
    saveDebug = () => {},
  } = config

  if (_.isEmpty(context)) {
    logProviderMissingWarning()
  }

  const { disableAnimations = false, renderer = null, rtl = false, theme = emptyTheme } =
    context || {}

  const ElementType = getElementType({ defaultProps }, props) as React.ReactType<P>
  const unhandledProps = getUnhandledProps({ handledProps }, props)
  const stateAndProps = { ...state, ...props }

  const accessibility: AccessibilityBehavior = getAccessibility(
    displayName,
    props.accessibility,
    stateAndProps,
    rtl,
    actionHandlers,
  )

  const [classes, styles, variables] = resolveComponentStyling({
    className,
    displayName,
    disableAnimations,
    props: stateAndProps,
    renderer,
    theme,
    rtl,
  })

  const resolvedConfig: RenderResultConfig<P> = {
    ElementType,
    unhandledProps,
    classes,
    variables,
    styles,
    accessibility,
    rtl,
    theme,
  }

  if (accessibility.focusZone) {
    return renderWithFocusZone(render, accessibility.focusZone, resolvedConfig)
  }

  // conditionally add sources for evaluating debug information to component
  if (isDebugEnabled) {
    saveDebug(
      new Debug({
        componentName: displayName,
        themes: context ? context.originalThemes : [],
        instanceStylesOverrides: props.styles,
        instanceVariablesOverrides: props.variables,
        resolveStyles: styles =>
          resolveStyles(styles, {
            displayName,
            props,
            variables,
            theme,
            rtl,
            disableAnimations,
          }),
        resolveVariables: variables => callable(variables)(theme.siteVariables),
      }),
    )
  }

  return render(resolvedConfig)
}

export default renderComponent
