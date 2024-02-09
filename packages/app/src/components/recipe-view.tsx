import { Recipe } from '../world.js'
import styles from './recipe-view.module.scss'

export interface RecipeViewProps {
  recipe: Recipe
}

export function RecipeView({ recipe }: RecipeViewProps) {
  return <div className={styles['recipe-view']}>TODO</div>
}
