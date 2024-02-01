import classNames from 'classnames'
import invariant from 'tiny-invariant'
import styles from './text.module.scss'

export type TextProps = React.PropsWithChildren<{
  variant?: 'b1' | 'b2'
  invert?: boolean
  bold?: boolean
  gray?: boolean
  truncate?: boolean
  className?: string
  color?: 'green100' | 'yellow100' | 'red100'
}>

export function Text({
  children,
  variant = 'b2',
  invert,
  bold,
  gray,
  truncate,
  className,
  color,
}: TextProps) {
  invariant(
    !(invert && gray),
    'invert and gray not allowed together',
  )

  return (
    <span
      className={classNames(
        {
          [styles.text!]: true,
          [styles.b1!]: variant === 'b1',
          [styles.b2!]: variant === 'b2',
          [styles.invert!]: invert,
          [styles.bold!]: bold,
          [styles.gray!]: gray,
          [styles.truncate!]: truncate,
          [styles.green100!]: color === 'green100',
          [styles.yellow100!]: color === 'yellow100',
          [styles.red100!]: color === 'red100',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
