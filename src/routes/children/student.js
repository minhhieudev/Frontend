const path_code = 'student'
const name = 'Student'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/Student'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new`,
    component: () => import('@/components/Views/Student/Form'),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/Student/Form'),
    name: `${path_code}_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
