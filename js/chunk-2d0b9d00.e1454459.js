(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b9d00"],{3519:function(e,t,n){"use strict";n.r(t);var o=n("7a23"),r=Object(o["withScopeId"])("data-v-0e551dd2");Object(o["pushScopeId"])("data-v-0e551dd2");var a=Object(o["createTextVNode"])("下线");Object(o["popScopeId"])();var c=r((function(e,t,n,c,i,l){var d=Object(o["resolveComponent"])("el-table-column"),u=Object(o["resolveComponent"])("el-tooltip"),p=Object(o["resolveComponent"])("el-button"),b=Object(o["resolveComponent"])("el-table"),s=Object(o["resolveComponent"])("hb-drawer-layout");return Object(o["openBlock"])(),Object(o["createBlock"])(s,{modelValue:e.isShow,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.isShow=t}),title:e.loginOperateDrawerDeploy.title,size:"800px"},{default:r((function(){return[Object(o["createVNode"])(b,{size:"mini",data:e.tableList,border:"",style:{width:"100%"}},{default:r((function(){return[Object(o["createVNode"])(d,{prop:"operationTime",align:"center",label:"登录时间",width:"210"}),Object(o["createVNode"])(d,{prop:"clientId",align:"center",label:"客户端id",width:"300"}),Object(o["createVNode"])(d,{prop:"operationPlatform",align:"center",label:"登录平台",width:"80"},{default:r((function(t){var n;return[Object(o["createVNode"])("span",null,Object(o["toDisplayString"])(null===(n=e.dataDict.APP_PLATFORM)||void 0===n?void 0:n.mappings[t.row.operationPlatform]),1)]})),_:1}),Object(o["createVNode"])(d,{prop:"ipAddress",align:"center",label:"地区",width:"230"}),Object(o["createVNode"])(d,{prop:"ip",align:"center",label:"登录ip",width:"200"}),Object(o["createVNode"])(d,{prop:"ua",align:"center",label:"UA信息","min-width":"300"},{default:r((function(t){return[Object(o["createVNode"])(u,{content:t.row.ua,placement:"top"},{default:r((function(){return[Object(o["createVNode"])("span",null,Object(o["toDisplayString"])(e.parseUA(t.row.ua)),1)]})),_:2},1032,["content"])]})),_:1}),Object(o["createVNode"])(d,{fixed:"right",align:"center",label:"操作",width:"80"},{default:r((function(t){return[Object(o["createVNode"])(p,{onClick:function(n){return e.handleOffline(t.row)},type:"text",style:{color:"red"}},{default:r((function(){return[a]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data"])]})),_:1},8,["modelValue","title"])})),i=(n("b0c0"),n("9ab4")),l=n("2b80"),d=n.n(l),u=n("f3e7"),p=n("1223"),b=Object(o["defineComponent"])({name:"LoginOperateDrawer",setup:function(){var e=this,t=Object(u["a"])(),n=Object(p["a"])(["APP_PLATFORM"]).dataDict,r=Object(o["ref"])([]),a=Object(o["ref"])(""),c=Object(o["ref"])(!1),l={title:"登录管理"},b=function(e){a.value=e,c.value=!0,s()},s=function(){return Object(i["b"])(e,void 0,void 0,(function(){var e;return Object(i["c"])(this,(function(n){switch(n.label){case 0:return[4,t.$api.queryOnlineList(a.value)];case 1:return e=n.sent(),0===e.code&&(r.value=e.data),[2]}}))}))},f=function(e){var t=new d.a;t.setUA(e);var n=t.getResult(),o=n.os.name?n.os.name:"-",r=n.browser.name?n.browser.name:"-";return"操作系统："+o+" | 浏览器名称："+r},O=function(n){return Object(i["b"])(e,void 0,void 0,(function(){return Object(i["c"])(this,(function(e){return t.$confirm("即将下线该用户, 是否确认?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$api.userOffline(n.token).then((function(e){0===e.code?(t.$notify({type:"success",title:"提示",message:"操作成功！"}),s()):t.$notify({type:"error",title:"提示",message:e.msg})}))})),[2]}))}))};return{isShow:c,loginOperateDrawerDeploy:l,tableList:r,dataDict:n,handleSearch:s,handleOffline:O,open:b,parseUA:f}}});b.render=c,b.__scopeId="data-v-0e551dd2";t["default"]=b}}]);