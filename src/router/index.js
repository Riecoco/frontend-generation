import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import PendingPage from '../components/pages/PendingPage/PendingPage.vue'
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage.vue";
import ATMPage from '../components/pages/ATMPage/ATMPage.vue'
import CustomerDetail from '../components/pages/CustomerDetails/CustomerDetail.vue'
import TransferPage from '../components/pages/TransferPage/TransferPage.vue'
import CustomerOverviewPage from '../components/pages/CustomerOverviewPage/CustomerOverviewPage.vue'
import AccountListPage from '../components/pages/AccountListPage/AccountListPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/overview/pending',
      name: 'pending',
      component: PendingPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/atm',
      name: 'atm',
      component: ATMPage
    },
    {
      path: '/employee/customers/:id',
      name: 'employee-customer-detail',
      component: CustomerDetail
    },
    {
      path: '/overview/transfer',
      name: 'transfer',
      component: TransferPage
    },
    {
      path: '/overview/customer',
      name: 'customer',
      component: CustomerOverviewPage
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: AccountListPage
    }
  ]
})

export default router
