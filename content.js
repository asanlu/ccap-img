// chrome.storage.local.get("screenshot", function (data) {
//   var img = new Image();
//   img.onload = function () {
//     var marker = document.createElement("div");
//     marker.setAttribute("id", "screenshot-marker");
//     marker.style.position = "absolute";
//     marker.style.top = "0";
//     marker.style.left = "0";
//     marker.style.width = img.width + "px";
//     marker.style.height = img.height + "px";
//     marker.style.backgroundImage = "url('" + data.screenshot + "')";
//     marker.style.zIndex = "9999";
//     marker.style.pointerEvents = "none";
//     document.body.appendChild(marker);
//   };
//   img.src = data.screenshot;
// });

// window.addEventListener('DOMContentLoaded', function () {
// });



// 创建capture dom
function createCaptureHTML() {
  const captDiv = document.createElement("div")
  captDiv.setAttribute('id', 'capture-div');

  const inDiv = `
    <div class="capt-point capt-top"></div>
    <div class="capt-point capt-left"></div>
    <div class="capt-point capt-right"></div>
    <div class="capt-point capt-bottom"></div>
    <div class="capt-point capt-top-left"></div>
    <div class="capt-point capt-top-right"></div>
    <div class="capt-point capt-bottom-left"></div>
    <div class="capt-point capt-bottom-right"></div>
    <img id="capt-img" style="display:none;">
    <div class="capt-ctrl">
      <button id="capt-dele" type="button">删除</button>
      <button id="capt-comf" type="button">确定</button>
    </div>
  `
  //需要调整尺寸的div
  // let container = document.getElementById('container')
  // 鼠标松开事件
  captDiv.addEventListener('mouseup', up)
  // 鼠标按下事件
  document.querySelector('body').addEventListener('mousedown', down)
  // body监听移动事件
  document.querySelector('body').addEventListener('mousemove', move)
  captDiv.addEventListener('click', function () {
    document.querySelector('#capt-dele').addEventListener('click', getSreenshot)
    document.querySelector('#capt-comf').addEventListener('click', getSreenshot)
  })

  // 是否开启尺寸修改
  let resizeable = false
  // 鼠标按下时的坐标，并在修改尺寸时保存上一个鼠标的位置
  let clientX, clientY
  // div坐标
  let offsetX, offsetY;
  // div可修改的最小宽高
  let minW = 300, minH = 100
  // 鼠标按下时的位置，使用n、s、w、e表示
  let direc = ''
  // 添加拖动功能
  let isDragging = false;

  // 鼠标松开时结束尺寸修改
  function up() {
    resizeable = false
    isDragging = false
  }

  // 鼠标按下时开启尺寸修改
  function down(e) {
    // console.log(e.target)
    let d = getDirection(e)
    // 当位置为四个边和四个角时才开启尺寸修改
    // if (d !== '') {
    // e.stopPropagation();
    if (e.target.className.indexOf('capt-point') >= 0) {
      resizeable = true
      direc = d
      clientX = e.clientX
      clientY = e.clientY
    }
    if (e.target.id.indexOf('capture-div') >= 0) {
      isDragging = true;
      offsetX = e.clientX - captDiv.offsetLeft;
      offsetY = e.clientY - captDiv.offsetTop;
    }
  }

  // 鼠标移动事件
  function move(e) {
    // console.log(e);
    let d = getDirection(e)
    let cursor
    if (d === '') cursor = 'move';
    else cursor = d + '-resize';
    // 修改鼠标显示效果
    captDiv.style.cursor = cursor;
    // 当开启尺寸修改时，鼠标移动会修改div尺寸
    if (resizeable) {
      // 鼠标按下的位置在右边，修改宽度
      if (direc.indexOf('e') !== -1) {
        captDiv.style.width = Math.max(minW, captDiv.offsetWidth + (e.clientX - clientX)) + 'px'
        clientX = e.clientX
      }

      // 鼠标按下的位置在上部，修改高度
      if (direc.indexOf('n') !== -1) {
        captDiv.style.height = Math.max(minH, captDiv.offsetHeight + (clientY - e.clientY)) + 'px'
        clientY = e.clientY
      }
      // 鼠标按下的位置在底部，修改高度
      if (direc.indexOf('s') !== -1) {
        captDiv.style.height = Math.max(minH, captDiv.offsetHeight + (e.clientY - clientY)) + 'px'
        clientY = e.clientY
      }

      // 鼠标按下的位置在左边，修改宽度
      if (direc.indexOf('w') !== -1) {
        captDiv.style.width = Math.max(minW, captDiv.offsetWidth + (clientX - e.clientX)) + 'px'
        clientX = e.clientX
      }
    }
    // 拖拽
    if (isDragging) {
      captDiv.style.left = (e.clientX - offsetX) + 'px';
      captDiv.style.top = (e.clientY - offsetY) + 'px';
    }
  }

  // 获取鼠标所在div的位置
  function getDirection(ev) {
    let dir = '';
    if (ev.target.className.indexOf('top') >= 0) dir += 'n';
    else if (ev.target.className.indexOf('bottom') >= 0) dir += 's';
    if (ev.target.className.indexOf('left') >= 0) dir += 'w';
    else if (ev.target.className.indexOf('right') >= 0) dir += 'e';
    return dir;
  }

  captDiv.innerHTML = inDiv;
  document.body.appendChild(captDiv);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('===on Message===');
  console.log('===request===', request);
  switch (request.action) {
    case "addCapture":
      createCaptureHTML();
      break;
    case "saveCaptureImg":
      let capt = document.getElementById("capture-div");
      let img = document.getElementById("capt-img");
      // console.log(request.dataUrl);
      img.src = request.dataUrl;
      img.style.display = "block";
      img.style.left = capt.offsetLeft + "px";
      img.style.top = capt.offsetTop + "px";
      img.style.width = capt.offsetWidth + "px";
      img.style.height = capt.offsetHeight + "px";
      break;
    default:
      break;
  }


  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, { number: request.number + 1 }, (response) => {
  //     console.log(
  //       `background -> content script infos have been received. number: ${response.number}`
  //     );
  //   });
  // });
  // 消息回传
  sendResponse({ number: request.number });
});

function getSreenshot() {
  chrome.runtime.sendMessage({ action: "screenshot" }, (response) => {
    console.log(
      `content script -> background infos have been received. number: ${response}`
    );
    
  });
}