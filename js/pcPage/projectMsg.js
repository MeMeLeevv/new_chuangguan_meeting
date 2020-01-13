;(function ($, win, doc) {
  // 全局共享数据
  var project = {
    data: {
      logo_img: '', // 大会logo图
      logo_img_width: '',
      logo_img_height: '',
      background_url_img: '', //大会首页背景图
      background_url_img_width: '',
      background_url_img_height: '',
      small_picture_img: '',// 小图背景url
      small_picture_img_width: '',
      small_picture_img_height: '',
      name: '', // 大会名称
      p_id: 16 // 大会id

    },
    init: function (params) {
      project.getProjectMsg(project.data.p_id)
    },
    /* 
    获取大会基本信息
    @param p_id Number 大会id
    @return { Boolean } 
     */
    getProjectMsg: function(p_id) {
      $.ajax({
          url: '/front/project/getBaseProjectByPid',
          type: 'POST',
          dataType: 'json',
          data: {
              p_id: p_id
          },
          success: function (data) {
              var result = data.data;
  
              if (data.code == 1) {
                // 保存大会项目信息
                // project.data = result
                win.project_base_msg = result
                // 加载完大会信息之后才开始加载header和fullpage配置
                $(document.body).append('<script src="js/pcPage/header.js"><\/script>');
                $(document.body).append('<script src="js/pcPage/fullpageSection.js"><\/script>');
                console.log(result, 'getproject');

                 /*  $('#' + sectionId).html('');
                  var insert_info = '';
  
                  //往届嘉宾
                  if (sectionId == 'vip-swiper-wrapper') {
                      var perPage = 10;
                      var pageNum = result.data.length % perPage == 0 ? (result.data.length / perPage) : (parseInt(result.data.length / perPage) + 1);
                      //					console.log('pageNum:'+pageNum);
                      var maxNum = perPage;
  
                      for (var i = 0; i < pageNum; i++) {
  
                          if (i == pageNum - 1) {
                              if (result.data.length % perPage != 0) {
                                  maxNum = (perPage > result.data.length % perPage) ? (result.data.length % perPage) : perPage;
                              }
                              // console.log('maxNum：'+maxNum);
                          }
  
                          insert_info += '<div class="swiper-slide"><ul class="co-list">';
                          for (var j = perPage * i; j < perPage * i + maxNum; j++) {
                              var companyPosition = result.data[j].companyPosition;
                              companyPosition = companyPosition.replace(/\n/g, '<br>');
                              insert_info += '<li><div class="vip-profile co-img"><img src="' + result.data[j].imgurl + '?p=0"/></div><div class="vip-cover"><p class="vip-name">' + result.data[j].vipName + '</p><p class="vip-job">' + companyPosition + '</p></div></li>';
                          }
                          insert_info += '</ul></div>';
                      }
  
                      $('#' + sectionId).html(insert_info);
  
                      //数量过多时，进行轮播
                      if (pageNum > 1) {
                          if (sectionId == 'vip-swiper-wrapper') {
                              var dhjbSwiper = new Swiper('#vip-swiper-container', {
                                  loop: true,
                                  autoplay: 5000,
                                  prevButton: '#vip-button-prev',
                                  nextButton: '#vip-button-next'
                              });
                          }
                      }
                  } */
              }
          },
          error: function (textStatus) {
              alert('咦，获取出错了,请重试！');
          }
      });
  }
  } 
  $(function(){
    project.init()
    // 将大会信息注册到全局上
  })
})(jQuery, window, document)