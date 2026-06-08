import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import PendingPage from '../components/pages/PendingPage/PendingPage.vue'
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage.vue";
import ATMPage from '../components/pages/ATMPage/ATMPage.vue'
import CustomerDetail from '../components/pages/CustomerDetails/CustomerDetail.vue'
import TransferPage from '../components/pages/TransferPage/TransferPage.vue'
import CustomerOverviewPage from '../components/pages/CustomerOverviewPage/CustomerOverviewPage.vue'
import AccountsPage from '../components/pages/AccountsPage/AccountsPage.vue'
import MyTransactionsPage from "@/components/pages/MyTransactionsPage/MyTransactionsPage.vue";
import AllTransactionsPage from "@/components/pages/AllTransactionsPage/AllTransactionsPage.vue";


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
      path: '/customer/transfer',
      name: 'transfer',
      component: TransferPage
    },
    {
      path: '/dashboard/customer',
      name: 'customer',
      component: CustomerOverviewPage
    },
    {
      path: '/customer/accounts',
      name: 'accounts',
      component: AccountsPage
    },
    {
      path: '/customer/transactions',
      name: 'transactions',
      component: TransferPage
    },
    {
      path: '/my-transactions',
      name: 'my-transactions',
      component: MyTransactionsPage
    },
    {
      path: '/employee/transactions',
      name: 'employee-transactions',
      component: AllTransactionsPage
    }
  ]
})


export default router
