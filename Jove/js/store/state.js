var t = [
  {
    name: 'Public',
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
  previewUrl: golbalSetting.CM + '/ModulePage/webpreview.html?type=32&ep=JOVE',
  svplayerStatus: false,
  resourceBlockStatus: true,
  alwaysGet: false,
  thumbPadding: 7,
  saveFolder: {},
  listOrder: {
    type: 'title',
    symbol: true,
  },
  dict: _language[_curLang],
  svMarkerList: [],
  headers: [
    {
      name: 'Title',
      attr: 'name',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Creator',
      attr: 'creatorName',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Creation Date',
      attr: 'formatDate',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Modified  by',
      attr: 'modifierName',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Modification Date',
      attr: 'modificationDate',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Clip Status',
      attr: 'clipStatus',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Storage Status',
      attr: 'onlinstatus',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'HV',
      attr: 'hv',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'LV',
      attr: 'lv',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'HA',
      attr: 'ha',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'LA',
      attr: 'la',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'Total Duration',
      attr: 'totalDuration',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Length',
      attr: 'length',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'In Point',
      attr: 'trimin',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'Out Point',
      attr: 'trimout',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: '16:9 SD',
      attr: 'img16_9sd',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'Rights',
      attr: 'rights',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'Comments',
      attr: 'comments',
      width: 200,
      dragging: false,
      checked: true,
    },
    {
      name: 'To be Deleted',
      attr: 'tobedel',
      width: 100,
      dragging: false,
      checked: true,
    },
    {
      name: 'HD/SD',
      attr: 'hsd',
      width: 100,
      dragging: false,
      checked: true,
    },
  ]
}
