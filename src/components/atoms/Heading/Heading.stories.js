import Heading from './Heading.vue'

export default {
    title: 'Atoms/Heading',
    component: Heading,
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
        },
        level: {
            control: {
                type: 'select',
            },
            options: [1, 2, 3, 4, 5, 6],
        },
        size: {
            control: {
                type: 'select',
            },
            options: ['auto', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
        },
        weight: {
            control: {
                type: 'select',
            },
            options: ['auto', 'medium', 'semibold', 'bold'],
        },
        color: {
            control: {
                type: 'select',
            },
            options: ['default', 'muted', 'primary', 'secondary'],
        },
    },
    args: {
        text: 'Heading',
        level: 1,
        size: 'auto',
        weight: 'auto',
        color: 'default',
    },
    render: (args) => ({
        components: {
            Heading,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <Heading
              :level="args.level"
              :size="args.size"
              :weight="args.weight"
              :color="args.color"
          >
            {{ args.text }}
          </Heading>
        `,
    }),
}

export const H1 = {
    args: {
        text: 'Heading 1',
        level: 1,
    },
}

export const H2 = {
    args: {
        text: 'Heading 2',
        level: 2,
    },
}

export const H3 = {
    args: {
        text: 'Heading 3',
        level: 3,
    },
}

export const Primary = {
    args: {
        text: 'Primary heading',
        level: 2,
        color: 'primary',
    },
}

export const Muted = {
    args: {
        text: 'Muted heading',
        level: 3,
        color: 'muted',
    },
}

export const AllLevels = {
    render: () => ({
        components: {
            Heading,
        },
        template: `
          <div class="space-y-4">
            <Heading :level="1">Heading 1</Heading>
            <Heading :level="2">Heading 2</Heading>
            <Heading :level="3">Heading 3</Heading>
            <Heading :level="4">Heading 4</Heading>
            <Heading :level="5">Heading 5</Heading>
            <Heading :level="6">Heading 6</Heading>
          </div>
        `,
    }),
}

export const AllSizes = {
    render: () => ({
        components: {
            Heading,
        },
        template: `
          <div class="space-y-4">
            <Heading size="sm">Small heading</Heading>
            <Heading size="md">Medium heading</Heading>
            <Heading size="lg">Large heading</Heading>
            <Heading size="xl">Extra large heading</Heading>
            <Heading size="2xl">2XL heading</Heading>
            <Heading size="3xl">3XL heading</Heading>
          </div>
        `,
    }),
}

export const Colors = {
    render: () => ({
        components: {
            Heading,
        },
        template: `
          <div class="space-y-4">
            <Heading color="default">Default heading</Heading>
            <Heading color="muted">Muted heading</Heading>
            <Heading color="primary">Primary heading</Heading>
            <Heading color="secondary">Secondary heading</Heading>
          </div>
        `,
    }),
}