(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-df8022d6","chunk-45ece578","chunk-782794c5"],{"148d":function(t,e,n){},"188b":function(t,e,n){"use strict";n.r(e);n("57e7");var a=function(){var t=this,e=t._self._c;return e("div",{staticStyle:{"z-index":"9999"}},[e("el-dialog",{staticClass:"custom-dialog",attrs:{visible:t.isInviteMemberVisible},on:{"update:visible":function(e){t.isInviteMemberVisible=e}}},[e("div",{staticClass:"question p-1"},[e("div",{staticClass:"info"},[e("el-avatar",{attrs:{size:t.avatarSize,src:t.avatarUrl}}),e("div",{staticClass:"custom-flex"},[e("span",{staticClass:"author"},[t._v(t._s(t.user))]),e("span",{staticClass:"date"},[t._v(t._s(t.createdAt))])])],1),e("div",{staticClass:"title"},[t._v("\n        [Câu hỏi] "+t._s(t.title)+"\n      ")]),e("div",{staticClass:"content",domProps:{innerHTML:t._s(t.formattedContent)}}),e("div",{staticClass:"actions"},[e("div",{staticClass:"like-container"},[e("i",{staticClass:"fa fa-heart-o",attrs:{"aria-hidden":"true"}}),e("span",{staticClass:"likes"},[t._v(t._s(t.likes))])]),e("div",{staticClass:"comment-container"},[e("el-icon",{staticClass:"el-icon-chat-dot-square",staticStyle:{color:"rgb(24, 61, 228)"}}),e("span",{staticClass:"comments"},[t._v(t._s(t.answersCount))])],1)]),e("div",{staticClass:"reply-container"},[e("div",{staticClass:"avatar"},[e("el-avatar",{attrs:{size:t.avatarSize,src:this.$store.getters.currentUser.avatarUrl}})],1),e("div",{staticClass:"input-box",class:{disabled:t.isPostButtonDisabled}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.replyText,expression:"replyText"}],staticClass:"reply-input",attrs:{placeholder:"Nhập phản hồi của bạn..."},domProps:{value:t.replyText},on:{input:[function(e){e.target.composing||(t.replyText=e.target.value)},t.onReplyInputChange],keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.sendReply.apply(null,arguments)}}})]),e("div",{staticClass:"emoji-button",on:{click:t.showEmojiPicker}},[t._v("\n          😃\n        ")]),e("div",{staticClass:"send-button mr-3",on:{click:t.sendReply}},[e("i",{staticClass:"fa fa-paper-plane",staticStyle:{color:"rgb(12, 126, 233)"},attrs:{"aria-hidden":"true"}})])])]),t.isEmojiPickerVisible?e("emoji-picker",{on:{"emoji-selected":t.insertEmoji}}):t._e(),e("div",{staticClass:"answer-list mt-2",staticStyle:{"max-height":"200px","overflow-y":"auto"}},t._l(t.answers,(function(n){return e("answer",{key:n.id,attrs:{content:n.content,avatarUrl:n.user.avatarUrl,user:n.user.fullname,createdAt:t.formatDate(n.createdAt),likes:n.likes}})})),1)],1)],1)},i=[],r=(n("4f37"),n("96cf"),n("1da1")),s=(n("a481"),n("c5f6"),n("868a")),c=n("b775"),o="answer";function l(t){return Object(c["a"])({url:"/".concat(o,"/").concat(t),method:"get"})}function u(t){return Object(c["a"])({url:"/".concat(o),method:"post",data:t})}var d=n("2ac8"),f=n("b166"),v=n("425e"),h=(n("277f"),n("c24f")),m={props:{title:String,content:String,_id:String,id:String,user:String,createdAt:String,avatarUrl:String,likes:Number,comments:Number},computed:{avatarSize:function(){return"small"},formattedContent:function(){return this.content.replace(/\n/g,"<br>")},formattedDate:function(){return this.createdAt?this.createdAt>0?this.formatDate(this.createdAt):"Ngày tạo không hợp lệ":"Ngày tạo không xác định"},answersCount:function(){return this.answers.length},isPostButtonDisabled:function(){}},created:function(){},data:function(){return{replyText:"",answers:[],isInviteMemberVisible:!1,isEmojiPickerVisible:!1}},components:{Answer:s["default"],EmojiPicker:v["default"]},methods:{formatDate:function(t){return String(Object(f["a"])(new Date(t),"dd/MM/yyyy HH:mm"))},showEmojiPicker:function(){this.isEmojiPickerVisible=!0},insertEmoji:function(t){this.replyText+=t,this.isEmojiPickerVisible=!1},saveAnswerCount:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(d["d"])(this.id,this.answers.length);case 3:t.next=8;break;case 5:t.prev=5,t.t0=t["catch"](0),console.error("Lỗi khi cập nhật lượt thích: ",t.t0);case 8:case"end":return t.stop()}}),t,this,[[0,5]])})));function e(){return t.apply(this,arguments)}return e}(),loadAnswers:function(){var t=this;l(this.id).then((function(e){e&&e.data&&e.data.success?t.answers=e.data.answers:console.error("Không thành công: ",e.data)})).catch((function(t){console.error("Lỗi khi tải câu trả lời: ",t)}))},childFunction:function(){this.isInviteMemberVisible=!0,this.loadAnswers()},showInviteDialog:function(){this.isInviteMemberVisible=!0},onReplyInputChange:function(){},sendReply:function(t){var e=this;if(""!==this.replyText.trim()){var n={content:this.replyText,question:this.id,user:this.$store.getters.user._id};u(n).then((function(t){if(t&&200===t.status){var a=t.data;a&&a.success?(e.loadAnswers(),e.replyText="",Object(d["g"])(e.id),Object(h["a"])(e._id,{user:{_id:e.$store.getters.currentUser._id,fullname:e.$store.getters.currentUser.fullname,avatarUrl:e.$store.getters.currentUser.avatarUrl},content:" đã trả lời câu hỏi của bạn: "+n.content})):console.error("Lỗi khi lưu phản hồi: ",a)}else console.error("Lỗi khi gửi phản hồi, phản hồi không hợp lệ: ",t)})).catch((function(t){console.error("Lỗi khi gửi phản hồi: ",t)}))}},validatePhotoURL:function(t){return"string"===typeof t?t:""},toggleInviteMemberDialog:function(){this.internalIsInviteMemberVisible=!this.internalIsInviteMemberVisible}}},p=m,b=(n("a064"),n("0c7c")),g=Object(b["a"])(p,a,i,!1,null,null,null);e["default"]=g.exports},"19b3":function(t,e,n){"use strict";n("148d")},"2ac8":function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return s})),n.d(e,"b",(function(){return c})),n.d(e,"e",(function(){return o})),n.d(e,"g",(function(){return l})),n.d(e,"d",(function(){return u})),n.d(e,"f",(function(){return d}));var a=n("b775"),i="question";function r(){return Object(a["a"])({url:"/".concat(i),method:"get"})}function s(t){return Object(a["a"])({url:"/".concat(i),method:"post",data:t})}function c(t){return Object(a["a"])({url:"/".concat(i,"/").concat(t),method:"delete"})}function o(t){return Object(a["a"])({url:"/".concat(i,"/").concat(t),method:"post"})}function l(t){return Object(a["a"])({url:"/".concat(i,"/status/").concat(t),method:"post"})}function u(t,e){return Object(a["a"])({url:"/".concat(i,"/").concat(t,"/count"),method:"post",data:{answersCount:e}})}function d(t,e){return Object(a["a"])({url:"/".concat(i,"/updateQuestion/").concat(t),method:"post",data:{newQuestion:e}})}},"425e":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"emoji-picker"},t._l(t.emojis,(function(n,a){return e("div",{key:a,staticClass:"emoji",on:{click:function(e){return t.insertEmoji(n)}}},[t._v("\n    "+t._s(n)+"\n  ")])})),0)},i=[],r={data:function(){return{emojis:["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","😍","😘","🥰","😎","🤩","😏","😌","😑","😒","😓","😔","😕","😖","😗","😙","😚","🙂","🤗","🤔","🤨","😐","😶","😏","😟","😠","😡","🥺","😢","😣","😤","😥","😦","😧","😨","😩","🤯","😬","😰","😱","😳","🤪","😵","😶‍🌫️","😷","🤒","🤕","🤢","🤮","🥴","🤧","😇","🤠","🥳","🥺","🥱","🤤","🤥","🤫","🤭","🧐","🤓","😈","👿","👹","👺","💀","👻","👽","🛸","🚀","🛰️","💥","💫","💦","💨","🌪️","🌩️","🌧️","🌨️","🌦️","🌤️","☀️","🌤️","⛅","🌥️","☁️","🌦️","🌧️","🌨️","🌩️","🌪️","💧","💦","🌊","🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🌽","🥕","🥔","🍠","🥐","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🍱","🍲","🥣","🥗","🍿","🧂","🥫","🍯","🍮","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍦","🍨","🍧","🎂","🍰","🧁","🥧","🍽️","🍴","🥄","🏺","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🧊","🥢","🍽️","🥄","🏺","🥂","🍾","🍷","🍸","🍹","🍺","🍻","🥃","🥤","🧊","🥢"]}},methods:{insertEmoji:function(t){this.$emit("emoji-selected",t)}}},s=r,c=(n("4638"),n("0c7c")),o=Object(c["a"])(s,a,i,!1,null,"ca281478",null);e["default"]=o.exports},4638:function(t,e,n){"use strict";n("a772")},"4f37":function(t,e,n){"use strict";n("aa77")("trim",(function(t){return function(){return t(this,3)}}))},"868a":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"answer"},[e("div",{staticClass:"info"},[e("el-avatar",{attrs:{size:t.avatarSize,src:t.avatarUrl}}),e("div",[e("div",{staticClass:"custom-flex"},[e("span",{staticClass:"author"},[t._v(t._s(t.user))]),e("span",{staticClass:"date"},[t._v(t._s(t.createdAt))])])]),e("div",{staticClass:"actions ml-4"},[e("div",{staticClass:"like-container"},[e("i",{staticClass:"fa fa-heart-o",attrs:{"aria-hidden":"true"}}),e("span",{staticClass:"likes"},[t._v(t._s(t.likes))])])])],1),e("div",{staticClass:"content"},[t._v(t._s(t.content))])])},i=[],r=(n("c5f6"),n("beaf")),s=n("2420"),c=n("fd3a"),o=n("8c86");function l(t){Object(o["a"])(1,arguments);var e=Object(c["a"])(t);return e.setHours(0,0,0,0),e}var u=864e5;function d(t,e){Object(o["a"])(2,arguments);var n=l(t),a=l(e),i=n.getTime()-Object(s["a"])(n),r=a.getTime()-Object(s["a"])(a);return Math.round((i-r)/u)}var f=n("b166"),v=n("e3c5"),h=n("83d2"),m=n("fe1f");function p(t,e,n){var a,i,l,u,p,b,g,k,j,w;Object(o["a"])(2,arguments);var C=Object(c["a"])(t),y=Object(c["a"])(e),O=Object(r["a"])(),_=null!==(a=null!==(i=null===n||void 0===n?void 0:n.locale)&&void 0!==i?i:O.locale)&&void 0!==a?a:v["a"],S=Object(m["a"])(null!==(l=null!==(u=null!==(p=null!==(b=null===n||void 0===n?void 0:n.weekStartsOn)&&void 0!==b?b:null===n||void 0===n||null===(g=n.locale)||void 0===g||null===(k=g.options)||void 0===k?void 0:k.weekStartsOn)&&void 0!==p?p:O.weekStartsOn)&&void 0!==u?u:null===(j=O.locale)||void 0===j||null===(w=j.options)||void 0===w?void 0:w.weekStartsOn)&&void 0!==l?l:0);if(!_.localize)throw new RangeError("locale must contain localize property");if(!_.formatLong)throw new RangeError("locale must contain formatLong property");if(!_.formatRelative)throw new RangeError("locale must contain formatRelative property");var x,A=d(C,y);if(isNaN(A))throw new RangeError("Invalid time value");x=A<-6?"other":A<-1?"lastWeek":A<0?"yesterday":A<1?"today":A<2?"tomorrow":A<7?"nextWeek":"other";var E=Object(h["a"])(C,Object(s["a"])(C)),R=Object(h["a"])(y,Object(s["a"])(y)),U=_.formatRelative(x,E,R,{locale:_,weekStartsOn:S});return Object(f["a"])(C,U,{locale:_,weekStartsOn:S})}var b={props:{content:String,user:String,createdAt:String,avatarUrl:String,likes:Number},computed:{avatarSize:function(){return"small"},formattedDate:function(){return this.createdAt?this.formatDate(this.createdAt):""}},created:function(){},methods:{formatDate:function(t){var e="";return t&&(e=p(new Date(1e3*t),new Date),e=e.charAt(0).toUpperCase()+e.slice(1)),e}}},g=b,k=(n("19b3"),n("0c7c")),j=Object(k["a"])(g,a,i,!1,null,"61f1bfe9",null);e["default"]=j.exports},a064:function(t,e,n){"use strict";n("f0f5")},a772:function(t,e,n){},f0f5:function(t,e,n){}}]);