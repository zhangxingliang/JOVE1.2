const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [searchPlugin, notifyPlugin]
})
