const path_code = 'question'
const name = 'Câu hỏi'
const routeName = 'Question'
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
