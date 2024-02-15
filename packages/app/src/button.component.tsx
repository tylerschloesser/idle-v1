import classNames from 'classnames'
import React from 'react'
import invariant from 'tiny-invariant'
import styles from './button.module.scss'
import { Text } from './text.component.js'

export type ButtonProps = React.PropsWithChildren<{
  onClick(): void
  disabled?: boolean
  className?: string
  label?: string
}>

export function Button({
  onClick,
  disabled = false,
  children,
  className,
  label,
}: ButtonProps) {
  invariant((children || label) && !(children && label))

  return (
    <button
      className={classNames(styles.button, className)}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      disabled={disabled}
    >
      {label ? <Text invert>{label}</Text> : children}
    </button>
  )
}
