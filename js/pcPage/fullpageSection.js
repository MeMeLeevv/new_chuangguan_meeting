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

      scaleWidthClass: '.cg_scale .hLContent .percentBar',
      scaleNumClass: '.cg_scale .hLContent .num',
      scalePerNum: [], // 保存大会规模的百分比
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
        13: 'cg_contact'
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

          console.log(result, 'section');
          // 根据列表item个数创建pullPage页数以及每页的框架
          for (let i = 0; i < result.length; i++) {
            let data = result[i]
            // 保存栏目信息
            cg_sec.data.secsMsg.push(result[i])
            // 每页fullpage框架
            if (data.type == 6) { // 大会嘉宾不需要centerRelative类
              sec_frag += `<div class="section ${cg_sec.data.typeMap[data.type]}"
            data-c_id="${data.c_id}" data-type="${data.type}" data-tooltip="${data.name}">
              <div class="centerAbsolute"></div>
            </div>`
            } else {
              sec_frag += `<div class="section centerRelative ${cg_sec.data.typeMap[data.type]}"
            data-c_id="${data.c_id}" data-type="${data.type}" data-tooltip="${data.name}">
              <div class="centerAbsolute"></div>
            </div>`
            }
          }
          // 将新的Dom元素插入到文档中
          fullpageWrap.html(sec_frag)

          // 初始化fullpage插件
          fullpageWrap.fullpage({
            //options here
            scrollingSpeed: 700, //滚动速度，单位为毫秒
            autoScrolling: true, //是否使用插件的滚动方式，如果选择 false，则会出现浏览器自带的滚动条
            scrollHorizontally: true,
            navigation: true, //显示一个由小圆圈组成的导航栏
            navigationPosition: 'left', // 定义导航栏显示的位置
            navigationTooltips: cg_sec.data.navigationTooltips, //（默认为[]）定义要使用导航圈的工具提示。 如果您愿意，也可以在每个部分中使用属性data-tooltip来定义它们
            paddingTop: cg_sec.data.headerHeight, //与顶部的距离
            lazyLoading: true,
            //events
            onLeave: function (origin, destination, direction) {
              if (origin.index == 4) {
                for (let i = 0; i < cg_sec.data.scalePerNum.length; i++) {
                  document.querySelectorAll(cg_sec.data.scaleWidthClass)[i].style.width = '0%'
                  document.querySelectorAll(cg_sec.data.scaleNumClass)[i].innerHTML = '0%'
                  }
              }
            },
            afterLoad: function (origin, destination, direction) {
              if (destination.index == 4) {
                for (let i = 0; i < cg_sec.data.scalePerNum.length; i++) {
                document.querySelectorAll(cg_sec.data.scaleWidthClass)[i].style.width = `${cg_sec.data.scalePerNum[i] - -30}%`
                cg_sec.countUp(document.querySelectorAll(cg_sec.data.scaleNumClass)[i],0 ,cg_sec.data.scalePerNum[i]-0, 2, 50)
                }
              }
            },
            afterRender: function () {},
            afterResize: function (width, height) {},
            afterReBuild: function () {},
            afterResponsive: function (isResponsive) {},
            afterSlideLoad: function (section, origin, destination, direction) {},
            onSlideLeave: function (section, origin, destination, direction) {
            }
          });
          //console.log(fullpage_api.getActiveSection(), 'activeSection') // 当前激活的page信息
           ///fullpage_api.silentMoveTo(7, 0)
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
        let type = item.dataset.type
        let c_id = item.dataset.c_id
        switch (type) {
          case '1':
          case '2':
          case '5':
          case '12': { // 只需请求栏目
            if (type == '1') { // 大会头图
              cg_sec.createHeadImage($(this), index)
            } else if (type == '2') { // 大会背景
              cg_sec.createBackground($(this), index)
            } else if (type == '5' || type == '12') { // 卓越成就奖或活动地址
              cg_sec.createExcelAOrAddr($(this), index, type)
            }
            break
          }
          case '3':
          case '4':
          case '6':
          case '8':
          case '7':
          case '9':
          case '13': { // 只需请求栏目及一组栏目内容组数据
            let $this = $(this) // 保存最外层的dom元素
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
                    if (type == '3') {
                      cg_sec.createHighlight($this, index, result)
                    } else if (type == '4') {
                      cg_sec.createScale($this, index, result)
                    } else if (type == '6') {
                      cg_sec.createGuests($this, index, result)
                    } else if (type == '8') {
                      cg_sec.createNews($this, index, result)
                    } else if (type == '7' || type == '9' || type == '13') {
                      cg_sec.createAgendaOrContactOrRegis($this, index, result, type)
                    }
                  }
                });
              }
            });
            break;
          }
          case '10':
          case '11': { // 需要请求栏目信息以及多层栏目内容组,合作伙伴和媒体
            let $this = $(this) // 保存最外层的dom元素
            cg.request('/front/columnObjgroup/getColumnObjGroupList', { //获取第一组栏目内容组
              c_id
            }, function (data) {
              let result = data.data;
              if (data.code == 1) {
                let pGroup = ''
                let promiseArr = []
                for (let i = 0; i < result.length; i++) {
                  // 获取内容组的group_id
                  let group_id = result[i].group_id
                  let gTitle = result[i].name
                  let promiseItem = new Promise((resolve, reject) => {
                    cg.request('/front/columnObj/getColumnObjList', { //获取栏目内容
                      group_id
                    }, function (data) {
                      resolve(data)
                    })
                  }).then(data => {
                    let result = data.data;
                    if (data.code == 1) {
                      // 获取内容组的group_id
                      pGroup += `<div class="pGroup">
                        <div class="pTitle">
                        ${gTitle}</div>${cg_sec.createMulPartnersG($this, index, result, pGroup)}</div>`
                    }
                  }).catch(err => {
                    throw new Error('partners or media has an error' + err)
                  })
                  promiseArr.push(promiseItem)
                }
                Promise.all(promiseArr).then(res => {
                  cg_sec.createMulPartnersW($this, index, pGroup)
                })
              }
            })
            break;
          }
          default: {

          }
        }
      })
    },
    /* 
    数字渐增
    @return null
    */
   countUp: function (dom, start, aim, dur, interval) {
    let ins = setInterval(() => {
      if (start >= aim) {
        dom.innerHTML = `${aim}%`
        clearInterval(ins)
        return
      } else {
        start += dur
        dom.innerHTML = `${start}%`
      }
    }, interval);
  },
    /* 
    创建合作伙伴或者合作媒体Wrap
    @return null
    */
    createMulPartnersW: function ($dom, index, innerG) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
    <div class="pWrap mCustomScrollbar">${innerG}</div>`
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    },
    /* 
    创建合作伙伴或者合作媒体
    @return null
    */
    createMulPartnersG: function ($dom, index, resultArr, pGroup) {
      let hLGroup = ''
      for (let i = 0; i < resultArr.length; i++) {
        let itemBg = resultArr[i].background_img || cg_sec.data.defaultImg
        hLGroup += `
      <img src=${itemBg} class="pItem"></img>`
      }
      let hLContent = `
    <div class="pContent">
      ${hLGroup}
    </div>`
      return hLContent
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
      let desc_content = cg_sec.data.secsMsg[index].desc_content.replace(/\n|\r\n/g, "<br/>").replace(/\s/g, "&nbsp");
      let innerHtml = `
      ${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
        <div class="cDesc">${desc_content}</div>
        `
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    },
    /* 创建卓越成就奖或大会地址 */
    createExcelAOrAddr($dom, index, type) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let cbg = cg_sec.data.secsMsg[index].background_img
      let ahref = cg_sec.data.secsMsg[index].jump_url
      let innerHtml = ''
      if (type == '5') {
        innerHtml = `
      ${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
      <a
        target="_blank"
        href=${ahref}
      >
        <img class="cBg shadow" src=${cbg} alt="" />
      </a>
      `
      } else if (type == '12') {
        innerHtml = `
        ${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}
        <img class="cBg shadow" src=${cbg} alt="" />
        `
      }

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
      let scrollWrap = `<div class="nWrap mCustomScrollbar">${hLContent}</div>`
      innerHtml += scrollWrap
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
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let nItemWrap = ''
      let nWrap = ''
      for (let i = 0; i < resultArr.length; i++) {
        nItemWrap += `
        <a
          target="_blank"
          href=${resultArr[i].url}
        >
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
            </span>
          </a>`
      }
      nWrap = `<div class="nWrap mCustomScrollbar">${nItemWrap}</div>`
      innerHtml += nWrap
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)

    },
    createAgendaOrContactOrRegis: function ($dom, index, resultArr, type) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let aGroupWrap = ''
      let cGroupWrap = ''
      let cGroup = ''
      let scrollWrap
      if (type == '7' || type == '9') { // 大会议程、参会报名
        for (let i = 0; i < resultArr.length; i++) {  
          aGroupWrap += `
          <span class="aGroup">
            <a
              class="aItem shadow"
              target="_blank"
              href=${resultArr[i].url}
            >
              <img
                class="aPic"
                src=${resultArr[i].main_img}
                alt=""
            /></a>
          </span>
          `
        }
        if (type == '7') {
          scrollWrap = `<div class="nWrap mCustomScrollbar">${aGroupWrap}</div>`
        } else {
          scrollWrap = `<div class="nWrap">${aGroupWrap}</div>`
        }  
        innerHtml += scrollWrap

      } else if (type == '13') { // 联系我们
        for (let i = 0; i < resultArr.length; i++) {
          cGroup += `
          <img
            class="cItem cBg"
            src=${resultArr[i].main_img}
            alt=""
          />
          `
        }
        cGroupWrap = `<div class="cGroup">${cGroup}</div>`
        let scrollWrap = `<div class="nWrap">${cGroupWrap}</div>`

        innerHtml += scrollWrap
      }
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)

    },
    createScale: function ($dom, index, resultArr) {
      let title = cg_sec.data.secsMsg[index].title
      let titleImg = cg_sec.data.secsMsg[index].title_img || cg_sec.data.defaultImg
      let background_img = cg_sec.data.secsMsg[index].background_img
      let innerHtml = `${title ? `<div class='cTitle'>${title}</div>` : `<img src=${titleImg} alt='' class='cTitleBg' />`}` // 布置title
      let hLGroup = ''
      for (let i = 0; i < resultArr.length; i++) {
        let itenName = resultArr[i].name
        let itemBg = resultArr[i].background_img || cg_sec.data.defaultImg
        let itemPercent = resultArr[i].content
        cg_sec.data.scalePerNum.push(itemPercent)
        hLGroup += `
        <div class="hLGroup">
          <div class="inner">
            <span class="barWrap">
              <span class="percentBar" style="background: url(${itemBg}) no-repeat;background-size: cover;">
                <span class="desc">
                  ${itenName}
                </span>
              </span>
            </span>
            <span class="num">0%</span>
          </div>
        </div>`
      }
      let hLContent = `
      <div class="hLContent">
        ${hLGroup}
      </div>`
      let scrollWrap = `
      <div class="gContent">
        <img
          class="s_tImg"
          src=${background_img}
          alt=""
        />
        <div class="nWrap mCustomScrollbar">${hLContent}</div>
      </div>`
      innerHtml += scrollWrap
      $dom.find(cg_sec.data.absoluteClass).html(innerHtml)
    }
  }
  $(function () {

    cg_sec.init();


  })
})(jQuery, window, document)