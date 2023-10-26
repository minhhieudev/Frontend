const path_code = 'Post/PostTables'
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
 
]
