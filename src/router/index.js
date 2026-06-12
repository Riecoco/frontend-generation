import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import PendingPage from '../components/pages/PendingPage/PendingPage.vue'
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage.vue";
import ATMPage from '../components/pages/ATMPage/ATMPage.vue'
import CustomerDetail from '../components/pages/CustomerDetails/CustomerDetail.vue'
import TransferPage from '../components/pages/TransferPage/TransferPage.vue'
import CustomerOverviewPage from '../components/pages/CustomerOverviewPage/CustomerOverviewPage.vue'
import EmployeeOverviewPage from '../components/pages/EmployeeOverviewPage/EmployeeOverviewPage.vue'
import PendingApprovalsPage from '../components/pages/PendingApprovalsPage/PendingApprovalsPage.vue'
import ApproveCustomerPage from '../components/pages/ApproveCustomerPage/ApproveCustomerPage.vue'
import EmployeeTransferPage from '../components/pages/EmployeeTransferPage/EmployeeTransferPage.vue'
import CustomerTransactionsPage from '../components/pages/CustomerTransactionsPage/CustomerTransactionsPage.vue'
import AccountsPage from '../components/pages/AccountsPage/AccountsPage.vue'
import MyTransactionsPage from "@/components/pages/MyTransactionsPage/MyTransactionsPage.vue";
import AllTransactionsPage from "@/components/pages/AllTransactionsPage/AllTransactionsPage.vue";

import AccountListPage from '../components/pages/AccountListPage/AccountListPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/customer/transactions',
      name: 'customer-transactions',
      component: CustomerTransactionsPage,
    },
    {
      path: '/employee/customers',
      name: 'employee-customers',
      component: EmployeeOverviewPage
    },
    {
      path: '/employee/pending',
      name: 'employee-pending',
      component: PendingApprovalsPage
    },
    {
      path: '/employee/pending/:id',
      name: 'employee-approve-customer',
      component: ApproveCustomerPage,
    },
    {
      path: '/employee/transfer',
      name: 'employee-transfer',
      component: EmployeeTransferPage,
    },
    {
      path: '/customer/accounts',
      name: 'accounts',
      component: AccountsPage,
    },
    {
      path: '/customer/transactions',
      name: 'transactions',
      component: TransferPage
    },
    {
      path: '/customer/my-transactions',
      name: 'my-transactions',
      component: MyTransactionsPage
    },
    {
      path: '/employee/transactions',
      name: 'employee-transactions',
      component: AllTransactionsPage
    },
      {
      path: '/customer/transfer',
      name: 'transfer',
      component: TransferPage,
    },
    {
      path: '/employee/accounts',
      name: 'employee-accounts',
      component: AccountListPage
    }
  ]
})


export default router
