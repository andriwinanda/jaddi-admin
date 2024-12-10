import Vue from 'vue'
import Router from 'vue-router'
import { Buffer } from 'buffer'
import Login from '../components/Login'
import Register from '../components/Register'
import Reset from '../components/Reset'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'
import Product from '../pages/product/ManageProduct'
import CreateProduct from '../pages/product/CreateProduct'
import Country from '../pages/country/ManageCountry'
import CreateCountry from '../pages/country/CreateCountry'
import Category from '../pages/category/ManageCategory'
import Subscriber from '../pages/subscriber/ManageSubscriber'
import News from '../pages/news/ManageNews'
import CreateNews from '../pages/news/CreateNews'
import Account from '../pages/account/ManageAccount'
import CreateAccount from '../pages/account/CreateAccount'
import Brand from '../pages/brand/ManageBrand'
import CreateBrand from '../pages/brand/CreateBrand'
// import Glass from '../pages/glass/ManageGlass'
// import CreateGlass from '../pages/glass/CreateGlass'

import store from '../store/store'
import { getDataUser } from '@/localstorage-helper'

Vue.use(Router)


let routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/register',
    component: Register,
    meta: { title: 'Register' }
  },
  {
    path: '/reset-password',
    component: Reset,
    meta: { title: 'Reset Password' }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { title: 'Profile' }
  },
  {
    path: '*',
    meta: { title: 'Page Not Found' },
    component: NotFound
  },
  {
    path: '/',
    redirect: '/product'
  },
  {
    path: '/category',
    meta: { title: 'Category' },
    component: Category
  },
  {
    path: '/subscriber',
    meta: { title: 'Subscriber' },
    component: Subscriber
  },
  {
    path: '/product',
    meta: { title: 'Product' },
    component: Product
  },
  {
    path: '/product/edit/:id',
    meta: { title: 'Edit Product' },
    component: CreateProduct
  },
  {
    path: '/product/create',
    meta: { title: 'Create Product' },
    component: CreateProduct
  },
  {
    path: '/country',
    meta: { title: 'Country' },
    component: Country
  },
  {
    path: '/country/edit/:id',
    meta: { title: 'Edit Country' },
    component: CreateCountry
  },
  {
    path: '/country/create',
    meta: { title: 'Create Country' },
    component: CreateCountry
  },
  {
    path: '/news',
    meta: { title: 'News' },
    component: News
  },
  {
    path: '/news/edit/:id',
    meta: { title: 'Edit News' },
    component: CreateNews
  },
  {
    path: '/news/create',
    meta: { title: 'Create News' },
    component: CreateNews
  },

  // {
  //   path: '/account',
  //   children: [
  //     {
  //       path: '',
  //       meta: { title: 'Account' },
  //       component: Account
  //     },
  //     {
  //       path: '/edit/:id',
  //       meta: { title: 'Edit Account' },
  //       component: CreateAccount
  //     },
  //     {
  //       path: '/create',
  //       meta: { title: 'Create Account' },
  //       component: CreateAccount
  //     },
  //   ]
  // },
  {
    path: '/account',
    meta: { title: 'Account' },
    component: Account
  },
  {
    path: '/account/edit/:id',
    meta: { title: 'Edit Account' },
    component: CreateAccount
  },
  {
    path: '/account/create',
    meta: { title: 'Create Account' },
    component: CreateAccount
  },
  {
    path: '/brand',
    meta: { title: 'Brand' },
    component: Brand
  },
  {
    path: '/brand/edit/:id',
    meta: { title: 'Edit Brand' },
    component: CreateBrand
  },
  {
    path: '/brand/create',
    meta: { title: 'Create Brand' },
    component: CreateBrand
  },
  // {
  //   path: '/glass',
  //   meta: { title: 'Glass' },
  //   component: Glass
  // },
  // {
  //   path: '/glass/edit/:id',
  //   meta: { title: 'Edit Glass' },
  //   component: CreateGlass
  // },
  // {
  //   path: '/glass/create',
  //   meta: { title: 'Create Glass' },
  //   component: CreateGlass
  // }

]

const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})
router.beforeEach((to, from, next) => {
  const userLS = getDataUser()
  let token = localStorage.getItem("jaddi-token");
  let user = userLS ? JSON.parse(Buffer.from(userLS, 'base64').toString('ascii')) : null

  if (to.path !== '/login' && to.path != '/register' && to.path != '/reset-password') {
    if (!token || !user) {
      store.dispatch("login/logout")
      next('/login')
    } else {
      if (to.path === '/account' || to.path === '/account/create' || to.path === '/account/edit/:id') {
        if (user.role === "ROLE_ADMIN") next()
      } else 
      next()
    }
  }
  else {
    next()
  }

})
export default router;
