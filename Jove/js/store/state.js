var t = [
  {
    name: 'MaterialList',
    selected: false,
    checked: false,
    open: true,
    guid: '86023a7e3f2646a2bbee8a9fec7e6bcb',
    path: _rootPath + '/MaterialList',
    floor: 1,
    type: "folder",
    children: []
  },
  {
    name: 'Search Result',
    selected: false,
    checked: false,
    open: false,
    guid: 1,
    path: _rootPath + '/Search Result',
    floor: 1,
    type: "folder",
    children: [],
    searchResult: []
  }
];
const state = {
  navPath: [],
  nodes: t,
  saveBasePath: {
    name: 'MaterialList',
    selected: false,
    checked: false,
    open: false,
    guid: '86023a7e3f2646a2bbee8a9fec7e6bcb',
    path: _rootPath + '/MaterialList',
    floor: 1,
    type: "folder",
    children: []
  },
  mousePosition: {
    x: 0,
    y: 0
  },
  menuStatus: false,
  dragData: {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  clipBoard: [],
  userInfo: {
    loginName: '',
    nickName: '',
    userCode: ''
  },
  editor: {},
  previewBaseUrl: golbalSetting.CM + '/ModulePage/webpreview.html',
  previewUrl: golbalSetting.CM + '/ModulePage/webpreview.html',
  svplayerStatus: false,
  svplayerStyle: {
    right: '860px'
  },
  resourceBlockStatus: true,
  alwaysGet: false,
  saveFolder: {}
}
