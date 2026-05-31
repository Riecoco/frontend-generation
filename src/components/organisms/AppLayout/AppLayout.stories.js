import {
    CreditCard,
    Home,
    Receipt,
    Settings,
    User,
} from '@lucide/vue'

import AppLayout from './AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules'
import { Text } from '../../atoms'

export default {
    title: 'Organisms/AppLayout',
    component: AppLayout,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
}

const items = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: Home,
    },
    {
        key: 'accounts',
        label: 'Accounts',
        icon: CreditCard,
    },
    {
        key: 'transactions',
        label: 'Transactions',
        icon: Receipt,
    },
    {
        key: 'profile',
        label: 'Profile',
        icon: User,
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: Settings,
    },
]

export const Default = {
    render: () => ({
        components: {
            AppLayout,
            Card,
            CardContent,
            CardHeader,
            CardTitle,
            Text,
        },
        data() {
            return {
                activeKey: 'dashboard',
                items,
            }
        },
        template: `
          <AppLayout
              user-name="Natasha"
              user-role="Customer"
              :items="items"
              :active-key="activeKey"
              @select="activeKey = $event"
              @logout="activeKey = 'logout'"
          >
            <div class="mx-auto max-w-6xl space-y-8 py-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Dashboard
                  </CardTitle>
                </CardHeader>

                <CardContent class="space-y-2">
                  <Text>
                    This is page content rendered inside AppLayout.
                  </Text>

                  <Text
                      size="sm"
                      color="muted"
                  >
                    Active item: {{ activeKey }}
                  </Text>
                </CardContent>
              </Card>
            </div>
          </AppLayout>
        `,
    }),
}