const path_code = 'post'
const name = 'Bài đăng'
const routeName = 'post'
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
 
]
