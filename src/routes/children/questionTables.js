const path_code = 'Question/questionTables'
const name = 'Quản trị câu hỏi'
const routeName = 'Question'
export default [

  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}/questionTables`),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `Question/:id`,
    component: () => import('@/components/Views/Question'),
    name: `Question`,
    meta: {
      title: ` ${name}`
    }
  }
 
]
