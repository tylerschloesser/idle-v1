import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { ItemIcon } from '../icon.component.js'
import { Text } from '../text.component.js'
import { ItemType } from '../world.js'
import styles from './hand-button-group.module.scss'

export interface HandButtonGroupProps {
  buttons: {
    key: string
    onClick: () => void
    itemType: ItemType
    label: string
    extra?: JSX.Element
  }[]
}

function Button({
  onClick,
  itemType,
  label,
  extra,
}: HandButtonGroupProps['buttons'][0]) {
  const pointerTimeout = useRef<number>()

  const [pointerDown, setPointerDown] =
    useState<boolean>(false)

  useEffect(() => {
    if (!pointerDown) {
      return
    }

    const interval = self.setInterval(() => {
      onClick()
    }, 250)
    return () => {
      self.clearInterval(interval)
    }
  }, [pointerDown])

  return (
    <button
      className={styles['button']}
      onPointerDown={() => {
        invariant(pointerTimeout.current === undefined)
        pointerTimeout.current = self.setTimeout(() => {
          setPointerDown(true)
        }, 100)
      }}
      onPointerLeave={() => {
        self.clearTimeout(pointerTimeout.current)
        pointerTimeout.current = undefined
        if (pointerDown) {
          setPointerDown(false)
        }
      }}
      onPointerUp={() => {
        self.clearTimeout(pointerTimeout.current)
        pointerTimeout.current = undefined
        if (pointerDown) {
          setPointerDown(false)
        } else {
          onClick()
        }
      }}
    >
      <ItemIcon type={itemType} size="1.5em" />
      <Text variant="b1" className={styles['button-label']}>
        {label}
      </Text>
      {extra}
    </button>
  )
}

export function HandButtonGroup({
  buttons,
}: HandButtonGroupProps) {
  return (
    <div
      className={classNames(styles['button-group'], {
        [styles['button-group--scroll']!]:
          buttons.length > 4,
      })}
    >
      {buttons.map(({ key, ...props }) => (
        <Button key={key} {...props} />
      ))}
    </div>
  )
}
