const path_code = 'setting'
const name = 'Cài đặt'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/Setting'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  }
]
