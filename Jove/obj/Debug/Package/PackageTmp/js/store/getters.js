const getters = {
  folderTree: state => {
    return state.nodes
  },
  currentNode: (state, getters) => {
    if (state.navPath.length > 0) {
      return state.navPath[state.navPath.length - 1]
    }
    return {
      children: []
    }
  },
  copingBoard: (state, getters) => {
    return getters.currentNode.children.filter(item => item.coping == true)
  },
  searchResult: state => {
    return state.nodes[1]
  },
  savePathTree: state => {
    return state.saveBasePath.children.filter(item => item.type == 'folder').sort(window.SortLikeWin)
  },
  selectedNode: (state, getters) => {
    if (!state.selectedNode) {
      return getters.currentNode
    } else {
      return state.selectedNode
    }
  }
}
