;
(function ($, win, doc) {
    // 全局共享数据
    win.p_id = 16 // 大会ID

    var cg_pro = {
        data: {
            logo_img: '', // 大会logo图
            logo_img_width: '',
            logo_img_height: '',
            background_url_img: '', //大会首页背景图
            background_url_img_width: '',
            background_url_img_height: '',
            small_picture_img: '', // 小图背景url
            small_picture_img_width: '',
            small_picture_img_height: '',
            name: '', // 大会名称
            p_id: p_id // 大会id
        },
        init: function (params) {
            cg_pro.getProjectMsg(cg_pro.data.p_id)
        },
        /* 
        获取大会基本信息
        @param p_id Number 大会id
        @return { Boolean } 
         */
        getProjectMsg: function (p_id) {
            cg.request('/front/project/getBaseProjectByPid', {
                p_id: p_id,
            }, function (data) {
                var result = data.data;
                if (data.code == 1) {
                    // 保存大会项目信息
                    // project.data = result
                    project_base_msg = result
                    // 加载完大会信息之后才开始加载header和fullpage配置
                    $('body').append('<script src="js/pcPage/header.js"><\/script>');
                    console.log(result, 'getproject')
                }
            });
        }
    }
    $(function () {
        cg_pro.init()
        // 将大会信息注册到全局上
    })
})(jQuery, window, document)