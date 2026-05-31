import { fn } from 'storybook/test'
import Button from './Button.vue'

export default {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
        },
        primary: {
            control: 'boolean',
        },
        variant: {
            control: {
                type: 'select',
            },
            options: [null, 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: {
                type: 'select',
            },
            options: ['small', 'medium', 'large'],
        },
        backgroundColor: {
            control: 'color',
        },
    },
    args: {
        label: 'Button',
        primary: false,
        variant: null,
        size: 'medium',
        backgroundColor: null,
        onClick: fn(),
    },
}

export const Primary = {
    args: {
        variant: 'default',
        label: 'Button',
    },
}

export const Secondary = {
    args: {
        variant: 'secondary',
        label: 'Button',
    },
}

export const Large = {
    args: {
        ...Primary.args,
        size: 'large',
        label: 'Button',
    },
}

export const Small = {
    args: {
        ...Primary.args,
        size: 'small',
        label: 'Button',
    },
}

export const Outline = {
    args: {
        variant: 'outline',
        label: 'Cancel',
    },
}

export const Destructive = {
    args: {
        variant: 'destructive',
        label: 'Delete',
    },
}

export const Ghost = {
    args: {
        variant: 'ghost',
        label: 'Ghost',
    },
}

export const Link = {
    args: {
        variant: 'link',
        label: 'Link',
    },
}