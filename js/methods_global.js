;(function ($, win, doc) {
  // 全局共享数据
  var methods = {
    data: {
      indexUrl: '/',
      guestUrl:'',
      meetingUrl: '',
      awardUrl: '',
      sponsor_joinUrl: '',
      reviewUrl: '',
      consultUrl: '',

      activeClass: 'activemethods',
      methodsItemClass: '#header .methodswrap .methods li a'

    },
    init: function (params) {
      methods.activeNav()
    },
    /* 高亮当前链接下的导航栏li */
    activeNav: function () {
      var data = methods.data
      var activePath = methods.getPositionUrl() // href获取到的路径是"http://localhost:3000/"这种绝对路径，所以这里采用获取网页地址的绝对路径
      $(data.methodsItemClass).each(function (index,item) {
        // console.log(item.href)
        item.href === activePath ? $(this).addClass(data.activeClass) : $(this).removeClass(data.activeClass)
      })
    },
    /* 获取当前网页的相对路径 */
    getUrlRelativePath: function() {
      var href = win.location.href.split('//')[1] //获取域名+相对路径 不要用document.location.href
      var index = href.indexOf('/')
      var relativePath = href.slice(index)
      if(href.indexOf('?') !== -1) { // 如果有参数
        relativePath = relativePath.split('?')[0]
      }
      return relativePath
    },
    /* 获取网页的绝对路径，不包含参数 */
    getPositionUrl:function () {
      var positionPath = win.location.href
      if(positionPath.indexOf('?') !== -1) { // 如果有参数
        positionPath = positionPath.split('?')[0]
      }
      return positionPath
    }
  } 
  $(function(){
    // methods.init();
    $('#fullpage').fullpage({
      //options here
      autoScrolling:true,
      scrollHorizontally: true,
      navigation: true,
      navigationPosition: 'left',
      navigationTooltips: ['firstSlide', 'secondSlide'],
    });
  })
})(jQuery, window, document)