import classNames from 'classnames'
import invariant from 'tiny-invariant'
import styles from './text.module.scss'

export type TextProps = React.PropsWithChildren<{
  variant?: 'b1' | 'b2'
  invert?: boolean
  bold?: boolean
  gray?: boolean
  truncate?: boolean
}>
export function Text({
  children,
  variant = 'b2',
  invert,
  bold,
  gray,
  truncate,
}: TextProps) {
  invariant(
    !(invert && gray),
    'invert and gray not allowed together',
  )

  return (
    <span
      className={classNames({
        [styles.text!]: true,
        [styles.b1!]: variant === 'b1',
        [styles.b2!]: variant === 'b2',
        [styles.invert!]: invert,
        [styles.bold!]: bold,
        [styles.gray!]: gray,
        [styles.truncate!]: truncate,
      })}
    >
      {children}
    </span>
  )
}
