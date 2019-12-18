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
      secParSelector: '#fullPage',
      secClass: 'section'

    },
    init: function (params) {},
    /* 
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
    @param {Node.ELEMENT_NODE} parantEle 父元素节点
    @param {string} sonEle 子元素的节点类型
    @param { Array } attrArr 普通属性二维字符串数组 [[name,value]]
    @param { Array } datasetArr 自定义属性二维字符串数组 [[name,value]]
    @return { null }
     */
    createElement(parentEle, sonEle, attrArr,datasetArr, text) {
      if (!section.isHTMLElement(parentEle)) throw new Error('you need to previde a ElementNode!')
      sonEle = document.createElement(sonEle)
      if(attrArr && attrArr instanceof Array && attrArr.length !== 0) {
        for (let i = 0; i < attrArr.length; i++) {
          sonEle[attrArr[i][0]] = attrArr[i][1]
        }
      }
      if(datasetArr && datasetArr instanceof Array && datasetArr.length !== 0) {
        for (let i = 0; i < datasetArr.length; i++) {
          sonEle.dataset[datasetArr[i][0]] = datasetArr[i][1]
        }
      }
      text && (sonEle.innerHTML = text) // 如果存在文本则插入
      parentEle.appendChild(sonEle)
    },
    createHeadImage() {
      var parentEle = document.querySelector(section.data.secParSelector);
      //建议创建的元素按照从里到外的顺序创建，然后逐层传递给createElement的innerHTML
      section.createElement(parentEle, 'div', [['className','section centerRelative'],['id','headImage']], [["cid",'123'],['type','1']])
    }
  }
  $(function () {
    // section.init();
    let ele = document.createElement('div')
    console.log(typeof ele, 'ele')
    $('#fullpage').fullpage({
      //options here
      scrollingSpeed: 700, //滚动速度，单位为毫秒
      autoScrolling: true, //是否使用插件的滚动方式，如果选择 false，则会出现浏览器自带的滚动条
      scrollHorizontally: true,
      navigation: true, //显示一个由小圆圈组成的导航栏
      navigationPosition: 'left', // 定义导航栏显示的位置
      navigationTooltips: ['firstSlide', 'secondSlide'], //（默认为[]）定义要使用导航圈的工具提示。 如果您愿意，也可以在每个部分中使用属性data-tooltip来定义它们
      paddingTop: section.data.headerHeight, //与顶部的距离
    });
  })
})(jQuery, window, document)