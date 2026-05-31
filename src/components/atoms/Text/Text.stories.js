import Text from './Text.vue'

export default {
    title: 'Atoms/Text',
    component: Text,
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
        },
        as: {
            control: {
                type: 'select',
            },
            options: ['p', 'span', 'div', 'label'],
        },
        size: {
            control: {
                type: 'select',
            },
            options: ['xs', 'sm', 'base', 'lg'],
        },
        weight: {
            control: {
                type: 'select',
            },
            options: ['normal', 'medium', 'semibold', 'bold'],
        },
        color: {
            control: {
                type: 'select',
            },
            options: ['default', 'muted', 'primary', 'secondary', 'destructive', 'success'],
        },
    },
    args: {
        text: 'This is default text',
        as: 'p',
        size: 'base',
        weight: 'normal',
        color: 'default',
    },
    render: (args) => ({
        components: {
            Text,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <Text
              :as="args.as"
              :size="args.size"
              :weight="args.weight"
              :color="args.color"
          >
            {{ args.text }}
          </Text>
        `,
    }),
}

export const Default = {}

export const Muted = {
    args: {
        text: 'Muted helper text',
        color: 'muted',
    },
}

export const Primary = {
    args: {
        text: 'Primary text',
        color: 'primary',
        weight: 'medium',
    },
}

export const Destructive = {
    args: {
        text: 'Error message text',
        color: 'destructive',
        size: 'sm',
    },
}

export const Success = {
    args: {
        text: 'Success text',
        color: 'success',
        weight: 'medium',
    },
}

export const Sizes = {
    render: () => ({
        components: {
            Text,
        },
        template: `
          <div class="space-y-2">
            <Text size="xs">Extra small text</Text>
            <Text size="sm">Small text</Text>
            <Text size="base">Base text</Text>
            <Text size="lg">Large text</Text>
          </div>
        `,
    }),
}

export const Weights = {
    render: () => ({
        components: {
            Text,
        },
        template: `
          <div class="space-y-2">
            <Text weight="normal">Normal text</Text>
            <Text weight="medium">Medium text</Text>
            <Text weight="semibold">Semibold text</Text>
            <Text weight="bold">Bold text</Text>
          </div>
        `,
    }),
}

export const Colors = {
    render: () => ({
        components: {
            Text,
        },
        template: `
      <div class="space-y-2">
        <Text color="default">Default color text</Text>
        <Text color="muted">Muted color text</Text>
        <Text color="primary">Primary color text</Text>
        <Text color="secondary">Secondary color text</Text>
        <Text color="destructive">Destructive color text</Text>
        <Text color="success">Success color text</Text>
      </div>
    `,
    }),
}