import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './index'

import { Button, Text } from '../atoms'

export default {
    title: 'Organisms/AlertDialog',
    component: AlertDialog,
    tags: ['autodocs'],
}

export const Default = {
    render: () => ({
        components: {
            AlertDialog,
            AlertDialogAction,
            AlertDialogCancel,
            AlertDialogContent,
            AlertDialogDescription,
            AlertDialogFooter,
            AlertDialogHeader,
            AlertDialogTitle,
            AlertDialogTrigger,
            Button,
        },
        template: `
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive">
                Delete account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        `,
    }),
}

export const Controlled = {
    render: () => ({
        components: {
            AlertDialog,
            AlertDialogAction,
            AlertDialogCancel,
            AlertDialogContent,
            AlertDialogDescription,
            AlertDialogFooter,
            AlertDialogHeader,
            AlertDialogTitle,
            Button,
            Text,
        },
        data() {
            return {
                isOpen: false,
            }
        },
        template: `
          <div class="space-y-4">
            <Button @click="isOpen = true">
              Open controlled dialog
            </Button>

            <AlertDialog v-model:open="isOpen">
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirm action
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This dialog is controlled with v-model:open.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Text
                size="sm"
                color="muted"
            >
              Open: {{ isOpen }}
            </Text>
          </div>
        `,
    }),
}