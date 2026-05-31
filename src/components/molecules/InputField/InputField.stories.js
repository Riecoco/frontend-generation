import InputField from './InputField.vue'

export default {
    title: 'Molecules/InputField',
    component: InputField,
    tags: ['autodocs'],
    argTypes: {
        id: {
            control: 'text',
        },
        label: {
            control: 'text',
        },
        modelValue: {
            control: 'text',
        },
        type: {
            control: {
                type: 'select',
            },
            options: ['text', 'email', 'password', 'number', 'tel', 'search'],
        },
        placeholder: {
            control: 'text',
        },
        helpText: {
            control: 'text',
        },
        errorMessage: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
    },
    args: {
        id: 'email',
        label: 'Email address',
        modelValue: '',
        type: 'email',
        placeholder: 'Enter your email',
        helpText: '',
        errorMessage: '',
        disabled: false,
    },
    render: (args) => ({
        components: {
            InputField,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <div class="max-w-sm">
            <InputField
                v-model="args.modelValue"
                :id="args.id"
                :label="args.label"
                :type="args.type"
                :placeholder="args.placeholder"
                :help-text="args.helpText"
                :error-message="args.errorMessage"
                :disabled="args.disabled"
            />
          </div>
        `,
    }),
}

export const Default = {
    args: {
        id: 'email',
        label: 'Email address',
        type: 'email',
        placeholder: 'Enter your email',
    },
}

export const WithHelpText = {
    args: {
        id: 'iban',
        label: 'IBAN',
        placeholder: 'Enter IBAN',
        helpText: 'Use the full IBAN number.',
    },
}

export const WithError = {
    args: {
        id: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        errorMessage: 'Password is required.',
    },
}

export const Disabled = {
    args: {
        id: 'disabled',
        label: 'Disabled field',
        placeholder: 'Disabled input',
        disabled: true,
    },
}