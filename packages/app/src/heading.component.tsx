import invariant from 'tiny-invariant'
import styles from './heading.module.scss'

export type HeadingProps = React.PropsWithChildren<{
  level: 1 | 2 | 3
}>

export function Heading({ level, children }: HeadingProps) {
  switch (level) {
    case 1:
      return <h1 className={styles.h1}>{children}</h1>
    case 2:
      return <h2 className={styles.h2}>{children}</h2>
    case 3:
      return <h3 className={styles.h3}>{children}</h3>
    default: {
      invariant(false)
    }
  }
}

export function Heading1(
  props: Omit<HeadingProps, 'level'>,
) {
  return <Heading {...props} level={1} />
}

export function Heading2(
  props: Omit<HeadingProps, 'level'>,
) {
  return <Heading {...props} level={2} />
}

export function Heading3(
  props: Omit<HeadingProps, 'level'>,
) {
  return <Heading {...props} level={3} />
}
