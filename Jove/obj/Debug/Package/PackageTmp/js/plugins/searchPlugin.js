const searchPlugin = store => {
  store.subscribe(mutation => {
    if (mutation.payload.type === types.GET_NAVPATH) {
      if (mutation.payload.target.guid !== 2 && mutation.payload.target.guid !== 1) {
        $.fn.fullTextSearch.defaults.path = mutation.payload.target.path.slice('global_sobey_defaultclass/MaterialList/'.length);
        $.fn.advancedSearch.defaults.path = mutation.payload.target.path.slice('global_sobey_defaultclass/MaterialList/'.length);
      }
    }
  })
}
