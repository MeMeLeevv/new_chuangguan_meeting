
;(function (document, window, $) {
	var dc = {
		request: function (url, params, successCallback, async, errorCallback) {
			if (!url) return;
			var a = (async ===false ? false : true);
			var xhr;
			obj = {
				url: url,
				async: a,
				success: successCallback,
				error: function (xhr, status) {
					if (typeof errorCallback === "function") {
						errorCallback(xhr, status);
					}
				}
			}
			if (!params) {
				obj = $.extend(obj, {
					type: 'GET'
				});
			} else {
				obj = $.extend(obj, {
					type: 'POST',
					data: params
				});
			}
			xhr = $.ajax(obj);
			return xhr;
		},
		/* 
    判断是否是HTML元素节点
    @param { Node.ELEMENT_NOD } node 元素节点
    @return { Boolean } 
     */
    isHTMLElement: function(node) {
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
    createElement: function(ele, attrArr, datasetArr, text) {
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
	}
	window.cg = dc;
})(document, window, jQuery)