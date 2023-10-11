import Vue from 'vue'
import Router from 'vue-router'
// Load Auth Middleware
import routerBefore from './router-before'
import routerAfter from './router-after'
// Component
import RootLayout from '@/components/Layouts/RootLayout'
import NotFound from '@/components/GeneralView/NotFoundPage'

// Model routes
import userRoutes from './children/user'
import settingRoute from './children/setting'
import questionRoute from './children/question'
import questionsRoute from './children/questions'
import training_pointRoute from "./children/training_point";
import detailTrainingPointRoute from "./children/detailTrainingPoint";
import resultTraningPointRoute from "./children/resultTraningPoint";
import note_bookRoute from "./children/note_book";
import studentRoute from "./children/student";
import consultantRoute from "./children/consultant";

Vue.use(Router)

let pageRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Pages/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/Pages/Register')
  }
]

let adminRoutes = {
  path: "/",
  component: RootLayout,
  redirect: "dashboard",
  name: "app",
  meta: {
    authRequired: false,
  },
  children: [
    {
      path: "dashboard",
      component: () => import("@/components/Views/Overview"),
      name: "dashboard",
      meta: {
        title: "Dashboard",
      },
    },
    ...settingRoute,
    ...questionRoute,
    ...questionsRoute,
    ...training_pointRoute,
    ...detailTrainingPointRoute,
    ...resultTraningPointRoute,
    ...note_bookRoute,
    ...userRoutes,
    ...studentRoute,
    ...consultantRoute,
  ],
};

const router = new Router({
  routes: [
    adminRoutes, ...pageRoutes, { path: '*', name: 'not_found', component: NotFound, meta: { title: '404 Not Found' } }
  ]
})

router.onError((error) =>{
  if (/Loading (chunk|CSS chunk) [\w|-]* failed/gi.test(error.message) && navigator.onLine) {
    if (router.history.pending) {
      router.go(router.history.pending)
    }
  }
});

router.beforeEach(routerBefore)
router.afterEach(routerAfter)

export default router
