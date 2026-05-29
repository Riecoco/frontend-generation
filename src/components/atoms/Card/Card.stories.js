import Card from './Card.vue';

export default {
    title: 'Atoms/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        padding: {
            control: { type: 'select' },
            options: ['none', 'sm', 'md', 'lg'],
        },
    },
    args: {
        padding: 'md',
    },
    render: (args) => ({
        components: { Card },
        setup() {
            return { args };
        },
        template: `
          <Card
              :padding="args.padding"
              class="max-w-md"
          >
            Basic card content
          </Card>
        `,
    }),
};

export const Default = {};

export const NoPadding = {
    args: {
        padding: 'none',
    },
};

export const SmallPadding = {
    args: {
        padding: 'sm',
    },
};

export const LargePadding = {
    args: {
        padding: 'lg',
    },
};