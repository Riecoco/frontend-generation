import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from './index'

import { Text } from '../atoms'

export default {
    title: 'Molecules/Tabs',
    component: Tabs,
    tags: ['autodocs'],
}

export const Default = {
    render: () => ({
        components: {
            Tabs,
            TabsContent,
            TabsList,
            TabsTrigger,
        },
        template: `
          <Tabs default-value="overview" class="w-[400px]">
            <TabsList>
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>

              <TabsTrigger value="transactions">
                Transactions
              </TabsTrigger>

              <TabsTrigger value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              Overview content
            </TabsContent>

            <TabsContent value="transactions">
              Transactions content
            </TabsContent>

            <TabsContent value="settings">
              Settings content
            </TabsContent>
          </Tabs>
        `,
    }),
}

export const Controlled = {
    render: () => ({
        components: {
            Tabs,
            TabsContent,
            TabsList,
            TabsTrigger,
            Text,
        },
        data() {
            return {
                tab: 'overview',
            }
        },
        template: `
          <div class="w-[400px] space-y-4">
            <Tabs v-model:model-value="tab">
              <TabsList>
                <TabsTrigger value="overview">
                  Overview
                </TabsTrigger>

                <TabsTrigger value="transactions">
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                Selected overview tab
              </TabsContent>

              <TabsContent value="transactions">
                Selected transactions tab
              </TabsContent>
            </Tabs>

            <Text
                size="sm"
                color="muted"
            >
              Current tab: {{ tab }}
            </Text>
          </div>
        `,
    }),
}