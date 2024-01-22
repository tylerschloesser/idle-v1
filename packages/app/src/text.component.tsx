import classNames from 'classnames'
import styles from './text.module.scss'

export type TextProps = React.PropsWithChildren<{
  variant?: 'b1'
  invert?: boolean
  bold?: boolean
}>
export function Text({
  children,
  invert,
  bold,
}: TextProps) {
  return (
    <span
      className={classNames({
        [styles.b1!]: true,
        [styles.invert!]: invert,
        [styles.bold!]: bold,
      })}
    >
      {children}
    </span>
  )
}
