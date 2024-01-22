import React from 'react'
import styles from './button.module.scss'

export type ButtonProps = React.PropsWithChildren<{
  onClick(): void
}>

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  )
}
