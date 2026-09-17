import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@umbrella/design-system';

const meta = {
  title: 'Design system/Button',
  component: Button,
  args: { children: 'Add' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
