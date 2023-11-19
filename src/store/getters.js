export default {
  pageTitle: (state) => state.app.pageTitle,
  currentSidebar: (state) => state.app.currentSidebar,
  sidebarHeight: (state) => state.app.sidebarHeight,
  token: (state) => state.user.token,
  user: (state) => state.user.user,
  question: (state) => state.question.question,
  alerts: (state) => state.app.alerts,
  loadingStatus: (state) => state.app.loadingStatus,
  reRender: (state) => state.app.reRender,
  mapCustomerGroup: (state) => state.app.mapCustomerGroup,
  lastRoute: (state) => state.app.lastRoute,
  routeHistory: (state) => state.app.routeHistory,
  countries: (state) => state.app.countries,
  stateRequired: (state) => state.app.stateRequired,
  isLocked: (state) => state.user.isLocked,
  websites: (state) => state.app.websites,
  websiteId: (state) => state.app.websiteId,
  frequencies: (state) => state.app.frequencies,
  acl: (state) => state.app.acl,
  googleReCaptchaSiteKey: (state) => state.app.googleReCaptchaSiteKey,
  settings: (state) => state.app.settings,
  blocks: (state) => state.app.cmsBlocks || {},
  toolbarWidges: (state) => state.app.toolbarWidges,
  subtitle: (state) => state.app.subtitle,
  modules: (state) => state.app.modules || {},
  locale: (state) => state.app.locale,
  clients: (state) => state.user.clients,
  client: (state) => state.user.client,
  attributeInfo: (state) => state.app.attributeInfo,
  systemName: (state) => state.app.systemName,
  baseUrl: (state) => state.app.base_url,
  templateBuilderURL: (state) => state.app.template_builder_url,
  orderStates: (state) => state.app.orderStates,
  claimStatuses: (state) => state.app.claimStatuses,
  entities: (state) => state.app.entities,
  entityClasses: (state) => {
    const map = {};
    const entities = state.app.entities;
    for (const code of Object.keys(entities)) {
      map[code] = entities[code].classes;
    }
    return map;
  },
  breadcrumb: (state) => state.app.breadcrumb,
  isNewTheme: (state) => state.app.isNewTheme,

  news: (state) => state.data.news,
  overviewData: (state) => state.data.overviewData,
  package_groups: (state) => state.data.package_groups,
  orders: (state) => state.data.orders,
  taskStatusMap: (state) => state.app.taskStatusMap,

  // new data

  

  users: (state) => state.data.users.docs,
  total_users: (state) => state.data.users.total,


  allUsers: (state) => state.data.allUsers,
  khoaList: (state) => state.data.khoaList,
  nghanhList: (state) => state.data.nghanhList,
  lopList: (state) => state.data.lopList,
};
