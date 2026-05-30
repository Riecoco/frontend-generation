import Input from './Input.vue'

export default {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: 'text',
        },
        type: {
            control: {type: 'select'},
            options: ['text', 'email', 'password', 'number', 'tel', 'search'],
        },
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        invalid: {
            control: 'boolean',
        },
    },
    args: {
        modelValue: '',
        type: 'text',
        placeholder: 'Enter text',
        disabled: false,
        invalid: false,
    },
    render: (args) => ({
        components: {Input},
        setup() {
            return {args}
        },
        template: `
          <Input
              v-model="args.modelValue"
              :type="args.type"
              :placeholder="args.placeholder"
              :disabled="args.disabled"
              :invalid="args.invalid"
          />
        `,
    }),
}

export const Default = {
    args: {
        placeholder: 'Enter text',
    },
}

export const Email = {
    args: {
        type: 'email',
        placeholder: 'Enter email',
    },
}

export const Password = {
    args: {
        type: 'password',
        placeholder: 'Enter password',
    },
}

export const Disabled = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
    },
}

export const Invalid = {
    args: {
        placeholder: 'Invalid input',
        invalid: true,
    },
}