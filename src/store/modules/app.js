export default {
  state: {
    base_url: '',
    template_builder_url: '',
    pageTitle: '',
    currentSidebar: null,
    sidebarHeight: null,
    alerts: [],
    loadingStatus: 0,
    reRender: false,
    mapCustomerGroup: {
      general: 'General',
      'tax-exempt': 'Tax Exempt'
    },
    lastRoute: '',
    routeHistory: [],
    countries: {},
    stateRequired: [],
    customerGroups: [],
    websites: [],
    websiteId: 0,
    frequencies: {
      '1_week': '1 Week',
      '2_week': '2 Weeks',
      '1_month': '1 Month',
      '2_month': '2 Months',
      '3_month': '3 Months',
      '4_month': '4 Months'
    },
    acl: [],
    googleReCaptchaSiteKey: '',
    configuration: [],
    cmsBlocks: {},
    cmsPage: [],
    toolbarWidges: [],
    subtitle: '',
    modules: {},
    locale: {
      languages: [{ code: 'en', label: 'English' }],
      currencies: [{ code: 'USD', label: 'US Dollar' }]
    },
    attributeInfo: [],
    systemName: '',
    orderStates: {},
    entities: {},
    breadcrumb: [],
    isNewTheme: false,
    taskStatusMap: {},
  },
  mutations: {
    SET_PAGE_TITLE: function(state, title) {
      state.pageTitle = title
    },
    SET_CURRENT_SIDEBAR: function(state, value) {
      state.currentSidebar = value
    },
    SET_SIDEBAR_HEIGHT: function(state, value) {
      if (value) {
        state.sidebarHeight = 0
      } else {
        state.sidebarHeight = document.documentElement.scrollHeight
      }
    },
    SHOW_ALERT: function(state, object) {
      if (state.alerts.length === 3) {
        state.alerts.pop()
      }
      state.alerts.unshift(Object.assign({ variant: 'info' }, object))
    },
    DISMISS_ALERT: function(state, index) {
      state.alerts.splice(index, 1)
    },
    SET_LOADING_STATUS: function(state, status) {
      if (status) {
        state.loadingStatus += 1
      }
      if (!status && state.loadingStatus > 0) {
        state.loadingStatus -= 1
      }
      if (status === 'reset') {
        state.loadingStatus = 0
      }
    },
    TOGGLE_RE_RENDER: function(state) {
      state.reRender = !state.reRender
    },
    SET_LAST_ROUTE: function(state, value) {
      state.lastRoute = value
    },
    PUSH_LAST_ROUTE: function(state, value) {
      state.routeHistory.unshift(value)
      state.routeHistory.length = 10
    },
    SET_FIRST_DATA: function(state, value) {
      // state.base_url = value['base_url']
      // state.template_builder_url = value['template_builder_url']
      // state.locale = value['locale']
      // state.countries = value['country']['countries']
      // state.stateRequired = value['country']['stateRequired']
      // state.customerGroups = value['customer_groups']
      // state.websites = value['websites']
      // state.modules = value['modules']
      // state.orderStates = value['order_states'] || {}
      // state.entities = value['entities'] || {}
      // if (Array.isArray(state.websites) && state.websites.length) {
      //   state.websiteId = state.websites[0]['_id']
      // }
      //state.acl = value['acl']
      //state.attributeInfo = value['attributeInfo']
      //console.log(value);
      state.taskStatusMap = value['taskStatus']
    },
    SET_WEBSITES: (state, value) => {
      state.websites = value
    },
    SET_WEBSITE_ID: (state, value) => {
      state.websiteId = value
    },
    SET_GOOGLE_RE_CAPTCHA_SITE_KEY: (state, value) => {
      state.googleReCaptchaSiteKey = value
    },
    SET_CONFIGURATION: (state, value) => {
      state.configuration = value
    },
    SET_TOOLBAR_WIDGETS: (state, value) => {
      state.toolbarWidges = value
    },
    SET_SUBTITLE: (state, value) => {
      state.subtitle = value
    },
    SET_SYSTEM_NAME: (state, value) => {
      state.systemName = value
    },
    SET_BREADCRUMB: (state, value) => {
      state.breadcrumb = value
    },
    SET_NEW_THEME: (state, value) => {
      state.isNewTheme = value
    }
  },
  actions: {
    setPageTitle: function({ commit }, title) {
      if (typeof title === 'object') {
        if (title.page_title) {
          commit('SET_PAGE_TITLE', title.page_title)
        }
        if (title.subtitle) {
          commit('SET_SUBTITLE', title.subtitle || '')
        }
      } else {
        commit('SET_PAGE_TITLE', title)
      }
    },
    changeCurrentSidebar: function({ commit }, value) {
      commit('SET_CURRENT_SIDEBAR', value)
    },
    changeSidebarHeight: function({ commit }, value) {
      commit('SET_SIDEBAR_HEIGHT', value)
    },
    showAlert: function({ commit }, object) {
      commit('SHOW_ALERT', object)
    },
    dismissAlert: function({ commit }, index) {
      commit('DISMISS_ALERT', index)
    },
    toggleLoading: function({ commit }, status) {
      commit('SET_LOADING_STATUS', status)
    },
    reRender: function({ commit }) {
      commit('TOGGLE_RE_RENDER')
    },
    setLastRoute: function({ commit }, value) {
      commit('SET_LAST_ROUTE', value)
      commit('PUSH_LAST_ROUTE', value)
    },
    setFirstData: function({ commit }, value) {
      commit('SET_FIRST_DATA', value)
    },
    setWebsites: ({ commit }, value) => {
      commit('SET_WEBSITES', value)
    },
    setWebsiteId: ({ commit }, value) => {
      commit('SET_WEBSITE_ID', value)
    },
    fetchConfiguration: async ({ state, commit }) => {
      // only load setting configuration once
      if (!state.configuration || !state.configuration.length) {
        const _configuration = await getConfiguration()
          .then(({ data }) => data.settings)
          .catch(() => null)

        if (_configuration) {
          commit('SET_CONFIGURATION', _configuration)
        }
      }

      return state.configuration
    },
    getBlocks: async ({ state }, type) => {},
    setToolbarWidgets: ({ commit }, value) => {
      commit('SET_TOOLBAR_WIDGETS', value)
    },
    setBreadcrumb: ({ commit }, value) => {
      commit('SET_BREADCRUMB', value)
    },
    setNewTheme: ({ commit }, value) => {
      commit('SET_NEW_THEME', value)
    }
  }
}
