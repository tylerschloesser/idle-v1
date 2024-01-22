import styles from './text.module.scss'

export type TextProps = React.PropsWithChildren<{
  variant?: 'b1'
}>
export function Text({ children }: TextProps) {
  return <span className={styles.b1}>{children}</span>
}
