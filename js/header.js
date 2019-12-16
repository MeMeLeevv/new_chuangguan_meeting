;(function ($, win, doc) {
  var navbar = {
    data: {
      logoUrl: 'http://img.iimedia.cn/0000117b83e66a86ad4b1d2c9d2984319f463b5f5d2e28075324f8aba0388fc65c95f', // 大会logo地址
      RegistrationBtnUrl: 'http://img.iimedia.cn/00001228e00fdffb513251e96027c50ff3fd18040576eed1660299eeb278938ef42d8',//报名按钮背景地址

      indexUrl: '/',
      guestUrl:'',
      meetingUrl: '',
      awardUrl: '',
      sponsor_joinUrl: '',
      reviewUrl: '',
      consultUrl: '',

      activeClass: 'activeNavbar',
      navbarItemClass: '#header .navbarwrap .navbar li a'

    },
    init: function (params) {
      navbar.activeNav()
    },
    /* 高亮当前链接下的导航栏li */
    activeNav: function () {
      var data = navbar.data
      var activePath = navbar.getPositionUrl() // href获取到的路径是"http://localhost:3000/"这种绝对路径，所以这里采用获取网页地址的绝对路径
      $(data.navbarItemClass).each(function (index,item) {
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
    navbar.init();
  })
})(jQuery, window, document)