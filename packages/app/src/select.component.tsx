import styles from './select.module.scss'

export interface SelectProps<T extends string> {
  placeholder: string
  value: T | null
  onChange(value: T): void
  options: T[]
  parse(data: unknown): T
}
export function Select<T extends string>({
  placeholder,
  value,
  onChange,
  options,
  parse,
}: SelectProps<T>) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        onChange(parse(e.target.value))
      }}
      className={styles.select}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}
