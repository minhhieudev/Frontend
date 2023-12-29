const path_code = 'PostTables'
const name = 'Bài đăng'
const routeName = 'postTables'
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/Post/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `Post/:id`,
    component: () => import(`@/components/Views/Post`),
    name: 'Post',
    meta: {
      title: name
    }
  },
 
]
