import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './index'

import { Text } from '../atoms'

export default {
    title: 'Molecules/Select',
    component: Select,
    tags: ['autodocs'],
}

export const Default = {
    render: () => ({
        components: {
            Select,
            SelectContent,
            SelectItem,
            SelectTrigger,
            SelectValue,
            Text,
        },
        data() {
            return {
                selectedAccount: '',
            }
        },
        template: `
          <div class="w-72">
            <Select v-model="selectedAccount">
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="checking">
                  Checking
                </SelectItem>

                <SelectItem value="savings">
                  Savings
                </SelectItem>
              </SelectContent>
            </Select>

            <Text
                size="sm"
                color="muted"
                class="mt-4"
            >
              Selected: {{ selectedAccount || 'none' }}
            </Text>
          </div>
        `,
    }),
}