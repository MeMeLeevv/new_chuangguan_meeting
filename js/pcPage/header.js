;(function ($, win, doc) {
  var navbar = {
    data: {
      // 导航栏的每栏url，用于监测当前的网页地址是属于哪一栏
      indexUrl: '/new_chuangguan_meeting/index.html',
      guestUrl:'',
      meetingUrl: '',
      awardUrl: '',
      sponsor_joinUrl: '',
      reviewUrl: '',
      consultUrl: '',

      logoClass: '#header .logo',
      regisBtnClass: '#header .navbarwrap .RegistrationBtn',
      activeNavClass: 'activeNavbar',
      navbarItemClass: '#header .navbarwrap .navbar li a'

    },
    /* 
    首页导航栏初始化：获取logo图和小图并相应修改页面css
    */
    init: function (params) {
      navbar.activeNav()
      console.log(win.project_base_msg, 'win.project_base_msg.logo_img')

      if (project_base_msg.logo_img) {
        $(navbar.data.logoClass).css('background-image', `url(${project_base_msg.logo_img})`)
        $(navbar.data.regisBtnClass).css('background-image', `url(${project_base_msg.small_picture_img})`)
      }

    },
    /* 
    高亮当前链接下的导航栏li
    */
    activeNav: function () {
      var data = navbar.data
      var activePath = navbar.getPositionUrl() // href获取到的路径是"http://localhost:3000/"这种绝对路径，所以这里采用获取网页地址的绝对路径
      // console.log(activePath, 'path')
      $(data.navbarItemClass).each(function (index,item) {
        // console.log(item.href, 'innerHref')
        item.href === activePath ? $(this).addClass(data.activeNavClass) : $(this).removeClass(data.activeNavClass)
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