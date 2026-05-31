import CardLabel from './CardLabel.vue'
import {
    CreditCard,
    PiggyBank,
} from '@lucide/vue'

export default {
    title: 'Molecules/Card/CardLabel',
    component: CardLabel,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'success'],
        },
    },
}

export const Primary = {
    args: {
        variant: 'primary',
    },
    render: (args) => ({
        components: {
            CardLabel,
            CreditCard,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <CardLabel v-bind="args">
            <template #icon>
              <CreditCard class="h-5 w-5 text-primary" />
            </template>

            Checking
          </CardLabel>
        `,
    }),
}

export const Success = {
    args: {
        variant: 'success',
    },
    render: (args) => ({
        components: {
            CardLabel,
            PiggyBank,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <CardLabel v-bind="args">
            <template #icon>
              <PiggyBank class="h-5 w-5 text-success" />
            </template>

            Savings
          </CardLabel>
        `,
    }),
}