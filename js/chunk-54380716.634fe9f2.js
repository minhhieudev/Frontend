(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-54380716"],{"756c":function(t,a,e){"use strict";e("878d")},"878d":function(t,a,e){},f966:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t._self._c;return a("div",{staticStyle:{"overflow-x":"hidden"}},[a("div",{staticClass:"main-content"},[a("el-row",{attrs:{gutter:10}},t._l(t.dataList,(function(e,n){return a("el-col",{key:n,attrs:{span:12}},[a("el-card",{staticClass:"card-item",attrs:{shadow:"always"}},[a("div",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between"},attrs:{slot:"header"},slot:"header"},[a("p",{staticClass:"card-title"},[t._v(t._s(e.kyandnam))]),a("el-button",{attrs:{type:"success",round:""}},[a("a",{attrs:{href:"http://dangkymonhoc.pyu.edu.vn/Default.aspx?page=xemdiemthi&id=211ctt009"}},[t._v("Chi tiết")])])],1),t._l(e.data,(function(e,n){return a("el-row",{key:n},[a("el-col",{attrs:{span:12}},[a("p",[t._v(t._s(e.label))])]),a("el-col",{staticStyle:{"text-align":"center",color:"rgb(12, 128, 236)"},attrs:{span:12}},[a("p",[t._v(t._s(e.score))])])],1)}))],2)],1)})),1)],1)])},c=[],s=e("b775"),r="search";function i(t){return Object(s["a"])({url:"/".concat(r,"/resultLearning/").concat(t),method:"get"})}var o={data:function(){return{dataList:[]}},created:function(){this.fetchDataFromApi()},mounted:function(){},methods:{fetchDataFromApi:function(){var t=this;console.log("Gọi api");var a="20574802010015";""!=a&&i(a).then((function(a){t.dataList=a.data})).catch((function(t){console.error("Error fetching data:",t)}))}}},l=o,u=(e("756c"),e("0c7c")),d=Object(u["a"])(l,n,c,!1,null,null,null);a["default"]=d.exports}}]);