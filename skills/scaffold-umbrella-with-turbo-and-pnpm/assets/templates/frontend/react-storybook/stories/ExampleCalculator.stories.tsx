import type { Meta, StoryObj } from '@storybook/react';
import { ExampleCalculator } from '@umbrella/example-calculator-ui';

const meta = {
  title: 'Example/Calculator',
  component: ExampleCalculator,
} satisfies Meta<typeof ExampleCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
