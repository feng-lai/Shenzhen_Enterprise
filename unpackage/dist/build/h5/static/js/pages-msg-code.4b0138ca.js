(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-msg-code"],{1542:function(n,t,e){"use strict";var i=e("bc5e"),o=e.n(i);o.a},2690:function(n,t,e){var i=e("24fb");t=i(!1),t.push([n.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/* uni.scss */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.e-modal[data-v-1eb0c67e],\r\n.e-modal-mask[data-v-1eb0c67e]{position:fixed;top:0;bottom:0;left:0;right:0}.e-modal-action_animation[data-v-1eb0c67e]{transition:all .3s ease-in-out}.e-modal[data-v-1eb0c67e]{display:flex;justify-content:center;align-items:center;z-index:997}.e-modal_hidden[data-v-1eb0c67e]{visibility:hidden;-webkit-transform:scale(0);transform:scale(0)}.e-modal_show[data-v-1eb0c67e]{visibility:visible;-webkit-transform:scale(1);transform:scale(1)}.e-modal-container[data-v-1eb0c67e]{background-color:#fff;border-radius:6px}.e-modal-mask[data-v-1eb0c67e]{visibility:hidden;z-index:996}.e-modal-mask_show[data-v-1eb0c67e]{background:rgba(0,0,0,.6);visibility:visible}',""]),n.exports=t},"2ea2":function(n,t,e){"use strict";e.r(t);var i=e("f5dc"),o=e("c0ad");for(var a in o)"default"!==a&&function(n){e.d(t,n,(function(){return o[n]}))}(a);e("1542");var s,r=e("f0c5"),c=Object(r["a"])(o["default"],i["b"],i["c"],!1,null,"217565d2",null,!1,i["a"],s);t["default"]=c.exports},"3e8d":function(n,t,e){"use strict";e.r(t);var i=e("4e5b"),o=e("6422");for(var a in o)"default"!==a&&function(n){e.d(t,n,(function(){return o[n]}))}(a);e("ad5a");var s,r=e("f0c5"),c=Object(r["a"])(o["default"],i["b"],i["c"],!1,null,"1eb0c67e",null,!1,i["a"],s);t["default"]=c.exports},"4e5b":function(n,t,e){"use strict";var i;e.d(t,"b",(function(){return o})),e.d(t,"c",(function(){return a})),e.d(t,"a",(function(){return i}));var o=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{on:{touchmove:function(t){t.stopPropagation(),t.preventDefault(),arguments[0]=t=n.$handleEvent(t)}}},[e("v-uni-view",{staticClass:"e-modal",class:[n.visible?"e-modal_show":"e-modal_hidden",n.animation?"e-modal-action_animation":""],on:{click:function(t){if(t.target!==t.currentTarget)return null;t.stopPropagation(),arguments[0]=t=n.$handleEvent(t),n.cancel.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"e-modal-container",style:{width:n.width},on:{click:function(t){t.stopPropagation(),t.preventDefault(),arguments[0]=t=n.$handleEvent(t)}}},[n._t("default")],2)],1),e("v-uni-view",{class:["e-modal-mask",n.visible&&n.mask?"e-modal-mask_show":"",n.animation?"e-modal-action_animation":""]})],1)},a=[]},6422:function(n,t,e){"use strict";e.r(t);var i=e("c220"),o=e.n(i);for(var a in i)"default"!==a&&function(n){e.d(t,n,(function(){return i[n]}))}(a);t["default"]=o.a},"719e":function(n,t,e){"use strict";e("c975"),e("fb6a"),e("a434"),e("e25e"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i,o=getApp(),a={data:function(){return{scrollTop:"",info:"",id:"",content:"",name:"",phone:"",is:"",cum:{},visible:!1,c_phone:[],m_phone:[],input_phone:"",num:0,cost:"",all:0,order_id:"",customer:{},company:""}},methods:{send_cost:function(){i.num=parseInt(i.m_phone.length)+parseInt(i.c_phone.length),i.all=(i.num*i.cost).toFixed(2)},send_test:function(){return 1!=i.info.status?(uni.showToast({title:"请使用审核通过的短信模板发送信息",icon:"none"}),!1):i.phone?/^1[34578]\d{9}$/.test(i.phone)?void uni.request({url:o.globalData.url+"msg/send_test",data:{api_token:o.globalData.api_token,code:i.info.code,content:i.info.content,phone:i.phone},method:"post",success:function(n){uni.showToast({title:n.data.msg,icon:"none"})}}):(uni.showToast({title:"无效手机号",icon:"none"}),!1):(uni.showToast({title:"请输入手机号",icon:"none"}),!1)},match_phone:function(){uni.showLoading(),uni.request({url:o.globalData.url+"company/phone",data:{id:i.info.tid},success:function(n){1==n.data.result&&(i.m_phone=n.data.data,i.company=n.data.company,i.send_cost())},complete:function(){uni.hideLoading()}})},del:function(n){var t=[];for(var e in i.c_phone)parseInt(n)!=e&&t.push(i.c_phone[e]);i.c_phone=t,i.send_cost()},dels:function(n){var t=[];for(var e in i.m_phone)parseInt(n)!=e&&t.push(i.m_phone[e]);i.m_phone=t,i.send_cost()},dels_group:function(n){var t=i.company.slice(0,n);i.company.splice(0,n);var e=[];for(var o in i.m_phone)-1==t.indexOf(i.m_phone[o].name)&&e.push(i.m_phone[o]);i.m_phone=e,i.send_cost()},sub_phone:function(){if(!i.input_phone)return uni.showToast({title:"请输入手机号",icon:"none"}),!1;if(!/^1[34578]\d{9}$/.test(i.input_phone))return uni.showToast({title:"无效手机号",icon:"none"}),!1;if(i.c_phone.length>=20)uni.showToast({title:"最多添加20个自动定义号码",icon:"none"});else{for(var n in i.c_phone)if(i.c_phone[n]==i.input_phone)return void uni.showToast({title:"号码已存在",icon:"none"});i.c_phone.push(i.input_phone),i.send_cost(),i.visible=!1}},handleCancel:function(){i.visible=!1,i.input_phone=""},vis:function(){i.visible=!0},lower:function(){console.log(213)},ch_phone:function(n){i.phone=n.detail.value},add_phone:function(n){i.input_phone=n.detail.value},getInfo:function(){uni.request({url:o.globalData.url+"msg/code/detail",data:{id:i.id,api_token:o.globalData.api_token},success:function(n){1==n.data.result&&(i.info=n.data.data,i.cost=n.data.cost,i.customer=n.data.customer)}})},submit:function(){return 1!=i.info.status?(uni.showToast({title:"请使用审核通过的短信模板发送信息",icon:"none"}),!1):i.num?void uni.request({url:o.globalData.url+"msg/order",method:"post",data:{content:i.info.content,c_phone:i.c_phone,m_phone:i.m_phone,api_token:o.globalData.api_token,code:i.info.code},success:function(n){i.order_id=n.data.order_id,1==n.data.result&&uni.requestPayment({provider:"wxpay",timeStamp:n.data.payInfo.timeStamp,nonceStr:n.data.payInfo.nonceStr,package:n.data.payInfo.package,signType:n.data.payInfo.signType,paySign:n.data.payInfo.paySign,success:function(n){i.sendDetail()},fail:function(n){console.log("fail:"+JSON.stringify(n))}}),uni.showToast({title:n.data.msg,icon:"none"})}}):(uni.showToast({title:"发送短信数量不能为空",icon:"none"}),!1)},sendDetail:function(){uni.showLoading();var n=setInterval((function(){uni.request({url:o.globalData.url+"msg/detail",data:{api_token:o.globalData.api_token,order_id:i.order_id},success:function(t){-4!=t.data.result&&(clearInterval(n),uni.showToast({title:t.data.msg,icon:"none"}),setTimeout((function(){uni.redirectTo({url:"/pages/msg/msg"})}),1500))}})}),1500)}},onLoad:function(n){i=this,i.id=n.id},onShow:function(){var n=getCurrentPages(),t=n[n.length-1],e=this;uni.setStorage({key:"url",data:"/"+t.route+"?id="+e.id,success:function(){o.isLogin().then((function(){o.checkLogin(),e.getInfo()}))}})}};t.default=a},ad5a:function(n,t,e){"use strict";var i=e("fccf"),o=e.n(i);o.a},bc5e:function(n,t,e){var i=e("d4f6");"string"===typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);var o=e("4f06").default;o("01d118f3",i,!0,{sourceMap:!1,shadowMode:!1})},c0ad:function(n,t,e){"use strict";e.r(t);var i=e("719e"),o=e.n(i);for(var a in i)"default"!==a&&function(n){e.d(t,n,(function(){return i[n]}))}(a);t["default"]=o.a},c220:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i={props:{visible:{type:Boolean,default:!1},mask:{type:Boolean,default:!0},width:{type:String,default:"75%"},animation:{type:Boolean,default:!0}},methods:{cancel:function(){var n=this;this.$emit("update:visible",!1),this.$nextTick((function(){n.$emit("cancel")}))}}};t.default=i},d4f6:function(n,t,e){var i=e("24fb");t=i(!1),t.push([n.i,".row[data-v-217565d2]{line-height:%?50?%;padding:%?30?% %?20?%}uni-input[data-v-217565d2]{width:%?450?%;display:inline-block;vertical-align:middle;border:%?1?% solid #666;height:%?50?%;line-height:%?50?%;text-align:left;padding-left:%?10?%}.row uni-text[data-v-217565d2]{color:#999}.agree[data-v-217565d2]{text-align:center;line-height:%?50?%;padding:%?10?% %?20?%}.phone[data-v-217565d2]{max-height:%?550?%;overflow:scroll;border:%?1?% solid #ccc;border-radius:%?10?%;padding:%?10?%;margin-top:%?10?%;width:%?650?%}.phone uni-view[data-v-217565d2]{padding:%?10?% 0;border-bottom:%?1?% solid #f5f5f5}.phone .right[data-v-217565d2]{border:0;padding:0}",""]),n.exports=t},f5dc:function(n,t,e){"use strict";e.d(t,"b",(function(){return o})),e.d(t,"c",(function(){return a})),e.d(t,"a",(function(){return i}));var i={uniIcons:e("bb3f").default,eModal:e("3e8d").default},o=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",[e("v-uni-view",{staticClass:"row"},[n._v("当前状态："+n._s(n.info.text)),2==n.info.status?[n._v("(原因:"+n._s(n.info.reason)+")")]:n._e()],2),e("v-uni-view",{staticClass:"row"},[n._v("短信预览"),e("v-uni-view",{staticStyle:{border:"1rpx solid #333333",padding:"10rpx"}},[n._v(n._s(n.info.content))])],1),e("v-uni-view",{staticClass:"row"},[e("v-uni-view",[n._v("免费发送测试(30分钟内只能发送一次测试)：")]),e("v-uni-view",[e("v-uni-input",{attrs:{type:"text",maxlength:"24",value:n.phone,placeholder:"输入自己手机号测试"},on:{input:function(t){arguments[0]=t=n.$handleEvent(t),n.ch_phone.apply(void 0,arguments)}}}),e("v-uni-button",{staticStyle:{"vertical-align":"middle","margin-left":"10rpx"},attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.send_test()}}},[n._v("发送")])],1)],1),e("v-uni-view",{staticClass:"row"},[e("v-uni-view",[n._v("发送手机号：")]),e("v-uni-view",[e("v-uni-button",{staticStyle:{"vertical-align":"middle"},attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.match_phone()}}},[n._v("匹配号码一键导入")])],1),n.m_phone.length?e("v-uni-view",{staticStyle:{width:"670rpx"}},[n._v("共匹配"+n._s(n.company.length)+"家公司"+n._s(n.m_phone.length)+"个手机号码"),e("v-uni-view",{staticClass:"right"},[e("v-uni-text",{staticStyle:{border:"1rpx solid #000000",color:"#000000",padding:"0 10rpx",display:"inline-block","font-size":"22rpx",height:"40rpx","line-height":"40rpx","margin-right":"20rpx","border-radius":"10rpx"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.dels_group(5)}}},[n._v("删除5个")]),e("v-uni-text",{staticStyle:{border:"1rpx solid #000000",color:"#000000",padding:"0 10rpx",display:"inline-block","font-size":"22rpx",height:"40rpx","line-height":"40rpx","border-radius":"10rpx"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.dels_group(10)}}},[n._v("删除10个")])],1)],1):n._e(),n.m_phone.length?e("v-uni-scroll-view",{staticClass:"phone",attrs:{"scroll-y":"true"},on:{scrolltolower:function(t){arguments[0]=t=n.$handleEvent(t),n.lower.apply(void 0,arguments)}}},n._l(n.m_phone,(function(t,i){return e("v-uni-view",{staticStyle:{position:"relative"}},[e("v-uni-navigator",{staticStyle:{display:"block"},attrs:{"hover-class":"none",url:"/pages/company/company?id="+t.id}},[n._v(n._s(t.name))]),e("v-uni-navigator",{staticStyle:{display:"block"},attrs:{"hover-class":"none",url:"/pages/company/company?id="+t.id}},[n._v(n._s(t.phone))]),e("v-uni-view",{staticStyle:{position:"absolute",top:"20rpx",right:"20rpx"}},[e("uni-icons",{attrs:{type:"close"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.dels(i)}}})],1)],1)})),1):n._e()],1),e("v-uni-view",{staticClass:"row"},[e("v-uni-view",[n._v("自定义手机号(最多20个)"),e("v-uni-button",{staticStyle:{"vertical-align":"middle","margin-left":"10rpx"},attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.vis()}}},[n._v("添加")])],1),n.c_phone.length?e("v-uni-scroll-view",{staticClass:"phone",attrs:{"scroll-y":"true"}},n._l(n.c_phone,(function(t,i){return e("v-uni-view",[n._v(n._s(i+1+" : "+t)),e("v-uni-view",{staticClass:"right",staticStyle:{"padding-right":"30rpx"}},[e("uni-icons",{attrs:{type:"close"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.del(i)}}})],1)],1)})),1):n._e()],1),e("v-uni-view",{staticClass:"row"},[e("v-uni-view",[n._v("发送信息(每条"),e("v-uni-text",{staticStyle:{color:"red"}},[n._v("￥"+n._s(n.cost))]),n._v("元)：")],1),e("v-uni-view",[n._v("共发送"),e("v-uni-text",{staticStyle:{color:"red"}},[n._v(n._s(n.num))]),n._v("条信息，花费"),e("v-uni-text",{staticStyle:{color:"red"}},[n._v(n._s(n.all)+"元")])],1)],1),e("v-uni-view",{staticClass:"row"},[n._v("如有疑问请联系客服"),e("v-uni-view",[n._v("电话 : "+n._s(n.customer.wx)+"(微信同号)")]),e("v-uni-view",[n._v("QQ : "+n._s(n.customer.qq))])],1),e("v-uni-view",{staticClass:"agree"},[e("v-uni-button",{attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.submit()}}},[n._v("确认")])],1),e("e-modal",{attrs:{visible:n.visible},on:{"update:visible":function(t){arguments[0]=t=n.$handleEvent(t),n.visible=t}}},[e("v-uni-view",{staticClass:"model",staticStyle:{padding:"20rpx","text-align":"center","line-height":"80rpx"}},[e("v-uni-view",[e("v-uni-input",{attrs:{type:"text",placeholder:"输入手机号",value:n.input_phone},on:{input:function(t){arguments[0]=t=n.$handleEvent(t),n.add_phone.apply(void 0,arguments)}}})],1),e("v-uni-view",[e("v-uni-button",{staticStyle:{"margin-right":"20rpx"},attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.handleCancel()}}},[n._v("返回")]),e("v-uni-button",{attrs:{size:"mini"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.sub_phone()}}},[n._v("确定")])],1)],1)],1)],1)},a=[]},fccf:function(n,t,e){var i=e("2690");"string"===typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);var o=e("4f06").default;o("2c98217d",i,!0,{sourceMap:!1,shadowMode:!1})}}]);