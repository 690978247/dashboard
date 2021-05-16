/* 分页部分 */
let data = []
// 渲染分页组件
// <div class="visual-pagination-select">
    // <ul>
    // <li value="10" ${pageData.pageSize === 10 ? 'selected': '' }>10条/页</li>
    // <li value="20" ${pageData.pageSize === 20 ? 'selected': ''  }>20条/页</li>
    // <li value="30" ${pageData.pageSize === 30 ? 'selected': ''}>30条/页</li>
    // <li value="40" ${pageData.pageSize === 40 ? 'selected': '' }>40条/页</li>
    // </ul>
    // </div>
function renderPagination (ref) { // ref参数为渲染根元素
  let pagination = document.getElementById(ref)
  let page = `<div class="visual-pagination">
    <span>共 ${pageData.totalCount} 条</span>
    
    <select class="visual-pagination-select" onchange="perPage(event)" >
      <option  value="10" ${pageData.pageSize === 10 ? 'selected': '' }><div class="selectOption">10条/页</div></option>
      <option  value="20" ${pageData.pageSize === 20 ? 'selected': '' }>20条/页</option>
      <option  value="30" ${pageData.pageSize === 30 ? 'selected': '' }>30条/页</option>
      <option  value="40" ${pageData.pageSize === 40 ? 'selected': '' }>40条/页</option>
    </select>
    <button type="button" onclick="nextPage(event)" id="pager-left-btn" class="visual-pagination-button" ${pageData.pageIndex <= 1 ? 'disabled' : ''}><i class="iconfont iconzuojiantou"></i></button>
    <ul class="visual-pager" id="visual-pager" onclick="changePage(event)" >
    </ul>
    <button type="button" onclick="prevPage(event)" id="pager-right-btn"  class="visual-pagination-button"  ${pageData.pageIndex === pageData.totalPage || pageData.pageIndex <= 0 ? 'disabled' : ''}><i class="iconfont iconyoujiantou_huaban"></i></button>
    <span>前往</span>
    <input type="text" class="pager-input" id="pager-input" onblur="jumpPage(event)" value="${pageData.pageIndex}" >
    <span>页</span>
  </div>`
  pagination.innerHTML = page
}
// 渲染分页页码
function renderLis () {
  let lis = ``
  let cur = pageData.pageIndex - 1
  let pager = document.getElementById('visual-pager')
  let items = Math.ceil(pageData.totalCount / pageData.pageSize )
  for (var i = 0; i <= items - 1; i++) {
    if (i === cur) {
      lis += `<li class="activePage" >${i + 1}</li>`
    } else if (cur <= 3) { //pageIndex 小于等于4 处于页首时，
      if (i <= 5) {
        lis += `<li >${i + 1}</li>`
      } else if (i === 6) {
        lis += `<li >...</li>`
      } else if ( i > 6 && i < pageData.totalPage - 1) {
        lis += ``
      } else if (i === pageData.totalPage - 1) {
        lis += `<li >${i + 1}</li>`
      } else {
        lis += `<li >${i + 1}</li>`
      }
    } else if (cur >=4 && cur <= pageData.totalPage - 5) {   // pageIndex 处于页面中间
      if (i === 0) {
        lis += `<li >${i + 1}</li>`
      } else if (i <= cur && i >= cur - 2) {
        lis += `<li >${i + 1}</li>`
      } else if (i >= cur && i <= cur + 2) {
        lis += `<li >${i + 1}</li>`
      } else if (i === pageData.totalPage - 1) {
        lis += `<li >${i + 1}</li>`
      } else if (i <= cur && i === cur - 3) {
        lis += `<li >...</li>`
      } else if (i >= cur && i === cur + 3) {
        lis += `<li >...</li>`
      } else {
        lis += ``
      }
    } else {  //pageIndex 处于页尾时
      if (i === 0) {
        lis += `<li >${i + 1}</li>`
      } else if (i === 1) {
        lis += `<li >...</li>`
      } else if (i > 1 && i < pageData.totalPage - 6) {
        lis += ``
      } else {
        lis += `<li >${i + 1}</li>`
      }
    }
    //   lis += `<li >${i + 1}</li>`
    // }
  }
  pager.innerHTML = lis
}

// 获取表格数据
function getTableData (postData) {
  showloading(true)
  request.get(`/bi/${appId}/panels`, {params: postData}).then(res => {
    showloading(false)
    let { data,msg } = res.data
    if(data != null && data != ''){
      renderTable(data.records, {size: res.data.data.size,pageIndex:res.data.data.current}, 'flashCheck')
      renderPagination('popup-pagination')
      renderLis ()
      setPermissions()
  }else{
      layer.confirm(msg, {
          skin: 'z-tipoffline',
          area: ['420px', '136px'],
          title: "提示",
          btn: ['确定']},
          function(index, layero){
              //按钮【按钮一】的回调
              layer.close(index);
          }
      );
  }
  })
}

// 设置左右按钮禁用
function setDisable () {
  let left = document.getElementById('pager-left-btn')
  let right = document.getElementById('pager-right-btn')
  if (pageData.pageIndex <= 1) {
    left.setAttribute('disabled', true)
  } else {
    left.removeAttribute('disabled')
  }
  if (pageData.pageIndex === pageData.totalPage || pageData.pageIndex <= 0) {
    right.setAttribute('disabled', true)
  } else {
    right.removeAttribute('disabled')
  }
}
// 下一页
function nextPage (e) {
  let pagerInput = document.getElementById('pager-input')
  pageData.pageIndex--
  changePage(e, 'prev')
  pagerInput.value = pageData.pageIndex
  addActice ()
}
// 上一页
function prevPage (e) {
  let pagerInput = document.getElementById('pager-input')
  pageData.pageIndex++
  changePage(e, 'prev')
  pagerInput.value = pageData.pageIndex
  addActice ()
}
// 页面跳转
function jumpPage (e) {
  let value = null
  if (e.target.value <= pageData.totalPage) {
    value = Number(e.target.value) 
  } else {
    e.target.value = pageData.totalPage
    value = Number(pageData.totalPage)
  }
  if (e.target.value <= 0) {
    e.target.value = 1
    value = 1
  }
  
  pageData.pageIndex = value
  changePage(e, 'prev')
  addActice ()
}
// 设置当前页高亮
function addActice () {
  let pager = document.getElementById('visual-pager')
  let items = [...pager.children]
  items.forEach((d,i) => {
    if (Number(d.innerText) === Number(pageData.pageIndex)) {
      items[i].classList.add('activePage')
    } else {
      items[i].classList.remove('activePage')
    }
  })
}
// 翻页 表格显示条数
function homePage () {
  if(pageData.pageIndex == 1){
    data = tableData.slice(0, pageData.pageSize)
  }else{
    data = tableData.slice((pageData.pageIndex - 1)* pageData.pageSize,pageData.pageSize * pageData.pageIndex)
  }
  return data
}
// 选择每页显示多少条数据
function perPage (e) {
  let pagerInput = document.getElementById('pager-input')
  let html = ``
  pageData.pageIndex = 1
  pageData.pageSize = Number(e.target.value)
  pagerInput.value =  pageData.pageIndex
  pageData.totalPage = Math.ceil(pageData.totalCount / pageData.pageSize )
  renderLis()
  setDisable ()
  let postData = {
    appId,
    groupId: currentGroupNode.id,
    current: pageData.pageIndex,
    size: pageData.pageSize
  }
  getTableData (postData)
}

// 页码点击
function changePage (e, type) {
  let pagerInput = document.getElementById('pager-input')
  let html = ``
  if (!type) {
    if (e.target.innerText == '...') {
      pageData.pageIndex = Number(e.target.previousElementSibling.innerText) + 1
    } else {
      pageData.pageIndex = Number(e.target.innerText)
    }
  }
  pagerInput.value =  pageData.pageIndex
  let postData = {
    appId,
    groupId: currentGroupNode.id,
    current: pageData.pageIndex,
    size: pageData.pageSize
  } 
  getTableData(postData)
  renderLis()
  setDisable ()
}