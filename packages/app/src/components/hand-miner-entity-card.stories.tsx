import type { Meta, StoryObj } from '@storybook/react'
import invariant from 'tiny-invariant'
import { Context, IContext } from '../context.js'
import { generateWorld } from '../generate-world.js'
import {
  HomeContext,
  IHomeContext,
} from '../home-context.js'
import { EntityType, ResourceType } from '../world.js'
import { HandMinerEntityCard } from './hand-miner-entity-card.js'

const context: IContext = {
  enqueueHandMineOperation() {},
  enqueueHandAssembleOperation() {},
  cancelHandAssembleOperation() {},
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
  title: 'HandMinerEntityCard',
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

export const Queue: Story = {
  args: {
    entity: {
      ...entity,
      queue: [
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.Coal,
          count: 1,
          ticks: 5,
        },
      ],
    },
  },
}

export const QueueMany: Story = {
  args: {
    entity: {
      ...entity,
      queue: [
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.Coal,
          count: 1,
          ticks: 5,
        },
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.IronOre,
          count: 1,
          ticks: 0,
        },
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.Stone,
          count: 4,
          ticks: 0,
        },
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.CopperOre,
          count: 2,
          ticks: 0,
        },
        {
          id: self.crypto.randomUUID(),
          resourceType: ResourceType.enum.Coal,
          count: 4,
          ticks: 0,
        },
      ],
    },
  },
}
