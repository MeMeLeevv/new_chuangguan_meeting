;
(function ($, win, doc) {
  // 主视觉逻辑如下： 当用户轮动到相应的页面的时候，先监听当前栏目的信息（id、名称——可以在滚动小圆点hover的时候给提示、type）主要是根据type来加载样式
  // 也可以一开始就拉取navbar列表的数据，然后根据type以及id全部拉取数据
  var cg_sec = {
    data: {
      headerHeight: '76px',
      id: '', // 栏目id
      type: '', //栏目类型
      bgUrl: '', // ,每屏背景，默认是全局背景
      fullpageSelector: '.cg_fullpage',
      secClass: '.section',
      sectionSonClass: 'div.fp-tableCell', // 每个section类的直接子元素，由于我们有header，pullpage考虑header的高度便在初始化的时候在section类下加上了这个元素
      absoluteClass: '.centerAbsolute', // 动态插入栏目内容的父元素
      defaultImg: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8', // 默认图片
      secsMsg: [], // 每个栏目信息
      navigationTooltips: [], // fullpage小圆点hover的时候可以给提示
      typeMap: {
        // 根据type来布置每个栏目的id选择器
        // 栏目类型
        1: 'cg_headImage',
        2: 'cg_background',
        3: 'cg_highlight',
        4: 'cg_scale',
        5: 'cg_excellenceAwardOrAddress',
        6: 'cg_guests',
        7: 'cg_agendaOrContactOrRegis',
        8: 'cg_news',
        9: 'cg_agendaOrContactOrRegis',
        10: 'cg_parnerOrMedia',
        11: 'cg_parnerOrMedia',
        12: 'cg_excellenceAwardOrAddress',
        13: 'cg_agendaOrContactOrRegis'
      },
    },
    init: function (params) {
      cg_sec.getColumnList()
      // console.log(Math.floor(5 / 8), '5 / 8')
      // console.log(5 % 8, '5 % 8')
    },
    /* 
    获取栏目列表，初始化屏数,将type和c_id来获取每个栏目的内容
    @param { Node.ELEMENT_NOD } node 元素节点
    @return { Boolean } 
     */
    getColumnList: function () {

      cg.request('/front/column/getColumnList', {
        p_id: p_id,
      }, function (data) {
        var result = data.data;
        if (data.code == 1) {
          // 保存大会项目信息
          var fullpageWrap = $(cg_sec.data.fullpageSelector)
          var sec_frag = ''

          console.log(result[7], 'section');
          // 根据列表item个数创建pullPage页数以及每页的框架
          for (let i = 0; i < result.length; i++) {
            let data = result[i]
            // 保存栏目信息
            cg_sec.data.secsMsg.push(result[i])
            // 每页fullpage框架
            sec_frag += `<div class="section centerRelative ${cg_sec.data.typeMap[data.type]}"
            data-c_id="${data.c_id}" data-type="${data.type}" data-tooltip="${data.name}">
              <div class="centerAbsolute"></div>
            </div>`
          }
          // 将新的Dom元素插入到文档中
          fullpageWrap.html(sec_frag)

          // 初始化fullpage插件
          $(cg_sec.data.fullpageSelector).fullpage({
            //options here
            scrollingSpeed: 700, //滚动速度，单位为毫秒
            autoScrolling: true, //是否使用插件的滚动方式，如果选择 false，则会出现浏览器自带的滚动条
            scrollHorizontally: true,
            navigation: true, //显示一个由小圆圈组成的导航栏
            navigationPosition: 'left', // 定义导航栏显示的位置
            navigationTooltips: cg_sec.data.navigationTooltips, //（默认为[]）定义要使用导航圈的工具提示。 如果您愿意，也可以在每个部分中使用属性data-tooltip来定义它们
            paddingTop: cg_sec.data.headerHeight, //与顶部的距离
            /* onLeave: function (origin, destination, direction) { // 一旦用户离开 section ，过渡到新 section ，就会触发此回调。 返回 “false” 将在移动发生之前取消移动。
              var leavingSection = this;

              //离开第二个section后
              if (origin.index == 1 && direction == 'down') {
                alert("前往第3个section！");
              } else if (origin.index == 1 && direction == 'up') {
                alert("前往第1个section！");
              }
              console.log(destination, 'destination') // 下一页的page信息
            } */
          });
          //console.log(fullpage_api.getActiveSection(), 'activeSection') // 当前激活的page信息
          fullpage_api.silentMoveTo(6, 0)
          // 拉取到栏目列表后初始化所有栏目内容
          cg_sec.initAllSection()
        }
      });
    },
    /* 
    初始化所有section的内容
    @return null
    */
    initAllSection: function () {
      let sectionHtmls = $(cg_sec.data.secClass)
      // console.log(sectionHtmls, 'sectionHtmls')

      // 循环每个section框架，通过c_id来拉取数据、type来选择布局样式
      sectionHtmls.each(function (index, item) {
        console.log(item.dataset.type, 'sectionHtmls')
        let type = item.dataset.type
        let c_id = item.dataset.c_id
        switch (type) {
          case '1':
          case '2': 
          case '5':
          case '12':{
            if (type == '1') { // 大会头图
              cg_sec.createHeadImage($(this), index)
            } else if (type == '2') { // 大会背景
              cg_sec.createBackground($(this), index)
            }else if (type == '5' || type == '12') { // 卓越成就奖或活动地址
              cg_sec.createExcelAOrAddr($(this), index)
            }
            break
          }
          case '3':
          case '6':
          case '8': {
            let $this = $(this) // 保存最外层的dom元素
            if (type == '3') { // 大会亮点,要再拉一组栏目内容数据
              cg.request('/front/columnObjgroup/getColumnObjGroupList', { //获取第一组栏目内容组
                c_id
              }, function (data) {
                let result = data.data;
                if (data.code == 1) {
                  // 获取内容组的group_id
                  let group_id = result[0].group_id
                  cg.request('/front/columnObj/getColumnObjList', { //获取栏目内容
                    group_id
                  }, function (data) {
                    let result = data.data;
                    if (data.code == 1) {
                      // 获取内容组的group_id
                      console.log(result, 'result')
                      cg_sec.createHighlight($this, index, result)
                    }
                  });
                }
              });
            } else if (type == '6') { // 大会嘉宾,要再拉一组栏目内容数据
              cg.request('/front/columnObjgroup/getColumnObjGroupList', { //获取第一组栏目内容组
                c_id
              }, function (data) {
                let result = data.data;
                if (data.code == 1) {
                  // 获取内容组的group_id
                  let group_id = result[0].group_id
                  cg.request('/front/columnObj/getColumnObjList', { //获取栏目内容
                    group_id
                  }, function (data) {
                    let result = data.data;
                    if (data.code == 1) {
                      // 获取内容组的group_id
                      console.log(result, 'result')
                      cg_sec.createGuests($this, index, result)
                    }
                  });
                }
              });
            } else if (type == '8') { // 大会资讯,要再拉一组栏目内容数据
              console.log('888')
              cg.request('/front/columnObjgroup/getColumnObjGroupList', { //获取第一组栏目内容组
                c_id
              }, function (data) {
                let result = data.data;
                if (data.code == 1) {
                  // 获取内容组的group_id
                  let group_id = result[0].group_id
                  cg.request('/front/columnObj/getColumnObjList', { //获取栏目内容
                    group_id
                  }, function (data) {
                    let result = data.data;
                    if (data.code == 1) {
                      // 获取内容组的group_id
                      console.log(result, 'result')
                      cg_sec.createNews($this, index, result)
                    }
                  });
                }
              });
            }
            break;
          }
          default: {

          }
        }
      })
    },
    /* 
    创建大会头图 直接覆盖section的背景
    @return null
    */
    createHeadImage: function ($dom, index) {
      let bgImg = cg_sec.data.secsMsg[index].background_img || cg_sec.data.defaultImg
      $dom.children(cg_sec.data.sectionSonClass).css({
        'background': `url(${bgImg}) no-repeat`,
        'background-size': 'cover'
      })
    },
    /* 
    创建大会背景 
    @return null
    */
    createBackground: function ($dom, index) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let desc_content = cg_sec.data.secsMsg[index].desc_content

      let innerHtml = `
      ${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
        <div class="cDesc">${desc_content}</div>
        `
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    },
    /* 创建卓越成就奖或大会地址 */
    createExcelAOrAddr ($dom, index) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let cbg = cg_sec.data.secsMsg[index].background_img

      let innerHtml = `
      ${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
      <img class="cBg shadow" src=${cbg} alt="" />`
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    },
    /* 创建大会亮点 */
    createHighlight: function ($dom, index, resultArr) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let hLGroup = ''
      for (let i = 0; i < resultArr.length; i++) {
        let itemTitle = resultArr[i].title
        let titleBg = resultArr[i].title_img || cg_sec.data.defaultImg
        let itemContent = resultArr[i].content
        let itemBg = resultArr[i].background_img || cg_sec.data.defaultImg
        hLGroup += `
        <div class="hLGroup" style="background: url(${itemBg}) no-repeat; background-size: cover">
          <div class="wrap">
          <div class="gTitle" style="background: url(${titleBg}) no-repeat; background-size: cover">${itemTitle}</div>
            <div class="desc">
              ${itemContent}
            </div>
          </div>
        </div>`
      }
      let hLContent = `
      <div class="hLContent">
        ${hLGroup}
      </div>`
      innerHtml += hLContent
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    },
    /* 创建大会嘉宾，swiper插件以n个数据为一组 */
    createGuests: function ($dom, index, resultArr) {
      let num = 10
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let resultLen = resultArr.length
      let result2Arr = [] // 二维数组，每位保存一页swiper的数据组
      let divisor = Math.floor(resultLen / num) // 除数
      let remainder = resultLen % num // 余数

      for (let i = 0; i < divisor; i++) { // 循环除数，将n位数据压进result2Arr
        let arrn = resultArr.slice(i * num, (i + 1) * num)
        result2Arr.push(arrn)
      }
      result2Arr.push(resultArr.slice(-remainder)) // 将余数最后压进result2Arr
      let swiperWrap = ''
      let inputWrap = ''
      let ulWrap = ''
      let liWrap = ''

      let arrowsWrap = ''
      for (let i = 0; i < result2Arr.length; i++) {
        let liFlipWrap = ''
        if (i === 0) {
          inputWrap += `<input type="radio" name="slides" id="slides_${i}" checked />` // 默认第一张激活
        } else {
          inputWrap += `<input type="radio" name="slides" id="slides_${i}" />`
        }
        arrowsWrap += `<label for="slides_${i}"></label>`

        for (let j = 0; j < result2Arr[i].length; j++) {
          liFlipWrap +=
            `<div class="flipWrap">
            <div class="flip">
              <div class="front gGroup centerRelative">
                <div class="centerAbsolute">
                  <img
                    class="gAvatar"
                    src=${result2Arr[i][j].main_img}
                    alt=""
                  />
                  <div class="gname ellipsis">${result2Arr[i][j].name}</div>
                  <div class="gdesc">${result2Arr[i][j].content}</div>
                </div>
              </div>
              <div class="back gGroup centerRelative">
                <div class="centerAbsolute">
                  <img
                    class="gAvatar"
                    src=${result2Arr[i][j].main_img}
                    alt=""
                  />
                  <div class="gname ellipsis">${result2Arr[i][j].name}</div>
                  <div class="gdesc">${result2Arr[i][j].content}</div>
                </div>
              </div>
            </div>
          </div>`
        }
        liWrap += `<li>${liFlipWrap}</li>`
      }
      ulWrap += `<ul>${liWrap}</ul>`
      swiperWrap =
        `<div class="gContent">
        <div class="csslider">
          ${inputWrap + ulWrap}
          <div class="arrows">
            ${arrowsWrap}
          </div>
          <div class="navigation">
            <div>
              ${arrowsWrap}
            </div>
          </div>
        </div>
      </div>`
      innerHtml += swiperWrap
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)

    },
    /* 创建大会资讯，scroll插件*/
    createNews: function ($dom, index, resultArr) {
      let num = 10
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let nItemWrap = ''
      let nWrap = ''
      for (let i = 0; i < resultArr.length; i++) {
        nItemWrap += `
        <span class="nItem" style="background: url(${resultArr[i].background_img}) no-repeat;background-size: cover;">
            <img
              class="mainImg"
              src=${resultArr[i].main_img}
              alt=""
            />
            <span class="words">
              <div class="title">
                ${resultArr[i].title}
              </div>
              <div class="desc">
                ${resultArr[i].content}
              </div>
            </span>
          </span>`
      }
      nWrap = `<div class="nWrap mCustomScrollbar">$${nItemWrap}</div>`
      innerHtml += nWrap
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)

    },
    createScale: function () {
      let data = {
        name: '大会规模',
        cid: '123',
        type: '4',
        title: true,
        imgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f'
      }
      var fullpageWrap = document.querySelector(cg.data.fullpageSelector)
      var fragment = document.createDocumentFragment()
      //创建大会规模title
      let title
      if (data.title) { // 先判断title是图片还是文字
        title = cg.createElement('div', [
          ['className', 'cTitle']
        ], null, data.name)
      } else {
        title = cg.createElement('img', [
          ['src', data.imgSrc],
          ['alt', '大会规模图片'],
          ['className', 'cTitleBg']
        ])
      }
      fragment.appendChild(title)
      //创建大会规模内容图
      let contentImg = cg.createElement('img', [
        ['className', 'cBg shadow'],
        ['src', data.imgSrc]
      ])
      fragment.appendChild(contentImg)
      //创建承载大会规模content的主体
      let content = cg.createElement('div', [
        ['className', 'centerAbsolute']
      ])
      content.appendChild(fragment)
      //创建大会头图框架
      let scale = cg.createElement('div', [
        ['className', 'section centerRelative cg_'],
        ['title', '大会规模 —— title文字/titleBg、栏目背景图']
      ], [
        ["cid", '123'],
        ['type', '4']
      ])
      scale.appendChild(content)
      fullpageWrap.insertBefore(scale, fullpageWrap.firstChild)
    },
  }
  $(function () {

    cg_sec.init();


  })
})(jQuery, window, document)