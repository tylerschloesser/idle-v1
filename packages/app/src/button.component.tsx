import classNames from 'classnames'
import React from 'react'
import styles from './button.module.scss'

export type ButtonProps = React.PropsWithChildren<{
  onClick(): void
  disabled?: boolean
  className?: string
}>

export function Button({
  onClick,
  disabled = false,
  children,
  className,
}: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, className)}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
