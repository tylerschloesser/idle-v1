import React from 'react'
import styles from './checkbox.module.scss'
import { Text } from './text.component.js'

export type CheckboxProps = React.PropsWithChildren<{
  checked: boolean
  onChange(checked: boolean): void
}>

export function Checkbox({
  checked,
  onChange,
  children,
}: CheckboxProps) {
  return (
    <label className={styles.label}>
      <Text invert bold>
        {children}
      </Text>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </label>
  )
}
