import type { Meta, StoryObj } from '@storybook/react'
import invariant from 'tiny-invariant'
import { Context, IContext } from '../context.js'
import { generateWorld } from '../generate-world.js'
import {
  HomeContext,
  IHomeContext,
} from '../home-context.js'
import { EntityType } from '../world.js'
import { HandMinerEntityCard } from './hand-miner-entity-card.js'

const context: IContext = {
  enqueueHandMineOperation() {},
  setEntityVisible() {},
  world: await generateWorld('test'),
}

const block = Object.values(context.world.blocks).at(0)
invariant(block)

const groupId = Object.keys(block.groupIds).at(0)
invariant(groupId)

const group = context.world.groups[groupId]
invariant(group)

const entity = Object.values(context.world.entities).find(
  (entity) => entity.type === EntityType.enum.HandMiner,
)
invariant(entity?.type === EntityType.enum.HandMiner)

const homeContext: IHomeContext = { block }

const meta: Meta<typeof HandMinerEntityCard> = {
  component: HandMinerEntityCard,
  render: (args) => (
    <Context.Provider value={context}>
      <HomeContext.Provider value={homeContext}>
        <HandMinerEntityCard {...args} />
      </HomeContext.Provider>
    </Context.Provider>
  ),
}
export default meta

type Story = StoryObj<typeof HandMinerEntityCard>

export const Basic: Story = {
  args: { entity },
}
