import invariant from 'tiny-invariant'

export enum IconName {
  House = 'house',
}

export interface IconProps {
  name: IconName
}

export function Icon({ name }: IconProps) {
  let className: string
  switch (name) {
    case IconName.House:
      className = 'fa-house'
      break
    default:
      invariant(false)
  }

  return <span className={`fa ${className}`} />
}
