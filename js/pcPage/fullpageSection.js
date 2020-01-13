;
(function ($, win, doc) {
  // 主视觉逻辑如下： 当用户轮动到相应的页面的时候，先监听当前栏目的信息（id、名称——可以在滚动小圆点hover的时候给提示、type）主要是根据type来加载样式
  // 也可以一开始就拉取navbar列表的数据，然后根据type以及id全部拉取数据
  var section = {
    data: {
      headerHeight: '76px',
      id: '', // 栏目id
      type: '', //栏目类型
      bgUrl: '', // ,每屏背景，默认是全局背景
      secWrapSelector: '#fullpage',
      secClass: 'section',

      secsMsg: [], // 每个栏目信息
      navigationTooltips: [], // fullpage小圆点hover的时候可以给提示
      typeMap: {
        // 根据type来布置每个栏目的id选择器
        // 栏目类型
        1: 'headImage',
        2: 'background',
        3: 'highlight',
        4: 'scale',
        5: 'excellenceAwardOrAddress',
        6: 'guests',
        7: 'agendaOrContactOrRegis',
        8: 'news',
        9: 'agendaOrContactOrRegis',
        10: 'parnerOrMedia',
        11: 'parnerOrMedia',
        12: 'excellenceAwardOrAddress',
        13: 'agendaOrContactOrRegis'
      },
    },
    init: function (params) {
      // section.createHeadImage()
      // section.createBackground()
      // section.createScale()
      
      section.getColumnList()
    },
    /* 
    获取栏目列表，初始化屏数,将type和c_id来获取每个栏目的内容
    @param { Node.ELEMENT_NOD } node 元素节点
    @return { Boolean } 
     */
    getColumnList () {
      $.ajax({
        url: '/front/column/getColumnList',
        type: 'POST',
        dataType: 'json',
        data: {
            p_id: win.project_base_msg.p_id,
        },
        success: function (data) {
            var result = data.data;

            if (data.code == 1) {
              // 保存大会项目信息
              // section.data = result
              console.log(result, 'section');
              // 根据列表个数创建pullPage页数以及每页的框架
              for (let i = 0; i < result.length; i++) {
              section.data.secsMsg.push(result[i]) // 保存数据
              let data = result[i]
              var parentEle = $(section.data.secWrapSelector)
              let posDiv = section.createElement('div', [
                ['className', 'section centerRelative'],
              ])
              let posWrap = section.createElement('div', [
                ['className', 'centerAbsolute'],
                ['id', section.data.typeMap[data.type]]
              ], [
                ["c_id", data.c_id],
                ['type', data.type],
                ['tooltip', data.name]
              ])
              posWrap.appendChild(posDiv)
              parentEle.insertBefore(posWrap, parentEle.firstChild)
              }
            }
        },
        error: function (textStatus) {
            alert('咦，获取出错了,请重试！');
        }
    });
    },
    /* 
    判断是否是HTML元素节点
    @param { Node.ELEMENT_NOD } node 元素节点
    @return { Boolean } 
     */
    isHTMLElement(node) {
      if (window.HTMLElement) { // IE6/7/8不支持
        return node instanceof window.HTMLElement
      } else {
        var d = document.createElement("div");
        try {
          d.appendChild(obj.cloneNode(true));
          return obj.nodeType === 1 ? true : false;
        } catch (e) {
          return false;
        }
      }
    },
    /* 
    创建元素节点
    @param {string} ele 子元素的节点类型
    @param { Array } attrArr 普通属性二维字符串数组 [[name,value]]
    @param { Array } datasetArr 自定义属性二维字符串数组 [[name,value]]
    @return { Node.ELEMENT_NODE } 返回新增的元素节点
     */
    createElement(ele, attrArr, datasetArr, text) {
      ele = document.createElement(ele)
      //判断属性参数是否是一个有内容的数组
      if (attrArr && attrArr instanceof Array && attrArr.length !== 0) {
        for (let i = 0; i < attrArr.length; i++) {
          ele[attrArr[i][0]] = attrArr[i][1]
        }
      }
      //判断自定义属性参数是否是一个有内容的数组
      if (datasetArr && datasetArr instanceof Array && datasetArr.length !== 0) {
        for (let i = 0; i < datasetArr.length; i++) {
          ele.dataset[datasetArr[i][0]] = datasetArr[i][1]
        }
      }
      // 如果存在文本则插入
      text && (ele.innerHTML = text)
      return ele
    },

    /* 
    创建大会头图 
    @return null
    */
    createHeadImage() {
      let data = {
        name: '主视觉',
        cid: '123',
        type: '0',
        imgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f'
      }
      var parentEle = document.querySelector(section.data.secWrapSelector);
      //创建头图图片
      let img = section.createElement('img', [
        ['className', 'cBg centerAbsolute'],
        ['src', 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f']
      ], [
        ["alt", '主视觉视图']
      ])
      //创建大会头图框架
      let headImage = section.createElement('div', [
        ['className', 'section centerRelative'],
        ['id', 'headImage']
      ], [
        ["cid", '123'],
        ['type', '1']
      ])
      headImage.appendChild(img)
      parentEle.insertBefore(headImage, parentEle.firstChild)
    },
    /* 
    创建大会背景 
    @return null
    */
    createBackground() {
      let data = {
        name: '大会背景',
        cid: '123',
        type: '1',
        title: false,
        imgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
        desc: `<div class="cDesc">2019年，是中国新时代的科技元年，中国科技创新成为推动经济社会高质量高效益发展的精神富矿。5G是推
        动全球数字经济发展的重要引擎，中国5G通信将迎来开局之年，关键核心技术创新能力迈入世界前列。5G时代将
        开启新科技时代，赋能经济新动能，赋予垂直行业深度融合，支撑置换社会创新发展，为行业升级注入强劲动力。
        同时粤港澳大湾区在科技与金融合作领域始终具有引领世界的潜力，以科技推动金融进步，以金融助力科技发展。
        科技孕育无限生机，激发未来无限可能，是创新发展的先导力量，将重塑全球经济结构，加速新旧动能转换，催生
        新消费、新业态、新模式。</div><br /><div class="cDesc">由广东省互联网协会、广东省科技金融促进会、艾媒咨询举办的2019全球未来科技大会(广
        州站)，将于2019年10月31日-11月1日在中国广州举办，涵盖5G商业应用，粤港澳大湾区科技与金融融合、未来新经济、新
        领域、新消费、数字文娱、智慧网联等科技领域核心内容，面向全球科技产业及上下游企业，旨在精准把握行业风
        云激荡的发展方向与未来趋势。</div>`
      }
      var parentEle = document.querySelector(section.data.secWrapSelector);
      var fragment = document.createDocumentFragment()
      //创建大会背景title
      let title
      if (data.title) { // 先判断title是图片还是文字
        title = section.createElement('div', [
          ['className', 'cTitle']
        ], null, data.name)
      } else {
        title = section.createElement('img', [
          ['src', data.imgSrc],
          ['alt', '大会背景图片'],
          ['className', 'cTitleBg']
        ])
      }
      fragment.appendChild(title)
      //创建大会背景栏目desc
      let cDesc = section.createElement('div', [
        ['className', 'cDesc']
      ], null, data.desc)
      fragment.appendChild(cDesc)
      //创建承载大会背景content的主体
      let content = section.createElement('div', [
        ['className', 'centerAbsolute']
      ])
      content.appendChild(fragment)
      let background = section.createElement('div', [
        ['className', 'section centerRelative'],
        ['id', 'background']
      ], [
        ["cid", '123'],
        ['type', '1']
      ])
      background.appendChild(content)
      parentEle.insertBefore(background, parentEle.firstChild)
    },
    createScale() {
      let data = {
        name: '大会规模',
        cid: '123',
        type: '4',
        title: true,
        imgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f'
      }
      var parentEle = document.querySelector(section.data.secWrapSelector)
      var fragment = document.createDocumentFragment()
      //创建大会规模title
      let title
      if (data.title) { // 先判断title是图片还是文字
        title = section.createElement('div', [
          ['className', 'cTitle']
        ], null, data.name)
      } else {
        title = section.createElement('img', [
          ['src', data.imgSrc],
          ['alt', '大会规模图片'],
          ['className', 'cTitleBg']
        ])
      }
      fragment.appendChild(title)
      //创建大会规模内容图
      let contentImg = section.createElement('img', [
        ['className', 'cBg shadow'],
        ['src',data.imgSrc]
      ])
      fragment.appendChild(contentImg)
      //创建承载大会规模content的主体
      let content = section.createElement('div', [
        ['className', 'centerAbsolute']
      ])
      content.appendChild(fragment)
      //创建大会头图框架
      let scale = section.createElement('div', [
        ['className', 'section centerRelative'],
        ['id', 'scale'],
        ['title', '大会规模 —— title文字/titleBg、栏目背景图']
      ], [
        ["cid", '123'],
        ['type', '4']
      ])
      scale.appendChild(content)
      parentEle.insertBefore(scale, parentEle.firstChild)
    },
    /* 创建大会亮点 */
    createHighlight() {
      let data = {
        name: '大会亮点',
        cid: '123',
        type: '3',
        title: true,
        groupContent: [
          {
            title: '5G引爆科技前沿',
            desc: '未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。',
            gBgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
            gTitleSrc: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8'
          },
          {
            title: '5G引爆科技前沿',
            desc: '未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。',
            gBgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
            gTitleSrc: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8'
          },
          {
            title: '5G引爆科技前沿',
            desc: '未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。',
            gBgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
            gTitleSrc: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8'
          },
          {
            title: '5G引爆科技前沿',
            desc: '未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。',
            gBgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
            gTitleSrc: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8'
          },
          {
            title: '5G引爆科技前沿',
            desc: '未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。未来G时代引领科技前沿，激发新时代。',
            gBgSrc: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f',
            gTitleSrc: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8'
          }
        ]
      }
      var parentEle = document.querySelector(section.data.secWrapSelector)
      var fragmentBig = document.createDocumentFragment()
      //创建大会规模title
      let title
      if (data.title) { // 先判断title是图片还是文字
        title = section.createElement('div', [
          ['className', 'cTitle']
        ], null, data.name)
      } else {
        title = section.createElement('img', [
          ['src', data.imgSrc],
          ['alt', '大会亮点图片'],
          ['className', 'cTitleBg']
        ])
      }
      fragmentBig.appendChild(title)
      let fragmentMid = document.createDocumentFragment()
      //创建大会规模group内容
      for(let i = 0; i < data.groupContent.length; i++) {
        //创建分组内容
        let fragment = document.createDocumentFragment()
        let gTitle = section.createElement('div', [['className','gTitle']], null, data.groupContent[i].title)
        let gDesc = section.createElement('div', [['className','desc']], null, data.groupContent[i].desc)
        fragment.append(gTitle, gDesc)
        let wrap = section.createElement('div',[['className','wrap']])
        wrap.append(fragment)
        let hLGroup = section.createElement('div',[['className','hLGroup']])
        hLGroup.appendChild(wrap)
        fragmentMid.appendChild(hLGroup)
      }
      //创建承载组内容的载体
      let hLContent = section.createElement('div',[['className','hLContent']])
      hLContent.appendChild(fragmentMid)
      fragmentBig.appendChild(fragmentMid)
      //创建承载大会规模content的主体
      let content = section.createElement('div', [
        ['className', 'centerAbsolute']
      ])
      content.appendChild(fragmentBig)
      //创建大会头图框架
      let highlight = section.createElement('div', [
        ['className', 'section centerRelative'],
        ['id', 'highlight'],
        ['title', '大会亮点 —— title文字/titleBg、栏目背景图']
      ], [
        ["cid", '123'],
        ['type', '3']
      ])
      highlight.appendChild(content)
      parentEle.insertBefore(highlight, parentEle.firstChild)
    },
  }
  $(function () {
    section.init();
    $('#fullpage').fullpage({
      //options here
      scrollingSpeed: 700, //滚动速度，单位为毫秒
      autoScrolling: true, //是否使用插件的滚动方式，如果选择 false，则会出现浏览器自带的滚动条
      scrollHorizontally: true,
      navigation: true, //显示一个由小圆圈组成的导航栏
      navigationPosition: 'left', // 定义导航栏显示的位置
      navigationTooltips: section.data.navigationTooltips, //（默认为[]）定义要使用导航圈的工具提示。 如果您愿意，也可以在每个部分中使用属性data-tooltip来定义它们
      paddingTop: section.data.headerHeight, //与顶部的距离
      onLeave: function(origin, destination, direction){ // 一旦用户离开 section ，过渡到新 section ，就会触发此回调。 返回 “false” 将在移动发生之前取消移动。
        var leavingSection = this;
    
        //离开第二个section后
        if(origin.index == 1 && direction =='down'){
          alert("前往第3个section！");
        }
    
        else if(origin.index == 1 && direction == 'up'){
          alert("前往第1个section！");
        }
      }
    });
    console.log(fullpage_api.getActiveSection(), 'activeSection')

  })
})(jQuery, window, document)