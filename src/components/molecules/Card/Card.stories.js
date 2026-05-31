import Card from './Card.vue'
import CardHeader from './CardHeader.vue'
import CardContent from './CardContent.vue'
import CardTitle from './CardTitle.vue'
import CardDescription from './CardDescription.vue'
import CardLabel from './CardLabel.vue'
import { CreditCard } from '@lucide/vue'
import { Text } from '../../atoms'

export default {
    title: 'Molecules/Card',
    component: Card,
    tags: ['autodocs'],
}

export const Default = {
    render: () => ({
        components: {
            Card,
            CardHeader,
            CardContent,
            CardTitle,
            CardDescription,
            CardLabel,
            CreditCard,
            Text,
        },
        template: `
          <Card class="max-w-md">
            <CardHeader>
              <CardLabel>
                <template #icon>
                  <CreditCard class="h-5 w-5 text-primary" />
                </template>

                Account
              </CardLabel>

              <CardTitle>Card title</CardTitle>

              <CardDescription>
                Card description text
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Text
                  size="sm"
                  class="text-card-foreground"
              >
                Card content
              </Text>
            </CardContent>
          </Card>
        `,
    }),
}