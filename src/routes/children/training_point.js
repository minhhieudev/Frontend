const path_code = "training_point";
const name = "Chấm điểm rèn luyện";
const routeName = "training_point";
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name,
    },
  },
];
