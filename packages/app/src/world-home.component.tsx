import {
  faArrowDownToBracket,
  faArrowUpFromBracket,
  faBolt,
  faHeart,
  faPercent,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useContext } from 'react'
import invariant from 'tiny-invariant'
import { Button } from './button.component.js'
import { TICKS_PER_SECOND } from './const.js'
import { Context } from './context.js'
import { Heading3 } from './heading.component.js'
import {
  countInventory,
  inventoryAdd,
  iterateInventory,
} from './inventory.js'
import { ItemLabel } from './item-label.component.js'
import { Text, TextProps } from './text.component.js'
import { formatItemCount } from './util.js'
import styles from './world-home.module.scss'
import {
  AssemblerRecipeItemType,
  Condition,
  Consumption,
  EntityGroupType,
  EntityType,
  FurnaceRecipeItemType,
  Inventory,
  ItemType,
  Production,
  ResourceType,
  World,
} from './world.js'

interface ToggleEntityCountProps {
  built: number
  available: number
  onAdd(): void
  onRemove(): void
}

function ToggleEntityCount({
  built,
  available,
  onAdd,
  onRemove,
}: ToggleEntityCountProps) {
  return (
    <div className={styles['toggle-entity-count']}>
      <Button onClick={onRemove} disabled={built === 0}>
        &#xFF0D;
      </Button>
      <div className={styles['toggle-entity-count__built']}>
        <Text>{built}</Text>
      </div>
      <Button onClick={onAdd} disabled={available === 0}>
        &#xFF0B;
      </Button>
    </div>
  )
}

function mapInventory(
  inventory: Inventory,
  cb: (itemType: ItemType, count: number) => JSX.Element,
): JSX.Element[] {
  return Object.entries(inventory)
    .filter(
      // Remove entities from inventory.
      // Number of available entities is already shown above.
      ([itemType]) =>
        !EntityType.safeParse(itemType).success,
    )
    .map((entry) => {
      const itemType = ItemType.parse(entry[0])
      const count = entry[1].count
      return cb(itemType, count)
    })
}

function formatItemPerSecond(
  count: number,
  window: number,
): string | null {
  if (count === 0) {
    return null
  }
  return `${((count / window) * TICKS_PER_SECOND).toFixed(1)}/s`
}

function formatPowerPerSecond(
  power: number,
  window: number,
): string | null {
  if (power === 0) {
    return null
  }
  return `${(power / window).toFixed()}/s`
}

function formatPowerSatisfaction(
  production: number,
  consumption: number,
): JSX.Element {
  if (consumption === 0) {
    return <>&infin;</>
  }
  const s = production / consumption
  return <>{`${Math.floor(s * 100)}%`}</>
}

function formatSatisfaction(
  production: number,
  consumption: number,
): JSX.Element {
  if (consumption === 0) {
    return <>&infin;</>
  }
  const s = production / consumption
  return <>{`${(s * 100).toFixed()}%`}</>
}

function Stats() {
  const { world } = useContext(Context)

  const itemTypes = new Set<ItemType>()

  const production: Production = {
    power: 0,
    items: {},
  }
  for (const sample of world.stats.production) {
    production.power += sample.power
    for (const [itemType, count] of iterateInventory(
      sample.items,
    )) {
      itemTypes.add(itemType)
      inventoryAdd(production.items, itemType, count, 1)
    }
  }

  const consumption: Consumption = {
    power: 0,
    items: {},
  }
  for (const sample of world.stats.consumption) {
    consumption.power += sample.power
    for (const [itemType, count] of iterateInventory(
      sample.items,
    )) {
      itemTypes.add(itemType)
      inventoryAdd(consumption.items, itemType, count, 1)
    }
  }

  return (
    <div className={styles.stats}>
      <div />
      <FontAwesomeIcon
        icon={faArrowDownToBracket}
        className={styles['stats__header']}
      />
      <FontAwesomeIcon
        icon={faArrowUpFromBracket}
        className={styles['stats__header']}
      />
      <FontAwesomeIcon
        icon={faPercent}
        className={styles['stats__header']}
      />
      <div className={styles['power-label']}>
        <FontAwesomeIcon
          icon={faBolt}
          fixedWidth
          fontSize="1.2em"
        />
        <Text gray variant="b1">
          Power
        </Text>
      </div>
      <Text>
        {formatPowerPerSecond(
          production.power,
          world.stats.window,
        )}
      </Text>
      <Text>
        {formatPowerPerSecond(
          consumption.power,
          world.stats.window,
        )}
      </Text>
      <Text>
        {formatPowerSatisfaction(
          production.power,
          consumption.power,
        )}
      </Text>
      {[...itemTypes].map((itemType) => (
        <Fragment key={itemType}>
          <ItemLabel type={itemType} />
          <Text>
            {formatItemPerSecond(
              production.items[itemType]?.count ?? 0,
              world.stats.window,
            )}
          </Text>
          <Text>
            {formatItemPerSecond(
              consumption.items[itemType]?.count ?? 0,
              world.stats.window,
            )}
          </Text>
          <Text>
            {formatSatisfaction(
              production.items[itemType]?.count ?? 0,
              consumption.items[itemType]?.count ?? 0,
            )}
          </Text>
        </Fragment>
      ))}
    </div>
  )
}

function formatCondition(
  count: number,
  condition: Condition,
): JSX.Element {
  let color: TextProps['color'] = 'green100'
  if (condition < 0.2) {
    color = 'red100'
  } else if (condition < 0.5) {
    color = 'yellow100'
  }
  return (
    <Text variant="b1" color={color} bold>
      {(() => {
        if (count === 0) {
          return null
        }
        return `${Math.ceil(condition * 100)}%`
      })()}
    </Text>
  )
}

function StoneFurnaceConfig() {
  const { world, buildEntity, destroyEntity } =
    useContext(Context)

  const available = countInventory(
    world.inventory,
    ItemType.enum.StoneFurnace,
  )

  const groups = Object.entries(
    world.groups[EntityGroupType.enum.StoneFurnace],
  ).map(([recipeItemType, group]) => ({
    recipeItemType:
      FurnaceRecipeItemType.parse(recipeItemType),
    built: group.count,
    condition: group.condition,
    entity: {
      type: EntityType.enum.StoneFurnace,
      recipeItemType:
        FurnaceRecipeItemType.parse(recipeItemType),
    },
  }))

  return groups.map(
    ({ recipeItemType, built, condition, entity }) => (
      <Fragment key={recipeItemType}>
        <ItemLabel type={recipeItemType} />
        {formatCondition(built, condition)}
        <ToggleEntityCount
          onAdd={() => buildEntity(entity)}
          onRemove={() => destroyEntity(entity)}
          built={built}
          available={available}
        />
      </Fragment>
    ),
  )
}

export function BurnerMiningDrillConfig() {
  const { world, buildEntity, destroyEntity } =
    useContext(Context)

  const available = countInventory(
    world.inventory,
    ItemType.enum.BurnerMiningDrill,
  )

  const groups = Object.entries(
    world.groups[EntityGroupType.enum.BurnerMiningDrill],
  ).map(([resourceType, group]) => ({
    resourceType: ResourceType.parse(resourceType),
    built: group.count,
    condition: group.condition,
    entity: {
      type: EntityType.enum.BurnerMiningDrill,
      resourceType: ResourceType.parse(resourceType),
    },
  }))

  return groups.map(
    ({ resourceType, built, condition, entity }) => (
      <Fragment key={resourceType}>
        <ItemLabel type={resourceType} />
        {formatCondition(built, condition)}
        <ToggleEntityCount
          onAdd={() => buildEntity(entity)}
          onRemove={() => destroyEntity(entity)}
          built={built}
          available={available}
        />
      </Fragment>
    ),
  )
}

function AssemblerConfig() {
  const { world, buildEntity, destroyEntity } =
    useContext(Context)

  const available = countInventory(
    world.inventory,
    ItemType.enum.Assembler,
  )

  const groups = Object.entries(
    world.groups[EntityGroupType.enum.Assembler],
  ).map(([recipeItemType, group]) => ({
    recipeItemType:
      AssemblerRecipeItemType.parse(recipeItemType),
    built: group.count,
    condition: group.condition,
    entity: {
      type: EntityType.enum.Assembler,
      recipeItemType:
        AssemblerRecipeItemType.parse(recipeItemType),
    },
  }))

  return groups.map(
    ({ recipeItemType, built, condition, entity }) => (
      <Fragment key={recipeItemType}>
        <ItemLabel type={recipeItemType} />
        {formatCondition(built, condition)}
        <ToggleEntityCount
          onAdd={() => buildEntity(entity)}
          onRemove={() => destroyEntity(entity)}
          built={built}
          available={available}
        />
      </Fragment>
    ),
  )
}

function OtherConfig() {
  const { world, buildEntity, destroyEntity } =
    useContext(Context)

  const groups = Object.entries(
    world.groups[EntityGroupType.enum.Other],
  ).map(([entityType, group]) => ({
    entityType: EntityType.parse(entityType),
    built: group.count,
    condition: group.condition,
    available: countInventory(
      world.inventory,
      EntityType.parse(entityType),
    ),
    entity: (() => {
      switch (EntityType.parse(entityType)) {
        case EntityType.enum.Generator:
          return { type: EntityType.enum.Generator }
        case EntityType.enum.Lab:
          return { type: EntityType.enum.Lab }
        default:
          invariant(false)
      }
    })(),
  }))

  return groups.map(
    ({
      entityType,
      built,
      condition,
      entity,
      available,
    }) => (
      <Fragment key={entityType}>
        <ItemLabel type={entityType} />
        {formatCondition(built, condition)}
        <ToggleEntityCount
          onAdd={() => buildEntity(entity)}
          onRemove={() => destroyEntity(entity)}
          built={built}
          available={available}
        />
      </Fragment>
    ),
  )
}

function EntityGroupTypeLabel({
  groupType,
}: {
  groupType: EntityGroupType
}) {
  switch (groupType) {
    case EntityGroupType.enum.StoneFurnace:
      return (
        <ItemLabel
          type={EntityType.enum.StoneFurnace}
          entity
        />
      )
    case EntityGroupType.enum.BurnerMiningDrill:
      return (
        <ItemLabel
          type={EntityType.enum.BurnerMiningDrill}
          entity
        />
      )
    case EntityGroupType.enum.Assembler:
      return (
        <ItemLabel
          type={EntityType.enum.Assembler}
          entity
        />
      )
    case EntityGroupType.enum.Other:
      return (
        <span>
          <FontAwesomeIcon icon={faBolt} fixedWidth />
          <Text variant="b2">Power</Text>
        </span>
      )
  }
}

function mapEntityGroupTypes(
  world: World,
  cb: (
    groupType: EntityGroupType,
    i: number,
  ) => JSX.Element,
) {
  const result: JSX.Element[] = []
  let i = 0
  for (const groupType of Object.keys(world.groups)) {
    result.push(cb(EntityGroupType.parse(groupType), i++))
  }
  return result
}

export function WorldHome() {
  const { world } = useContext(Context)

  return (
    <>
      <Heading3>Entities</Heading3>
      {mapEntityGroupTypes(world, (groupType, i) => (
        <Fragment key={groupType}>
          {i !== 0 && <div className={styles.divider} />}
          <div className={styles['entity-group-type']}>
            <EntityGroupTypeLabel groupType={groupType} />
          </div>
          <div className={styles['entity-group-config']}>
            {(() => {
              // prettier-ignore
              switch (groupType) {
                case EntityGroupType.enum.StoneFurnace: {
                  return <StoneFurnaceConfig />
                }
                case EntityGroupType.enum.BurnerMiningDrill: {
                  return <BurnerMiningDrillConfig />
                }
                case EntityGroupType.enum.Assembler: {
                  return <AssemblerConfig />
                }
                case EntityGroupType.enum.Other: {
                  return <OtherConfig />
                }
                default: {
                  invariant(false)
                }
              }
            })()}
          </div>
        </Fragment>
      ))}

      <Heading3>Stats</Heading3>
      <Stats />

      <Heading3>Inventory</Heading3>
      <div className={styles['inventory-grid']}>
        {mapInventory(
          world.inventory,
          (itemType, count) => (
            <Fragment key={itemType}>
              <ItemLabel type={itemType} />
              <Text>{formatItemCount(count)}</Text>
            </Fragment>
          ),
        )}
      </div>
    </>
  )
}
