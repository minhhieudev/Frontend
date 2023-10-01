const path_code = "training_point/inforTrainingPoint";
const name = "Quản trị điểm rèn luyện";
const routeName = "training_point";
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}/inforTrainingPoint`),
    name: `${path_code}_main`,
    meta: {
      title: name,
    },
  },
];
