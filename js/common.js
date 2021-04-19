// 全局data 以及zTree事件
/* 全局data */
var searchObjData = {};
var attributeObjData = {};
var currentPositionNode = {}  //位置树选中的node
var currentGroupNode = {}  //分组树选中的node
var appId = '68d61d7f990e11eb847e88d7f63cc98f'  //appId
var defaultTd = '8ecd52dcd312f9dd21beb42a1a2345ce'  //表格全部分组id
var zNodes = [];
var addCount = 1;
var pageData = {}
var tableData=[]
let tableDataArr = []
let show = true
var pageDataIdMap;//勾选id
var idMap = new Map();
var tableCheckList = [] //表格 
//声明变量注意区分类型，数组或对象或字符串
var idsArr = [];//新增仪表板位置  选中树的id集合
var ConfigureFromidsArr = [];//从其他仪表板复制配置 选中树的id集合
var ConfigureToidsArr = [];//将配置复制给其他仪表板  选中树的id集合
var checkDeptArr = [];//自定义权限选择部门的集合
//树配置初始化
var rMenu
var zTree  //分组树
var pTree   // 新增仪表板树
var addPTree // 新建分组树
var attrTree  //属性位置树
var fromTree //其他仪表板复制 
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
        onClick: groupNodeClick,
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

// 属性位置的树
var settingAttr = {
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
      onClick: onClickAttr,
  }
};

// 分组弹窗位置树
var settingAddFenzu = {
  view: {
      dblClickExpand: false,
      showLine: false,
      fontCss : setFontCss
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

/* zTree事件 */
function addDiyDom(treeId, treeNode) {
  var spaceWidth = 5;
  var switchObj = $("#" + treeNode.tId + "_switch"),
  icoObj = $("#" + treeNode.tId + "_ico");
  switchObj.remove();
  icoObj.before(switchObj);

  if (treeNode.level > 1) {
      var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
      switchObj.before(spaceStr);
  }

  var aObj = $("#" + treeNode.tId + "_a");
  //treeNode.id 要根据树的数据中的id获取，zNodes 数据配置中的i
  // if ($("#diyBtn_"+treeNode.id).length>0) return; //控制哪些节点不显示按钮
  var editStr = "<span class='dot' id='diyBtn_space_"+treeNode.id+ "' >...</span>"
    + "<button type='button' class='diyBtn1' id='diyBtn_" + treeNode.id
    + "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
  aObj.append(editStr);
  var btn = $("#diyBtn_"+treeNode.id);
  if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
}

function addDiyDom1(treeId, treeNode) {
  var aObj = $("#" + treeNode.tId + "_a");
    //treeNode.id 要根据树的数据中的id获取，zNodes 数据配置中的i
  // if ($("#diyBtn_"+treeNode.id).length>0) return; //控制哪些节点不显示按钮
  var editStr = "<span class='dot' id='diyBtn_space_"+treeNode.id+ "' >...</span>"
    + "<button type='button' class='diyBtn1' id='diyBtn_" + treeNode.id
    + "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
  aObj.append(editStr);
  var btn = $("#diyBtn_"+treeNode.id);
  if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
};

function groupNodeClick(event, treeId, treeNode) {
  currentGroupNode = treeNode
  let postData = {
    appId,
    groupId: treeNode.id,
    current: 1,
    size: 10
  }
  request.get(`/bi/${appId}/panels`, {params: postData}).then(res => {
    let { data } = res.data
    renderTable(data.records, {size: res.data.data.size,})
    pageData = {
        totalCount: res.data.data.total, // 总条数
        totalPage: res.data.data.pages, // 总页数
        pageIndex: res.data.data.current, // 当前页
        pageSize: res.data.data.size, // 每页显示条数
    }
    renderPagination('popup-pagination')
    renderLis ()
  })
};

function setFontCss(treeId, treeNode) {
  let obj = {}
  // var str = $("#fenzuPosition").val()
  // if (treeNode.name == str) {
  //   obj = {
  //     color: '#409EFF',
  //     background: '#F9FAFD'
  //   }
  // }
	return obj
};

function OnRightClick(event, treeId, treeNode) {
  let zTree = $.fn.zTree.getZTreeObj("treeDemo");
  if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
      zTree.cancelSelectedNode();
      showRMenu("root", event.clientX, event.clientY);
  } else if (treeNode && !treeNode.noR) {
      zTree.selectNode(treeNode);
      showRMenu("node", event.clientX, event.clientY);
  }
}

function beforeClickAdd(treeId, treeNode) {
  var check = (treeNode && !treeNode.isParent);
  // if (!check) alert("只能选择城市...");控制哪些层级不能选择
  return check;
}


function onClickAdd(e, treeId, treeNode) {
  currentPositionNode = treeNode
  nodes = zTree.getSelectedNodes()
  let cityObj = $("#citySel")[0];
  cityObj.value = treeNode.name
}

function onClickAttr (e, treeId, treeNode) {
  currentPositionNode = treeNode
  nodes = zTree.getSelectedNodes()
  let pos = $("#attrPosition")[0];
  pos.value = treeNode.name
}

function beforeClickAddFenzu(treeId, treeNode) {
  var check = (treeNode && !treeNode.isParent);
  // if (!check) alert("只能选择城市...");控制哪些层级不能选择
  return check;
}


function onClickAddFenzu(e, treeId, treeNode) {
  nodes = addPTree.getSelectedNodes()
  currentPositionNode = treeNode
  let cityObj = $("#fenzuPosition")[0];
  cityObj.value = treeNode.name
}


function onCheck(e,treeId,treeNode){
  var treeObj=$.fn.zTree.getZTreeObj("treeDemoCopeto"),
  nodes=treeObj.getCheckedNodes(true),
  v1="";
  h1="";
  for(var i=0;i<nodes.length;i++){
      v1+=nodes[i].name + ",";
      h1+=nodes[i].id + ",";  
  }
  ConfigureToidsArr = h1;
  ConfigureToidsArr = ConfigureToidsArr.slice(0,-1);
}


function onCheckRaido(e,treeId,treeNode){
  var treeObj=$.fn.zTree.getZTreeObj("treeDemoCopeFrom"),
  nodes=treeObj.getCheckedNodes(true),
  v2="";
  h2="";
  for(var i=0;i<nodes.length;i++){
      v2+=nodes[i].name + ",";
      h2+=nodes[i].id + ",";  
  }
  ConfigureFromidsArr = h2;
  ConfigureFromidsArr = ConfigureFromidsArr.slice(0,-1);
}


function zTreeBeforeCheck(treeId, treeNode) {
  return !treeNode.isParent;//当是父节点 返回false 不让选取
}

function onCheckDept(e,treeId,treeNode){
  treeObjDept=$.fn.zTree.getZTreeObj("treeDemoDept"),
  myNodes=treeObjDept.getCheckedNodes(true),
  v1="";
  h1="";
  for(var i=0;i<myNodes.length;i++){
      v1+=myNodes[i].name + ",";
      h1+=myNodes[i].id + ",";  
  }
  checkDeptArr = v1;
  checkDeptArrIds =h1;
  if(checkDeptArr!=""){
     checkDeptArr = checkDeptArr.slice(0,-1);
     checkDeptArr = checkDeptArr.split(",");
  }
  if(checkDeptArrIds!=""){
      checkDeptArrIds = checkDeptArrIds.slice(0,-1);
      checkDeptArrIds = checkDeptArrIds.split(",");
   }
  $("#viewTpl li").remove();
  //模板引擎
  layui.use('laytpl', function(){
      var laytpl = layui.laytpl;
      //第三步：渲染模版
      var data =checkDeptArr;
      var getTpl = demoTpl.innerHTML;
      view = document.getElementById('viewTpl');
      if(data.length != 0){
          laytpl(getTpl).render(data, function(html){
              view.innerHTML = html;
          });
      }
  }); 
}


function onClickSelectDept(e, treeId, treeNode) {
  let zTree = $.fn.zTree.getZTreeObj("treeDemoDeptOrpeo"),
  nodes = zTree.getSelectedNodes(),
  v = "";
  h = "";
  nodes.sort(function compare(a,b){return a.id-b.id;});
  for (var i=0, l=nodes.length; i<l; i++) {
      v += nodes[i].name + ",";
      h += nodes[i].id + ",";
  }
  idsArr = h;
  idsArr = idsArr.slice(0,-1);//注意处理不为空才切割
}