import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Auth from '@/components/Auth'
import CustomerList from '@/components/CustomerList'
import CustomerCreate from '@/components/CustomerCreate'
import SettingList from '@/components/SettingsList'
import SettingCreate from '@/components/SettingsCreate'
import IntakeList from '@/components/IntakeList'
import IntakeCreate from '@/components/IntakeCreate'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/customer-list',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/customer-list/:msg',
      name: 'CustomerUpdatedList',
      component: CustomerList
    },
    {
      path: '/customer-create',
      name: 'CustomerCreate',
      component: CustomerCreate
    },
    {
      path: '/customer-create/:pk',
      name: 'CustomerUpdate',
      component: CustomerCreate
    },
    {
      path: '/settings-list',
      name: 'SettingsList',
      component: SettingList
    },
    {
      path: '/settings-list/:msg',
      name: 'SettingsUpdatedList',
      component: SettingList
    },
    {
      path: '/settings-create',
      name: 'SettingsCreate',
      component: SettingCreate
    },
    {
      path: '/settings-create/:pk',
      name: 'SettingsUpdate',
      component: SettingCreate
    },
     {
      path: '/intake-list',
      name: 'IntakeList',
      component: IntakeList
    },
{
      path: '/intake-list/:msg',
      name: 'IntakeUpdatedList',
      component: IntakeList
    },
    {
      path: '/intake-create',
      name: 'IntakeCreate',
      component: IntakeCreate
    },
    {
      path: '/intake-create/:pk',
      name: 'IntakeUpdate',
      component: IntakeCreate
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    }
  ]
})