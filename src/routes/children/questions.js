const path_code = 'questions'
const name = 'Quản trị câu hỏi/Trả lời'
const routeName = 'Questions'
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
