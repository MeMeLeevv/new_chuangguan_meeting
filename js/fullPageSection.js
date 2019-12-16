;(function ($, win, doc) {
  var section = {
    data: {
      headerHeight: '76px',
      id:'',// 栏目id
      type: '',//栏目类型
      bgUrl: '',// ,每屏背景，默认是全局背景
      
    },
    init: function (params) {
    },
  } 
  $(function(){
    // section.init();
    $('#fullpage').fullpage({
      //options here
      scrollingSpeed: 700, //滚动速度，单位为毫秒
      autoScrolling:true,//是否使用插件的滚动方式，如果选择 false，则会出现浏览器自带的滚动条
      scrollHorizontally: true,
      navigation: true,//显示一个由小圆圈组成的导航栏
      navigationPosition: 'left', // 定义导航栏显示的位置
      navigationTooltips: ['firstSlide', 'secondSlide'], //（默认为[]）定义要使用导航圈的工具提示。 如果您愿意，也可以在每个部分中使用属性data-tooltip来定义它们
      paddingTop: section.data.headerHeight,//与顶部的距离
    });
  })
})(jQuery, window, document)