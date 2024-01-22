import React from 'react'
import styles from './button.module.scss'

export type ButtonProps = React.PropsWithChildren<{
  onClick(): void
  disabled?: boolean
}>

export function Button({
  onClick,
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      className={styles.button}
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
