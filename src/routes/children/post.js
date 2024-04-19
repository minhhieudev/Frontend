const path_code = 'post'
const name = 'Bài đăng'
const routeName = 'Post'
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/Post'),
    name: `PostEdit`,
    meta: {
      title: ` ${name}`
    }
  }
 
]
