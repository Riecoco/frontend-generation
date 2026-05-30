import InfoRow from './InfoRow.vue'

export default {
    title: 'Molecules/InfoRow',
    component: InfoRow,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
        },
        value: {
            control: 'text',
        },
    },
    args: {
        label: 'BSN',
        value: '123456789',
    },
    render: (args) => ({
        components: {
            InfoRow,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <InfoRow
              :label="args.label"
              :value="args.value"
          />
        `,
    }),
}

export const Default = {}

export const BsnNumber = {
    args: {
        label: 'BSN',
        value: '123456789',
    },
}

export const PhoneNumber = {
    args: {
        label: 'Phone',
        value: '0612345678',
    },
}