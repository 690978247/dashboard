// 全局data
var searchObjData = {};
var attributeObjData = {};
var zNodes = [];
var addCount = 1;
var tableData=[];
let tableDataArr = []
let show = true
var pageDataIdMap;//勾选id
var idMap = new Map();
//声明变量注意区分类型，数组或对象或字符串
var idsArr = [];//新增仪表板位置  选中树的id集合
var ConfigureFromidsArr = [];//从其他仪表板复制配置 选中树的id集合
var ConfigureToidsArr = [];//将配置复制给其他仪表板  选中树的id集合
var checkDeptArr = [];//自定义权限选择部门的集合
 //主页面左侧的树
 var setting = {
    view: {
        showLine: false,
        fontCss : {color:"#333333"},
        addDiyDom: addDiyDom,
    },
    edit: {
    
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick,
        onRightClick: OnRightClick,
    }
};

// 新增仪表盘选择分组的树
var settingAdd = {
  view: {
      dblClickExpand: false,
      showLine: false,
      fontCss : {color:"#333333"}
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      beforeClick: beforeClickAdd,
      onClick: onClickAdd,
  }
};

var zNodesAdd =[
  {id:1, pId:0, name:"北京"},
  {id:2, pId:0, name:"天津"},
  {id:3, pId:0, name:"上海"},
  {id:6, pId:0, name:"重庆"},
  {id:4, pId:0, name:"河北省", open:true},
  {id:41, pId:4, name:"石家庄"},
  {id:42, pId:4, name:"保定"},
  {id:43, pId:4, name:"邯郸"},
  {id:44, pId:4, name:"承德"},
  {id:5, pId:0, name:"广东省", open:true},
  {id:51, pId:5, name:"广州"},
  {id:52, pId:5, name:"深圳"},
  {id:53, pId:5, name:"东莞"},
  {id:54, pId:5, name:"佛山"},
  {id:6, pId:0, name:"福建省", open:true},
  {id:61, pId:6, name:"福州"},
  {id:62, pId:6, name:"厦门"},
  {id:63, pId:6, name:"泉州"},
  {id:64, pId:6, name:"三明"}
];

// 主页右键新增分组树
var settingAddFenzu = {
  view: {
      dblClickExpand: false,
      showLine: false,
      fontCss : {color:"#333333"}
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      beforeClick: beforeClickAddFenzu,
      onClick: onClickAddFenzu,
  }
};

var zNodesAddFenzu =[
  {id:1, pId:0, name:"北京"},
  {id:2, pId:0, name:"天津"},
  {id:3, pId:0, name:"上海"},
  {id:6, pId:0, name:"重庆"},
  {id:4, pId:0, name:"河北省", open:true},
  {id:41, pId:4, name:"石家庄"},
  {id:42, pId:4, name:"保定"},
  {id:43, pId:4, name:"邯郸"},
  {id:44, pId:4, name:"承德"},
  {id:5, pId:0, name:"广东省", open:true},
  {id:51, pId:5, name:"广州"},
  {id:52, pId:5, name:"深圳"},
  {id:53, pId:5, name:"东莞"},
  {id:54, pId:5, name:"佛山"},
  {id:6, pId:0, name:"福建省", open:true},
  {id:61, pId:6, name:"福州"},
  {id:62, pId:6, name:"厦门"},
  {id:63, pId:6, name:"泉州"},
  {id:64, pId:6, name:"三明"}
];

//选择要将权限配置复制到的仪表板树
var settingCopeto = {
  view:{
      showLine: false,
      fontCss : {color:"#333333"}
  },
  check: {
      enable: true
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      onCheck: onCheck
  },
};
settingCopeto.check.chkboxType = { "Y" : "s", "N" : "s" };
//Y 属性定义 checkbox 被勾选后的情况； 
//N 属性定义 checkbox 取消勾选后的情况； 
//"p" 表示操作会影响父级节点； 
//"s" 表示操作会影响子级节点。

var zNodesCopeto =[
  { id:1, pId:0, name:"随意勾选 1", open:true},
  { id:11, pId:1, name:"随意勾选 1-1", open:true},
  { id:111, pId:11, name:"随意勾选 1-1-1"},
  { id:112, pId:11, name:"随意勾选 1-1-2"},
  { id:12, pId:1, name:"随意勾选 1-2", open:true},
  { id:121, pId:12, name:"随意勾选 1-2-1"},
  { id:122, pId:12, name:"随意勾选 1-2-2"},
  { id:2, pId:0, name:"随意勾选 2", open:true},
  { id:21, pId:2, name:"随意勾选 2-1"},
  { id:22, pId:2, name:"随意勾选 2-2", open:true},
  { id:221, pId:22, name:"随意勾选 2-2-1"},
  { id:222, pId:22, name:"随意勾选 2-2-2"},
  { id:23, pId:2, name:"随意勾选 2-3"}
];
//选择从哪个仪表板复制权限配置
var settingCopeFrom = {
  view:{
      showLine: false,
      fontCss : {color:"#333333"}
  },
  check: {
      enable: true,
      chkStyle: "radio",
      radioType: "all" //all控制单选（整棵树）  level（同一级）
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      onCheck: onCheckRaido,
      beforeCheck: zTreeBeforeCheck
  },
};

var zNodesCopeFrom =[
  { id:1, pId:0, name:"随意勾选 1", open:true},
  { id:11, pId:1, name:"随意勾选 1-1", open:true},
  { id:111, pId:11, name:"随意勾选 1-1-1"},
  { id:112, pId:11, name:"随意勾选 1-1-2"},
  { id:12, pId:1, name:"随意勾选 1-2", open:true},
  { id:121, pId:12, name:"随意勾选 1-2-1"},
  { id:122, pId:12, name:"随意勾选 1-2-2"},
  { id:2, pId:0, name:"随意勾选 2", open:true},
  { id:21, pId:2, name:"随意勾选 2-1"},
  { id:22, pId:2, name:"随意勾选 2-2", open:true},
  { id:221, pId:22, name:"随意勾选 2-2-1"},
  { id:222, pId:22, name:"随意勾选 2-2-2"},
  { id:23, pId:2, name:"随意勾选 2-3"}
];
//自定义按钮的部门树
var settingDept = {
  view:{
      showLine: false,
      fontCss : {color:"#333333"},
      showIcon: false
  },
  check: {
      enable: true,
      // chkboxType: { "Y": "p", "N": "s" }
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      onCheck: onCheckDept,
  },
};
settingDept.check.chkboxType = { "Y" : "s", "N" : "s" };


var zNodesDept =[
  { id:1, pId:0, name:"随意勾选 1", open:true},
  { id:11, pId:1, name:"随意勾选 1-1", open:true},
  { id:111, pId:11, name:"随意勾选 1-1-1"},
  { id:112, pId:11, name:"随意勾选 1-1-2"},
  { id:12, pId:1, name:"随意勾选 1-2", open:true},
  { id:121, pId:12, name:"随意勾选 1-2-1"},
  { id:122, pId:12, name:"随意勾选 1-2-2"},
  { id:2, pId:0, name:"随意勾选 2", open:true},
  { id:21, pId:2, name:"随意勾选 2-1"},
  { id:22, pId:2, name:"随意勾选 2-2", open:true},
  { id:221, pId:22, name:"随意勾选 2-2-1"},
  { id:222, pId:22, name:"随意勾选 2-2-2"},
  { id:23, pId:2, name:"随意勾选 2-3"}
];
//自定义按钮的人员左侧的树
var settingDeptOrPeo = {
  view:{
      showLine: false,
      fontCss : {color:"#333333"},
      showIcon: false
  },
  data: {
      simpleData: {
          enable: true
      }
  },
  callback: {
      onClick: onClickSelectDept,
  },
};
var zNodesDeptOrpeo =[
  { id:1, pId:0, name:"随意勾选 1", open:true},
  { id:11, pId:1, name:"随意勾选 1-1", open:true},
  { id:111, pId:11, name:"随意勾选 1-1-1"},
  { id:112, pId:11, name:"随意勾选 1-1-2"},
  { id:12, pId:1, name:"随意勾选 1-2", open:true},
  { id:121, pId:12, name:"随意勾选 1-2-1"},
  { id:122, pId:12, name:"随意勾选 1-2-2"},
  { id:2, pId:0, name:"随意勾选 2", open:true},
  { id:21, pId:2, name:"随意勾选 2-1"},
  { id:22, pId:2, name:"随意勾选 2-2", open:true},
  { id:221, pId:22, name:"随意勾选 2-2-1"},
  { id:222, pId:22, name:"随意勾选 2-2-2"},
  { id:23, pId:2, name:"随意勾选 2-3"}
];
//树配置初始化
var rMenu;
var zTree;
