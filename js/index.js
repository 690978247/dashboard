
function showRMenu(type, x, y) {
    $("#rMenu ul").show();
    if (type=="root") {
        $("#m_del").hide();
        $("#m_check").hide();
        $("#m_unCheck").hide();
    } else {
        $("#m_del").show();
        $("#m_check").show();
        $("#m_unCheck").show();
    }

    y += document.body.scrollTop;
    x += document.body.scrollLeft;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

    $("body").bind("mousedown", onBodyMouseDown);
}
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}
// 获取右侧分组数数据 以及位置树数据
async function getGruopTree (name) {
    await request.get(`bi/${appId}/groups`, {params: { appId, name }}).then(res => {
        zNodes = res.data.data
        console.log(res.data.data)
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        $.fn.zTree.init($("#treeDemoAddFenzu"), settingAddFenzu, zNodes);
        $.fn.zTree.init($("#treeDemoAdd"), settingAdd, zNodes);
    })
}
// 右侧树查询
function searchGroupTree (e) {
    getGruopTree(e.target.value)
}
function addTreeNode() {
    hideRMenu();
    var newNode = { name:"增加" + (addCount++)};
    if (zTree.getSelectedNodes()[0]) {
        newNode.checked = zTree.getSelectedNodes()[0].checked;
        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
    } else {
        zTree.addNodes(null, newNode);
    }
}
function  removeTreeNode() {
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        if (nodes[0].children && nodes[0].children.length > 0) {
            var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
            if (confirm(msg)==true){
                request.delete(`/bi/${appId}/groups/${nodes[0].id}`).then(res => {
                    if (res.data.code === 0) {
                        layer.msg('删除成功!');
                        zTree.removeNode(nodes[0]);
                    } else {
                        layer.msg(res.data.msg);
                    }
                })
            }
        } else {
            request.delete(`/bi/${appId}/groups/${nodes[0].id}`).then(res => {
                if (res.data.code === 0) {
                    layer.msg('删除成功!');
                    zTree.removeNode(nodes[0]);
                } else {
                    layer.msg(res.data.msg);
                }
            })
        }
    }
}
function checkTreeNode(checked) {
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        zTree.checkNode(nodes[0], checked, true);
    }
    hideRMenu();
}
function resetTree() {
    hideRMenu();
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}
function addNode(){
    for (var i = 0; i < zNodes.length; i++) {
     //给数组添加一个属性和属性值
     zNodes[i]["iconSkin"]="icon" + i;
    }
}




function showMenu() {
    var cityObj = $("#citySel");
    var cityOffset = $("#citySel").offset();
    $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}


function showMenuFenzu() {
    var cityObj = $("#fenzuPosition");
    // let nodes = zTree.getSelectedNodes();
    var cityOffset = $("#fenzuPosition").offset();
    $("#menuContentFenzu").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
    // zTree.setting.view.fontCss = {color: '#409EFF',background: 'red'}
    // zTree.updateNode(nodes[0])
    $("body").bind("mousedown", onBodyDown);
}
function hideMenuFenzu() {
    $("#menuContentFenzu").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContentFenzu" || $(event.target).parents("#menuContentFenzu").length>0)) {
        hideMenuFenzu();
    }
}
// 表格初始化
function initTable (id, pager) {
    id = id || defaultTd
    pager = { current: 1 , size: 10 } || pager
    // groupId 默认展示全部分组id
    request.get(`/bi/${appId}/panels`, { params: {appId, groupId: id, current: pager.current, size: pager.size }}).then(res => {

        renderTable(res.data.data.records, {size: res.data.data.size,})
        setGroupChoice(currentPositionNode.name)
        pageData = {
            totalCount: res.data.data.total, // 总条数
            totalPage: res.data.data.pages, // 总页数
            pageIndex: res.data.data.current, // 当前页
            pageSize: res.data.data.size, // 每页显示条数
        }
        renderPagination('popup-pagination')
        renderLis ()
    })
}

// 渲染表格
function renderTable (data, pager , type) { // type 勾选缓存tableCheckList， 不清除
    pager = pager ? pager : pager.size = 10
    tableData = data
    if (!type) {
        tableCheckList = []
    }
    console.log(tableCheckList)
    layui.use(['table','laydate','laypage','layer','element'], function(){
        var $ = layui.jquery
        laydate = layui.laydate //日期
        laypage = layui.laypage //分页
        layer = layui.layer //弹层
        table = layui.table //表格  
        element = layui.element //元素操作
        tableObj = table.render({});
        table.render({
            elem: '#myTable',
            data,
            skin:'nob',
            // ,totalRow:true//开启该列的自动合计功能
            // height: 870,
            page: false, //开启分页
            limit: pager.size, //每页默认显示的数量
            cellMinWidth: 60,//全局定义常规单元格的最小宽度，layui 2.2.1 新增
            cols: [[
                {type:'checkbox'},
                {field:'appId', width:'8%', title: '序号'},
                {field:'name', width:'8%', title: '名称'},
                {field:'groupName', width:'12%', title: '上级分组'},
                {field:'creatorName', width:'12%', title: '创建者'},
                {field:'updaterName', width:'15%', title: '修改人'},
                {field:'updateTime', title: '最近修改时间', width: '15%',} ,//minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
                {field:'published', title: '状态',width: '13%',},
                {field:'score', title: '操作', toolbar: '#barDemo'},
            ]],
            done: function (res, curr, count) {  //回调函数
                var resD = res.data;
                var that = this.elem.next();
                var htm = '<i class="z-table-tips"></i>';
                resD.forEach(function (item, index) {
                    var div = that.find(".layui-table-box tbody tr[data-index='" + index + "'] td[data-field='published'] div");
                    if (item.hasWaitPublish) {//判断条件，符合条件给角标 
                        div.append(htm);
                    }
                });
                //勾选事件，id集合
                tableData.forEach((item, index) => {
                    if (tableCheckList.includes(item.id)) {
                        res.data[index]["LAY_CHECKED"]='true';
                        $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                })
        }
        });
        //监听表格复选框选择
        table.on('checkbox(test)', function(obj){//checkbox(test)中的test对应table标签中lay-filter="test"的test
            if(obj.type == 'one'){    //单选操作
                if(obj.checked){     //选中
                    tableCheckList.push(obj.data.id)
                }else{      //取消选中
                    tableCheckList.forEach((item, index) => {
                        if (item === obj.data.id) {
                        tableCheckList.splice(index, 1)
                        }
                    })
                }
            }else{      //全选操作
                if(obj.checked){    //选中
                    tableData.forEach(item => {
                        if (!tableCheckList.includes(item.id) ){
                            tableCheckList.push(item.id)
                        }
                    })
                }else{
                    tableCheckList = []
                }
            }
            console.log(tableCheckList)
            if (tableCheckList.length !== 0) {
                $("#batchRelease").css("background","#409EFF");
                // $("#batchRelease").css("pointer-events", "auto")
            } else {
                $("#batchRelease").css("background","#9FCEFF"); 
                // $("#batchRelease").css("pointer-events", "none")
            }
        });

        $('#batchRelease').on('click', batchSubmitWt);
        //监听工具条
        table.on('tool(test)', function(obj){//tool(test)中的test对应table标签中lay-filter="test"的test
            var data = obj.data;
            if(obj.event === 'edit'){
            layer.msg('跳转页面');
            } else if(obj.event === 'del'){
                layer.confirm("确定要删除" + data.name + "?", {
                skin: 'z-tipdel',
                area: ['420px', '136px'],
                btn: ['取消', '删除'],
                title: "提示",
                    }, function(index, layero){
                        layer.close(index);
                    }, function(index){//index 当前行的id
                        request.delete(`/bi/${appId}/panels/${data.id}`).then(res => {
                            if (res.data.code === 0) {
                                layer.msg('删除成功!')
                                initTable(currentGroupNode.id)
                                layer.close(index);
                            } else {
                                layer.msg(res.data.msg) 
                            }
                        })
                });
            } else if(obj.event === 'offline'){
                layer.confirm("确定要下线" + data.name + "?", {
                skin: 'z-tipoffline',
                area: ['420px', '136px'],
                title: "提示",
                btn: ['取消', '下线']},
                function(index, layero){
                    //按钮【按钮一】的回调
                    layer.close(index);
                },
                function(index){
                    request.put(`/bi/${appId}/panels/${data.id}/offline`).then(res => {
                        if (res.data.code === 0) {
                            layer.msg('下线成功!')
                            initTable(currentGroupNode.id)
                            layer.close(index);
                        } else {
                            layer.msg(res.data.msg)
                        }
                    })
                });
            }else if(obj.event === 'release'){
                layer.confirm("确定要发布" + data.name + "?", {
                skin: 'z-tiprelease',
                area: ['420px', '136px'],
                title: "提示",
                btn: ['取消', '发布']},
                function(index, layero){
                    layer.close(index);
                },
                function(index){
                    request.put(`/bi/${appId}/panels/publish?ids=${data.id}`).then (res => {
                        if (res.data.code === 0) {
                            layer.msg('发布成功!')
                            initTable(currentGroupNode.id)
                            layer.close(index);
                        } else {
                            layer.msg(res.data.msg)
                        }
                        $(".layui-table-main").niceScroll({
                            cursorcolor: "#ddd",
                            cursorwidth:"10px",
                            cursorborder:"none",
                            zindex:"99999999",
                        });
                    })
                });
            }else if(obj.event === 'attribute'){
                layer.open({
                    type: 1,
                    title: ['属性', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
                    closeBtn: 1,
                    shadeClose: true,
                    skin: 'z-addDashboard',
                    content: $('#attribute') ,
                    area: ['598px', '490px'],
                    btn: ['取消', '保存'],
                    btn2: function(index, layero){
                        var name = $("#attribute-name").val();
                        var position = $("#attribute-position").find("option:selected").val();
                        var policyRadioVal = $('input[name="sex"]:checked').val();
                        var describeVal = $("#attribute-describeVal").val();
                        $("#attribute-name").removeClass("valNUllBorder");
                        $("#attribute-position-box input").removeClass("valNUllBorder");
                        if(name == ""){
                            layer.msg('请填写名称');
                            $("#attribute-name").addClass("valNUllBorder");
                            return false
                        }else if(position==""){
                            layer.msg('请选择位置');
                            $("#attribute-position-box input").addClass("valNUllBorder");
                            return false
                        }else{
                            // $.ajax({
                            //     url: methodsApi.getworkstats1_get,
                            //     type: "post",
                            //     contentType: "application/json",
                            //     data: JSON.stringify(searchObjData),
                            //     dataType: "json",
                            //     /* async: false, */
                            //     success: function (res) {
                                    
                            //     },
                            //     error: function (err) {
                            //         wui.errorNotice("获取信息失败");
                            //     }
                            // });
                        }
                    }
                });
            } else if(obj.event === 'edit'){
            layer.alert('编辑行：<br>'+ JSON.stringify(data))
            }
        });
        //表格搜索，重载
        // var $ = layui.$, activeSearch = {
        //     reload: function(){
        //         var userName = $("#userName").val();
        //         var stastVal = $("#mySelect").find("option:selected").val();
        //         var revisionTimeVal = $("#revisionTime").val();
        //         //执行重载
        //         table.reload('myTable', {	//myTable为table中的id
        //             page: {
        //             curr: 1 //重新从第 1 页开始
        //             }
        //             ,where: {
        //                 id:"10000",
        //             }
        //             }
        //         )
        //     }
        // };
        
        // $('#searchBtn').on('click', function(){	//search为搜索button中设置的id名
        //     var type = $(this).data('type');
        //     activeSearch[type] ? activeSearch[type].call(this) : '';
        // });
        // 转换时间格式，并转换为时间戳
        function tranDate (time) {
            return new Date(time.replace(/-/g, '/')).getTime();
        }
    });
}


// 查询表格数据
function searchTableData () {
    let name = $("#userName").val();
    let stateVal = $('#mySelect option:selected').val();
    let revisionTimeVal = $("#revisionTime").val();
    let startTime = revisionTimeVal.split(' - ')[0]
    let endTime = revisionTimeVal.split(' - ')[1]
    let postData = {
        appId,
        groupId: currentGroupNode.id,
        updateTimeBegin: startTime,
        updateTimeEnd: endTime,
        published: stateVal,
        name: name,
    }
    request.get(`/bi/${appId}/panels`, {params: postData}).then(res => {
        let { data } = res.data
        renderTable(data.records, {size: res.data.data.size,})
    })
    $(".layui-table-main").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
}

// 设置分组树默认选中
function setGroupChoice (name) {
    name = name || '全部分组'
    let nodes = zTree.getNodes();
    nodes.forEach((item,index) => {
        if (item.name == name) {
            zTree.selectNode(nodes[index]);
            currentGroupNode = nodes[index]
        }
    })
}

// 设置位置树默认选中
function setPositionChoice (name) {
    let addNodes = addPTree.getNodes();
    addNodes.forEach((item,index) => {
        if (item.name == name) {
            addPTree.selectNode(addNodes[index]);
        }
    })
}


$(document).on('click',"#viewTpl i", function(){
    //上面删除了哪个节点，也要修改获取选中节点数组nodes
    $(this).parent('li').remove();
    var selectId = $(this).attr("data-id");
    treeObjDept.checkNode(myNodes[selectId], false, true,true);
});



$(document).ready(async function(){
    // $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    // $.fn.zTree.init($("#treeDemoAdd"), settingAdd, zNodes);
    await getGruopTree()
    // 位置
    // $.fn.zTree.init($("#treeDemoAddFenzu"), settingAddFenzu, zNodes);
    $.fn.zTree.init($("#treeDemoCopeto"), settingCopeto, zNodesCopeto);
    $.fn.zTree.init($("#treeDemoCopeFrom"), settingCopeFrom, zNodesCopeFrom);
    $.fn.zTree.init($("#treeDemoDept"), settingDept, zNodesDept);
    $.fn.zTree.init($("#treeDemoDeptOrpeo"), settingDeptOrPeo, zNodesDeptOrpeo);
	rMenu = $("#rMenu");
    zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.expandAll(true);
    pTree = $.fn.zTree.getZTreeObj("treeDemoAdd");
    addPTree = $.fn.zTree.getZTreeObj("treeDemoAddFenzu");

    // $(".nicescroll-slideBar").niceScroll({
    //         cursorcolor: "#ddd",
    //         cursorwidth:"10px",
    //         cursorborder:"none"
    // });
    $(".layui-layer-content").niceScroll({
            cursorcolor: "#ddd",
            cursorwidth:"10px",
            cursorborder:"none"
    });
    $(".treeDemoAddNicescroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".treeDemoCopeFromScroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".treeDemoCopetoScroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".treeSelectShowScroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".z-selectDeptInp .ztree").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".rankScroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".selectPeopleScroll").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    $(".layui-table-main").niceScroll({
        cursorcolor: "#ddd",
        cursorwidth:"10px",
        cursorborder:"none",
        zindex:"99999999",
    });
    addNode();//给后台返回的tree数据添加属性
    initTable ()
});
layui.use('laydate', function(){
  var laydate = layui.laydate;
  //日期范围
    laydate.render({
        elem: '#revisionTime',
        range: true,
        value:"",
        change: function(value, date, endDate){
            searchObjData.revision = value//得到日期生成的值，如：2017-08-18
        }
    });
});
//加载form模块
layui.use('form', function() {
        var form = layui.form;
    form.on('submit(demo1)', function(data){
        var data1 = form.val("attribute");
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        //parent.layer.close(index);  // 关闭layer
        //window.parent.location.reload(); //刷新父页面
    });
    // form.on('select(mySelect)', function(data){
    //         //1:拿到select对象： 
	// 		var myselect=data.elem;
	// 		//2：拿到选中项的索引：
	// 		var index=myselect.selectedIndex ; // selectedIndex代表的是你所选中项的index
	// 		//3:拿到选中项options的value： 
	// 		searchObjData.state = myselect.options[index].value;
	// 		//4:拿到选中项options的text： 
	// 		stateText = myselect.options[index].text;
    // });
    // form.on('select(aihao)', function(data){
    //     var myselect=data.elem;
    //     var index=myselect.selectedIndex ;
    //     attributeObjData.positionVal = myselect.options[index].value;
    //     attributeObjData.positionText = myselect.options[index].text;
    // });
    form.on('radio(policyRadio)', function(data){
          policyRadioVal = data.value //被点击的 radio 的 value 值
          if( policyRadioVal =="自定义"){
            $("#z-selectDept").show();
            $("#layui-form-margin9").css("margin-bottom","0px");
          }else{
            $("#z-selectDept").hide();
            $("#layui-form-margin9").css("margin-bottom","15px");
          }
    });
});
function batchSubmitWt() {
    if(tableCheckList.length === 0) {
        return false;
    } else {
        let result = false;
        layer.confirm("确定要批量发布仪表板?", {
            skin: 'z-batchRelease',
            title:"提示",
            area: ['420px', '136px'],
            btn: ['取消', '发布']}, 
            function(index, layero){
                layer.close(index);
            },
            function(index){
                let data = tableCheckList.join(',')
                request.put(`/bi/${appId}/panels/publish?ids=${data}`).then (res => {
                    if (res.data.code === 0) {
                        layer.msg('发布成功!')
                        initTable(currentGroupNode.id)
                        layer.close(index);
                    } else {
                        layer.msg(res.data.msg)
                    }
                })
                return result
            }
        )
    }
} 
$('#addDashboard').on('click', function(){
    layer.open({
            type: 1,
            title: ['新增仪表板', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
            closeBtn: 1,
            btn: ['取消', '保存'],
            shadeClose: true,
            skin: 'z-addDashboard',
            content: $('#addDashboardContent') ,
            area: ['568px', '520px'],
            success  : function(layero,index){
                //完成后的回调
            },
            yes: function(index, layero){
                $("#addDashboardName")[0].value = ''
                $("#citySel")[0].value = ''
                pTree.cancelSelectedNode()
                layer.close(index);
            },
            btn2: function(index, layero){
                //return false 开启该代码可禁止点击该按钮关闭
                //保存的回调
                let result = false;
                let addDashboardNameVal = $("#addDashboardName").val();
                let grouping = $("#citySel").val(); 
                $("#addDashboardName").removeClass("valNUllBorder");
                $("#citySel").removeClass("valNUllBorder");
                if(addDashboardNameVal == ""){
                    layer.msg('请填写名称');
                    $("#addDashboardName").addClass("valNUllBorder");
                    return false
                }else if(grouping==""){
                    layer.msg('请选择位置');
                    $("#citySel").addClass("valNUllBorder");
                    return false
                }else{
                    let postData = {
                        appId,
                        name: addDashboardNameVal,
                        groupId: currentPositionNode.id
                    }
                    request.post(`/bi/${appId}/panels`, postData).then(res => {
                        if (res.data.code === 0) {
                            layer.msg('添加成功!')
                            layer.close(index);
                            getGruopTree()
                            $("#addDashboardName")[0].value = ''
                            $("#citySel")[0].value = ''
                            initTable(currentPositionNode.id)
                        } else {
                            layer.msg(res.data.msg)
                        }
                    })
                    // layui.table.reload('myTable', {	//myTable为table中的id
                    //         page: {
                    //         curr: 1 //重新从第 1 页开始
                    //         }
                    //     }
                    // )
                    // $(".layui-table-main").niceScroll({
                    //     cursorcolor: "#ddd",
                    //     cursorwidth:"10px",
                    //     cursorborder:"none",
                    //     zindex:"99999999",
                    // });
                }
                return result
            },
            cancel: function(){ 
                $("#addDashboardName")[0].value = ''
                $("#citySel")[0].value = ''
                pTree.cancelSelectedNode()
            }
        });
});
$('#copeConfigureTo').on('click', function(){
    layer.open({
                type: 1,
                title: ['选择要将权限配置复制到的仪表板', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
                closeBtn: 1,
                btn: ['取消', '应用'],
                shadeClose: true,
                skin: 'z-addDashboard',
                content: $('.copeConfigureForm') ,
                area: ['599px', '620px']
                ,success  : function(layero,index){
                    //完成后的回调
                }
                ,yes: function(index, layero){
                    layer.close(index);
                }
                ,btn2: function(index, layero){
                    var dataObj = ConfigureFromidsArr;
                    if(dataObj == ""){
                        layer.msg('请选择仪表板');
                        return false
                    }else{
                        // $.ajax({
                        //     url: methodsApi.getworkstats1_get,
                        //     type: "post",
                        //     contentType: "application/json",
                        //     data: JSON.stringify(searchObjData),
                        //     dataType: "json",
                        //     /* async: false, */
                        //     success: function (res) {
                                
                        //     },
                        //     error: function (err) {
                        //         wui.errorNotice("获取信息失败");
                        //     }
                        // });
                    }
                }           
    });
});
$('#copeConfigureFrom').on('click', function(){
    layer.open({
                type: 1,
                title: ['选择从哪个仪表板复制权限配置', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
                closeBtn: 1,
                btn: ['取消', '应用'],
                shadeClose: true,
                skin: 'z-addDashboard',
                content: $('.copeConfigureTo1') ,
                area: ['599px', '620px']
                ,btn2: function(index, layero){
                    var dataObj = ConfigureToidsArr;
                    if(dataObj == ""){
                        layer.msg('请选择仪表板');
                        return false
                    }else{
                        // $.ajax({
                        //     url: methodsApi.getworkstats1_get,
                        //     type: "post",
                        //     contentType: "application/json",
                        //     data: JSON.stringify(searchObjData),
                        //     dataType: "json",
                        //     /* async: false, */
                        //     success: function (res) {
                                
                        //     },
                        //     error: function (err) {
                        //         wui.errorNotice("获取信息失败");
                        //     }
                        // });
                    }
                }                     
    });
});
var selectAllData = "";
$('#z-selectDeptInp').on('click', function(){
    layer.open({
                type: 1,
                title: ['自定义访问权限', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
                closeBtn: 1,
                btn: ['取消', '保存'],
                shadeClose: true,
                skin: 'z-addDashboard',
                content: $('.z-selectDeptInp') ,
                area: ['498px', '590px']
                ,btn2: function(index, layero){
                    $("#z-selectDeptInp").val("");
                    if(checkDeptArr === ""){
                        checkDeptArr = checkDeptArr.split(",");
                    }
                    var a = jobArr.concat(peopleArr);
                    var c;
                    if(checkDeptArr != ""){
                        c =a.concat(checkDeptArr);                        
                        $("#z-selectDeptInp").val(c);
                    }else{
                        $("#z-selectDeptInp").val(a);
                    }
                    if(($("#viewTpl li").length == 0) && ($("#viewTpl2 li").length==0) && ($("#viewTpl3 li").length==0)){
                        layer.msg('请配置权限');
                        return false;
                    }        
                }                     
    });
});
//表头重置方法
$("#resetBtn").on('click',function(){
    $("#userName").val("");
    $("#revisionTime").val("");
    $("#mySelect").siblings("div.layui-form-select").find("dd:first").click();
})
//自定义权限中的职位勾选事件
var jobArr = [];
$(document).on("click","#rankSelect i",function(e){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            jobArr.splice($.inArray($(this).siblings().text(),jobArr),1);
        }else{
            $(this).addClass("active");
            jobArr.push($(this).siblings().text());
        }

        //模板引擎
        layui.use('laytpl', function(){
            var laytpl = layui.laytpl;
            //第三步：渲染模版
            var jobArrdata = jobArr;
            var getTpl = jobArrTpl.innerHTML;
            view = document.getElementById('viewTpl2');
            if(jobArrdata.length >= 0){
                laytpl(getTpl).render(jobArrdata, function(html){
                    // console.log(html);
                    view.innerHTML = html;
                });
            }
        }); 
})
var peopleArr = [];
$(document).on("click","#peopleSelect i",function(e){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        peopleArr.splice($.inArray($(this).siblings().text(),peopleArr),1);
    }else{
        $(this).addClass("active");
        peopleArr.push($(this).siblings().text());
    }
    layui.use('laytpl', function(){
        var laytpl = layui.laytpl;
        var jobArrdata = peopleArr;
        var getTpl = jobArrTpl.innerHTML;
        view = document.getElementById('viewTpl3');
        if(jobArrdata.length >= 0){
            laytpl(getTpl).render(jobArrdata, function(html){
                view.innerHTML = html;
            });
        }
    }); 
})
$(document).on("click","#viewTpl2 i",function(e){
    var jobVal = $(this).siblings().text();
    $("#rankSelect span").each(function(){
        if( $(this).text() == jobVal){
            $(this).siblings().removeClass("active");
        }
      
    });
    $(this).parents("li").remove();
    jobArr.splice($.inArray($(this).siblings().text(),jobArr),1);
})
$(document).on("click","#viewTpl3 i",function(e){
    var jobVal = $(this).siblings().text();
    $("#peopleSelect span").each(function(){
        if( $(this).text() == jobVal){
            $(this).siblings().removeClass("active");
        } 
    });
    $(this).parents("li").remove();
    peopleArr.splice($.inArray($(this).siblings().text(),peopleArr),1);
})
//主页左侧树的增删改事件
$(document).on("click","#m_add",function(e){
    layer.open({
        type: 1,
        title: ['新建分组', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
        closeBtn: 1,
        btn: ['取消', '保存'],
        shadeClose: true,
        skin: 'z-addDashboard',
        content: $('#Z-addFenZU') ,
        area: ['568px', '520px'],
        success: function(layero,index){
            //完成后的回调 如果是编辑操作，根据id获取数据回填表单
            let nodes = zTree.getSelectedNodes();
            $("#fenzuPosition")[0].value = nodes[0].name
            currentPositionNode = nodes[0]
            setPositionChoice(nodes[0].name)
        },
        yes: function(index, layero){
            $("#fenzuName")[0].value = ''
            $("#fenzuPosition")[0].value = ''
            layer.close(index);
        },
        btn2: function(index, layero){
            //return false 开启该代码可禁止点击该按钮关闭
            //保存的回调
            var dataObj = idsArr;   // id
            let result = false;
            var fenzuNameVal = $("#fenzuName").val();   //名称
            var fenzuPositionVal = $("#fenzuPosition").val();  //位置
            $("#fenzuName").removeClass("valNUllBorder");
            $("#fenzuPosition").removeClass("valNUllBorder");
            if(fenzuNameVal == ""){
                layer.msg('请填写名称');
                $("#fenzuName").addClass("valNUllBorder");
                return false
            }else if(fenzuPositionVal==""){
                layer.msg('请选择位置');
                $("#fenzuPosition").addClass("valNUllBorder");
                return false
            }else{
                let nodes = zTree.getSelectedNodes();
                let isNull = currentPositionNode.parentId ? nodes[0] : null
                let postData = {
                    name: fenzuNameVal,
                    parentId: currentPositionNode.id
                }
                request.post(`/bi/${appId}/groups`, postData).then(res => {
                    if (res.data.code === 0) {
                        layer.msg('添加成功!')
                        // let data = {
                        //     id: res.data.data,
                        //     name: fenzuNameVal,
                        //     parentId: nodes[0].id ? nodes[0].id : ''
                        // }
                        // zTree.addNodes(isNull, data);
                        layer.close(index);
                        getGruopTree()
                        $("#fenzuName")[0].value = ''
                        $("#fenzuPosition")[0].value = ''
                    } else {
                        layer.msg(res.data.msg);
                    }
                })
            }
            return result
        },
        cancel: function(){ 
            $("#fenzuName")[0].value = ''
            $("#fenzuPosition")[0].value = ''
        }
    });
})
$(document).on("click","#m_check",function(e){
    layer.open({
        type: 1,
        title: ['编辑分组', 'font-size: 20px;font-weight: 500;color: #FFFFFF;text-align:center;'],
        closeBtn: 1,
        btn: ['取消', '保存'],
        shadeClose: true,
        skin: 'z-addDashboard',
        content: $('#Z-addFenZU') ,
        area: ['568px', '520px'],
        success  : function(layero,index){
            //完成后的回调 如果是编辑操作，根据id获取数据回填表单
            let nodes = zTree.getSelectedNodes();
            $("#fenzuName")[0].value = nodes[0].name
            $("#fenzuPosition")[0].value = nodes[0].name
            currentPositionNode = nodes[0]
            setPositionChoice(nodes[0].name)
        },
        yes: function(index, layero){
            $("#fenzuName")[0].value = ''
            $("#fenzuPosition")[0].value = ''
            layer.close(index);
        },
        btn2: function(index, layero){
            //return false 开启该代码可禁止点击该按钮关闭
            //保存的回调 
            var dataObj = idsArr;   //id
            let result = false
            var fenzuNameVal = $("#fenzuName").val();   //名称
            var fenzuPositionVal = $("#fenzuPosition").val();   //位置
            $("#fenzuName").removeClass("valNUllBorder");
            $("#fenzuPosition").removeClass("valNUllBorder");
            if(fenzuNameVal == ""){
                layer.msg('请填写名称');
                $("#fenzuName").addClass("valNUllBorder");
                return false
            }else if(fenzuPositionVal==""){
                layer.msg('请选择位置');
                $("#fenzuPosition").addClass("valNUllBorder");
                return false
            }else{
                let nodes = zTree.getSelectedNodes(); 
                let postData = {
                    id: currentPositionNode.id,
                    name: fenzuNameVal,
                    parentId: currentPositionNode.parentId
                }
                request.put(`/bi/${appId}/groups`, postData).then(res => {
                    if (res.data.code === 0) {
                        layer.msg('编辑成功!')
                        nodes[0].name = fenzuNameVal
                        layer.close(index);
                        getGruopTree()
                        $("#fenzuName")[0].value = ''
                        $("#fenzuPosition")[0].value = ''
                    } else {
                        layer.msg(res.data.msg);
                    }
                })
            }
            return result
        },
        cancel: function(){ 
            $("#fenzuName")[0].value = ''
            $("#fenzuPosition")[0].value = ''
        }
    });
})