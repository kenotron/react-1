import { shallow } from 'enzyme'
import * as React from 'react'

import useAccessibilityBehavior from '../../src/hooks/useAccessibilityBehavior'
import { Accessibility } from '@stardust-ui/accessibility'
import keyboardKey from '@stardust-ui/keyboard-key'

type TestBehaviorProps = {
  disabled: boolean
}

const testBehavior: Accessibility<TestBehaviorProps> = props => ({
  attributes: {
    root: {
      'aria-disabled': props.disabled,
      tabIndex: 1,
    },
    img: {
      'aria-label': 'Pixel',
      role: 'presentation',
    },
  },
  keyActions: {
    root: {
      click: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowDown }],
      },
    },
  },
})

type TestComponentProps = {
  disabled?: boolean
  onClick?: (e: React.KeyboardEvent<HTMLDivElement>, slotName: string) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

const TestComponent: React.FunctionComponent<TestComponentProps> = props => {
  const wrap = useAccessibilityBehavior(testBehavior, {
    mapPropsToBehavior: () => ({
      disabled: props.disabled,
    }),
    actionHandlers: {
      click: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (props.onClick) props.onClick(e, 'root')
      },
    },
  })

  return wrap(
    'root',
    <div onKeyDown={props.onKeyDown}>
      {wrap(
        'img',
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" />,
      )}
    </div>,
  )
}

describe('useAccessibilityBehavior', () => {
  it('sets attributes', () => {
    const wrapper = shallow(<TestComponent />)

    expect(wrapper.find('div').prop('tabIndex')).toBe(1)
    expect(wrapper.find('img').prop('role')).toBe('presentation')
  })

  it('adds event handlers', () => {
    const onKeyDown = jest.fn()
    const onClick = jest.fn()
    const wrapper = shallow(<TestComponent onClick={onClick} onKeyDown={onKeyDown} />)

    wrapper
      .find('div')
      .simulate('click')
      .simulate('keydown', {
        keyCode: keyboardKey.ArrowDown,
      })

    expect(onKeyDown).toBeCalledTimes(1)
    expect(onKeyDown).toBeCalledWith(
      expect.objectContaining({
        keyCode: keyboardKey.ArrowDown,
      }),
    )

    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(
      expect.objectContaining({
        keyCode: keyboardKey.ArrowDown,
      }),
      'root',
    )
  })
})
