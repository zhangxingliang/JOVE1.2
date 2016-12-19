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
  saveFolder: {},
  listOrder: {
    type: 'title',
    symbol: true,
  },
  headers: [
    {
      name: 'Title',
      attr: 'name',
      width: 200,
      dragging: false,
    },
    {
      name: 'Creator',
      attr: 'creatorName',
      width: 200,
      dragging: false,
    },
    {
      name: 'Creation Date',
      attr: 'formatDate',
      width: 200,
      dragging: false,
    },
    {
      name: 'Modification Date',
      attr: 'modificationDate',
      width: 200,
      dragging: false,
    },
    {
      name: 'Clip Status',
      attr: 'clipStatus',
      width: 200,
      dragging: false,
    },
    {
      name: 'HV',
      attr: 'hv',
      width: 200,
      dragging: false,
    },
    {
      name: 'LV',
      attr: 'lv',
      width: 200,
      dragging: false,
    },
    {
      name: 'HA',
      attr: 'ha',
      width: 200,
      dragging: false,
    },
    {
      name: 'LA',
      attr: 'la',
      width: 200,
      dragging: false,
    },
    {
      name: 'Total Duration',
      attr: 'totalDuration',
      width: 200,
      dragging: false,
    },
    {
      name: 'Length',
      attr: 'length',
      width: 200,
      dragging: false,
    },
    {
      name: 'In Point',
      attr: 'trimin',
      width: 200,
      dragging: false,
    },
    {
      name: 'Out Point',
      attr: 'trimout',
      width: 200,
      dragging: false,
    },
    {
      name: '16:9 SD',
      attr: 'img16_9sd',
      width: 200,
      dragging: false,
    },
    {
      name: 'Rights',
      attr: 'rights',
      width: 200,
      dragging: false,
    },
    {
      name: 'Comments',
      attr: 'comments',
      width: 200,
      dragging: false,
    },
    {
      name: 'To be Deleted',
      attr: 'tobedel',
      width: 200,
      dragging: false,
    },
    {
      name: 'HD/SD',
      attr: 'hsd',
      width: 200,
      dragging: false,
    },
  ]
}
