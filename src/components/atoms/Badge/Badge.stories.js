import Badge from './Badge.vue';

export default {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    variant: {
      control: {type: 'select'},
      options: ['default', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: {type: 'select'},
      options: ['small', 'medium', 'large'],
    },
  },
    args: {
      label: 'Badge',
      variant: 'default',
      size: 'medium',
    },
    render: (args) => ({
      components: { Badge },
      setup() {
        return { args };
      },
      template: `
      <Badge
        :variant="args.variant"
        :size="args.size"
      >
        {{ args.label }}
      </Badge>
    `,
    }),
};

export const Default = {
  args: {
    label: 'Default',
    variant: 'default',
  },
};

export const Secondary = {
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};

export const Success = {
  args: {
    label: 'Approved',
    variant: 'success',
  },
};

export const Warning = {
  args: {
    label: 'Pending',
    variant: 'warning',
  },
};

export const Danger = {
  args: {
    label: 'Denied',
    variant: 'danger',
  },
};

export const AllVariants = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Approved</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="danger">Denied</Badge>
      </div>
    `,
  }),
};

export const AllSizes = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex gap-2 items-center">
        <Badge size="small">Small</Badge>
        <Badge size="medium">Medium</Badge>
        <Badge size="large">Large</Badge>
      </div>
    `,
  }),
};
