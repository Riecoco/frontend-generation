import BaseAvatar from './BaseAvatar.vue'

export default {
    title: 'Atoms/BaseAvatar',
    component: BaseAvatar,
    tags: ['autodocs'],
    argTypes: {
        name: {
            control: 'text',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
}

export const Default = {
    args: {
        name: 'Lucas van Dijk',
        size: 'md',
    },
}

export const Sizes = {
    render: () => ({
        components: {
            BaseAvatar,
        },
        template: `
          <div class="flex items-center gap-4">
            <BaseAvatar
                name="Jan de Vries"
                size="sm"
            />

            <BaseAvatar
                name="Jan de Vries"
                size="md"
            />

            <BaseAvatar
                name="Jan de Vries"
                size="lg"
            />
          </div>
        `,
    }),
}

export const Names = {
    render: () => ({
        components: {
            BaseAvatar,
        },
        template: `
          <div class="flex items-center gap-4">
            <BaseAvatar name="Jan de Vries" />
            <BaseAvatar name="Lucas van Dijk" />
            <BaseAvatar name="John Smith" />
          </div>
        `,
    }),
}