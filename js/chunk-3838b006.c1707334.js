(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3838b006"],{"8f49":function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));n("159b"),n("b64b"),n("a9e3"),n("a15b"),n("d81d");var a=n("9ab4"),o=n("7a23"),r=n("f3e7");function c(e){var t=this,n=e.conditions,c=e.dataLoader,i=e.dataAPI,l=e.deleteAPI,u={searchCondition:{pageNo:1,pageSize:20},total:0,loading:!1,selectedRow:[],list:[]};n&&Object.keys(n).forEach((function(e){u.searchCondition[e]=n[e].default}));var d=Object(o["reactive"])(u),s=function(e){return Object(a["b"])(t,void 0,void 0,(function(){var t;return Object(a["c"])(this,(function(n){switch(n.label){case 0:return i?(e.loading=!0,[4,i(e.searchCondition)]):[2];case 1:return t=n.sent(),0===t.code&&(e.list=t.data.records,e.total=Number(t.data.total)),e.loading=!1,[2]}}))}))};c||(c=s);var f=function(){return Object(a["b"])(t,void 0,void 0,(function(){return Object(a["c"])(this,(function(e){switch(e.label){case 0:return[4,s(d)];case 1:return e.sent(),[2]}}))}))},p=function(e){d.searchCondition.pageSize=e,d.searchCondition.pageNo=1,c&&c(d)},b=function(e){d.searchCondition.pageNo=e,c&&c(d)},m=function(e){d.searchCondition.pageNo=1,d.searchCondition.pageSize=20,Object.keys(e).forEach((function(t){d.searchCondition[t]=e[t]})),c&&c(d)},O=function(){n&&Object.keys(n).forEach((function(e){d.searchCondition[e]=n[e].reset})),c&&c(d)},j=function(){d.searchCondition.pageNo=1,c&&c(d)},v=function(e){d.selectedRow=e};Object(o["onMounted"])((function(){c&&c(d)}));var g=function(e,t){return void 0===e&&(e="id"),void 0===t&&(t=","),d.selectedRow.map((function(t){return t[e]})).join(t)},h=Object(r["a"])(),w=function(e){h.$confirm("即将删除该条数据, 是否确认?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){l&&l(e.id).then((function(e){0===e.code?(d.searchCondition.pageNo=1,c&&c(d),h.$notify({type:"success",title:"提示",message:"删除成功！"})):h.$notify({type:"error",title:"提示",message:e.msg})}))})).catch((function(){}))},V=function(){h.$confirm("即将删除这"+d.selectedRow.length+"条数据, 是否确认?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){l&&l(g()).then((function(e){0===e.code?(d.searchCondition.pageNo=1,c&&c(d),h.$notify({type:"success",title:"提示",message:"删除成功！"})):h.$notify({type:"error",title:"提示",message:e.msg})}))})).catch((function(){}))};return{pageData:d,pageNoChange:b,pageSizeChange:p,defaultDataLoader:f,pageReset:m,rowSelected:v,pageConditionSearch:j,getSelectIds:g,defaultPageReset:O,defaultDeleteHandle:w,defaultMultiDeleteHandle:V}}},c25e:function(e,t,n){"use strict";n.r(t);var a=n("7a23"),o=Object(a["withScopeId"])("data-v-0463ec1f");Object(a["pushScopeId"])("data-v-0463ec1f");var r={style:{width:"700px"}},c=Object(a["createTextVNode"])("主账号"),i=Object(a["createTextVNode"])("子账号"),l={style:{float:"left"}},u={style:{float:"right",color:"#8492a6","font-size":"13px"}},d=Object(a["createTextVNode"])("关联"),s=Object(a["createTextVNode"])("解绑"),f=Object(a["createTextVNode"])(" 确认 "),p={style:{width:"700px"}},b=Object(a["createTextVNode"])(" 确认 "),m={style:{width:"100%"}},O={style:{"text-align":"center","padding-bottom":"20px"}};Object(a["popScopeId"])();var j=o((function(e,t,n,j,v,g){var h=Object(a["resolveComponent"])("el-input"),w=Object(a["resolveComponent"])("el-form-item"),V=Object(a["resolveComponent"])("el-radio"),N=Object(a["resolveComponent"])("el-option"),y=Object(a["resolveComponent"])("el-select"),C=Object(a["resolveComponent"])("el-button"),k=Object(a["resolveComponent"])("el-table-column"),_=Object(a["resolveComponent"])("el-table"),S=Object(a["resolveComponent"])("hb-avatar-uploader"),T=Object(a["resolveComponent"])("el-form"),F=Object(a["resolveComponent"])("el-tab-pane"),I=Object(a["resolveComponent"])("el-tooltip"),P=Object(a["resolveComponent"])("el-pagination"),U=Object(a["resolveComponent"])("el-tabs"),D=Object(a["resolveComponent"])("hb-page-layout-full"),$=Object(a["resolveDirective"])("loading");return Object(a["openBlock"])(),Object(a["createBlock"])(D,null,{default:o((function(){return[Object(a["createVNode"])(U,{modelValue:j.activeTab,"onUpdate:modelValue":t[10]||(t[10]=function(e){return j.activeTab=e})},{default:o((function(){return[Object(a["createVNode"])(F,{label:"个人信息",name:"userInfo"},{default:o((function(){return[Object(a["createVNode"])("div",r,[Object(a["createVNode"])(T,{ref:"userInfoForm",model:j.infoForm,rules:j.infoRules,"label-width":"80px",style:{padding:"20px"}},{default:o((function(){return[Object(a["createVNode"])(w,{label:"账号"},{default:o((function(){return[Object(a["createVNode"])(h,{modelValue:j.infoForm.username,"onUpdate:modelValue":t[1]||(t[1]=function(e){return j.infoForm.username=e}),disabled:!0},null,8,["modelValue"])]})),_:1}),Object(a["createVNode"])(w,{label:"姓名",prop:"nickname"},{default:o((function(){return[Object(a["createVNode"])(h,{modelValue:j.infoForm.nickname,"onUpdate:modelValue":t[2]||(t[2]=function(e){return j.infoForm.nickname=e})},null,8,["modelValue"])]})),_:1}),Object(a["createVNode"])(w,{label:"账号类型"},{default:o((function(){return[Object(a["createVNode"])(V,{modelValue:j.infoForm.userType,"onUpdate:modelValue":t[3]||(t[3]=function(e){return j.infoForm.userType=e}),label:"0",border:"",disabled:!0},{default:o((function(){return[c]})),_:1},8,["modelValue"]),Object(a["createVNode"])(V,{modelValue:j.infoForm.userType,"onUpdate:modelValue":t[4]||(t[4]=function(e){return j.infoForm.userType=e}),label:"1",border:"",disabled:!0},{default:o((function(){return[i]})),_:1},8,["modelValue"])]})),_:1}),Object(a["withDirectives"])(Object(a["createVNode"])(w,{label:"关联账号"},{default:o((function(){return[Object(a["createVNode"])(y,{modelValue:j.linkUser,"onUpdate:modelValue":t[5]||(t[5]=function(e){return j.linkUser=e}),filterable:"",remote:"","reserve-keyword":"",placeholder:"请输入账号","remote-method":j.remoteMethod,loading:j.selectLoading,clearable:""},{default:o((function(){return[(Object(a["openBlock"])(!0),Object(a["createBlock"])(a["Fragment"],null,Object(a["renderList"])(j.linkOptions,(function(e){return Object(a["openBlock"])(),Object(a["createBlock"])(N,{key:e.value,label:e.nickname,value:e.id},{default:o((function(){return[Object(a["createVNode"])("span",l,Object(a["toDisplayString"])(e.nickname),1),Object(a["createVNode"])("span",u,Object(a["toDisplayString"])(e.username),1)]})),_:2},1032,["label","value"])})),128))]})),_:1},8,["modelValue","remote-method","loading"]),Object(a["createVNode"])(C,{style:{"margin-left":"15px"},type:"primary",onClick:j.handleLink},{default:o((function(){return[d]})),_:1},8,["onClick"])]})),_:1},512),[[a["vShow"],"1"===j.infoForm.userType&&0===j.userLinkData.length]]),Object(a["createVNode"])(w,{label:"1"===j.infoForm.userType?"主账号":"子账号"},{default:o((function(){return[Object(a["createVNode"])(_,{data:j.infoForm.userlist,size:"mini",border:"",style:{width:"100%"}},{default:o((function(){return[Object(a["createVNode"])(k,{prop:"username",align:"center",label:"账号",width:"150"}),Object(a["createVNode"])(k,{prop:"nickname",align:"center",label:"姓名"}),Object(a["createVNode"])(k,{fixed:"right",align:"center",label:"操作"},{default:o((function(e){return[Object(a["createVNode"])(C,{onClick:function(t){return j.handleUnLink(e.row)},type:"danger",size:"small"},{default:o((function(){return[s]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data"])]})),_:1},8,["label"]),Object(a["createVNode"])(w,{label:"头像"},{default:o((function(){return[Object(a["createVNode"])(S,{src:j.imgId2Url(j.infoForm.headPic),onCropped:j.onCropped},null,8,["src","onCropped"])]})),_:1}),Object(a["createVNode"])(w,null,{default:o((function(){return[Object(a["createVNode"])(C,{type:"primary",onClick:t[6]||(t[6]=function(e){return j.handleInfoSubmit("userInfoForm")})},{default:o((function(){return[f]})),_:1})]})),_:1})]})),_:1},8,["model","rules"])])]})),_:1}),Object(a["createVNode"])(F,{label:"修改密码",name:"editPassword"},{default:o((function(){return[Object(a["createVNode"])("div",p,[Object(a["createVNode"])(T,{ref:"userPasswordForm",model:j.passwordForm,rules:j.passwordRules,"label-width":"80px",style:{padding:"20px"}},{default:o((function(){return[Object(a["createVNode"])(w,{label:"密码",prop:"password"},{default:o((function(){return[Object(a["createVNode"])(h,{type:"password",modelValue:j.passwordForm.password,"onUpdate:modelValue":t[7]||(t[7]=function(e){return j.passwordForm.password=e})},null,8,["modelValue"])]})),_:1}),Object(a["createVNode"])(w,{label:"确认密码",prop:"passwordConfirm"},{default:o((function(){return[Object(a["createVNode"])(h,{type:"password",modelValue:j.passwordForm.passwordConfirm,"onUpdate:modelValue":t[8]||(t[8]=function(e){return j.passwordForm.passwordConfirm=e})},null,8,["modelValue"])]})),_:1}),Object(a["createVNode"])(w,null,{default:o((function(){return[Object(a["createVNode"])(C,{type:"primary",onClick:t[9]||(t[9]=function(e){return j.handlePasswordSubmit("userPasswordForm")})},{default:o((function(){return[b]})),_:1})]})),_:1})]})),_:1},8,["model","rules"])])]})),_:1}),Object(a["createVNode"])(F,{label:"安全日志",name:"securityLog"},{default:o((function(){return[Object(a["createVNode"])("div",m,[Object(a["withDirectives"])(Object(a["createVNode"])(_,{size:"mini",data:j.tableData.list,border:"",style:{width:"100%"}},{default:o((function(){return[Object(a["createVNode"])(k,{prop:"operationTime",align:"center",label:"操作时间",width:"200"}),Object(a["createVNode"])(k,{prop:"operationType",align:"center",label:"操作类型",width:"180"},{default:o((function(e){var t;return[Object(a["createVNode"])("span",null,Object(a["toDisplayString"])(null===(t=j.dataDict.SECURITY_OPERATION)||void 0===t?void 0:t.mappings[e.row.operationType]),1)]})),_:1}),Object(a["createVNode"])(k,{prop:"clientId",align:"center",label:"客户端id",width:"300"}),Object(a["createVNode"])(k,{prop:"operationPlatform",align:"center",label:"操作平台",width:"110"},{default:o((function(e){var t;return[Object(a["createVNode"])("span",null,Object(a["toDisplayString"])(null===(t=j.dataDict.APP_PLATFORM)||void 0===t?void 0:t.mappings[e.row.operationPlatform]),1)]})),_:1}),Object(a["createVNode"])(k,{prop:"ipAddress",align:"center",label:"ip位置",width:"230"}),Object(a["createVNode"])(k,{prop:"ip",align:"center",label:"操作ip",width:"200"}),Object(a["createVNode"])(k,{prop:"ua",align:"center",label:"UA信息","min-width":"300"},{default:o((function(e){return[Object(a["createVNode"])(I,{content:e.row.ua,placement:"top"},{default:o((function(){return[Object(a["createVNode"])("span",null,Object(a["toDisplayString"])(j.parseUA(e.row.ua)),1)]})),_:2},1032,["content"])]})),_:1})]})),_:1},8,["data"]),[[$,j.tableData.loading]]),Object(a["createVNode"])("div",O,[Object(a["createVNode"])(P,{background:"","page-sizes":[20,50,100],"page-size":j.tableData.searchCondition.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:j.tableData.total,style:{margin:"15px 0"},onSizeChange:j.pageSizeChange,onCurrentChange:j.pageNoChange},null,8,["page-size","total","onSizeChange","onCurrentChange"])])])]})),_:1})]})),_:1},8,["modelValue"])]})),_:1})})),v=(n("b0c0"),n("d3b7"),n("d81d"),n("a434"),n("9ab4")),g=n("0fdc"),h=n("f3e7"),w=n("8f49"),V=n("2b80"),N=n.n(V),y=n("1223"),C={name:"index",components:{HbAvatarUploader:g["a"]},setup:function(){var e=this,t=Object(h["a"])(),n=Object(a["computed"])((function(){return t.$security.getUser().value.data})),o=Object(a["computed"])((function(){return t.$store.getters["userCenterActiveName"]})),r=Object(y["a"])(["SECURITY_OPERATION","APP_PLATFORM"]).dataDict,c=Object(w["a"])({conditions:{userId:{default:n.value.id,reset:n.value.id}},dataAPI:t.$api.querySecurityLog}),i=c.pageData,l=c.defaultDataLoader,u=c.pageNoChange,d=c.pageSizeChange,s=c.pageConditionSearch,f=c.defaultPageReset,p=function(e,t,n){""===t?n(new Error("请再次输入密码")):t!==j.value.password?n(new Error("两次输入密码不一致!")):n()},b=Object(a["ref"])(""),m=Object(a["ref"])({id:0,nickname:"",status:1,headPic:""}),O={nickname:[{required:!0,message:"请输入昵称",trigger:"change"}]},j=Object(a["ref"])({id:"",password:"",passwordConfirm:""}),g={password:[{required:!0,message:"请输入密码",trigger:"change"}],passwordConfirm:[{required:!0,validator:p,trigger:"blur"}]},V=Object(a["ref"])(!1),C=Object(a["ref"])(""),k=Object(a["ref"])([]),_=Object(a["ref"])([]),S=function(e){return t.$api.$imgId2Url(e)};Object(a["watch"])(b,(function(){"userInfo"===b.value&&P()})),Object(a["watch"])(o,(function(){b.value=o.value}));var T=function(e){var t=new N.a;t.setUA(e);var n=t.getResult(),a=n.os.name?n.os.name:"-",o=n.browser.name?n.browser.name:"-";return"操作系统："+a+" | 浏览器名称："+o},F=function(){return Object(v["b"])(e,void 0,void 0,(function(){var e,a;return Object(v["c"])(this,(function(o){switch(o.label){case 0:return[4,t.$api.userGet(n.value.id)];case 1:return e=o.sent(),0===e.code&&(a=t.$security.getUser(),a.value.data=e.data),[2]}}))}))},I=function(n){return Object(v["b"])(e,void 0,void 0,(function(){var e,a,o;return Object(v["c"])(this,(function(r){switch(r.label){case 0:return[4,new Promise((function(e){t.$refs[n].validate((function(t){e(t)}))}))];case 1:return e=r.sent(),e?(a=[],_.value.map((function(e){a.push(e.id)})),m.value.userIdList=a,[4,t.$api.userEdit(m.value)]):[2];case 2:return o=r.sent(),0!==o.code?[3,4]:(t.$notify({type:"success",title:"提示",message:"操作成功！"}),[4,F()]);case 3:return r.sent(),[3,5];case 4:t.$notify({type:"error",title:"提示",message:o.msg}),r.label=5;case 5:return[2]}}))}))},P=function(){return Object(v["b"])(e,void 0,void 0,(function(){var e;return Object(v["c"])(this,(function(a){switch(a.label){case 0:return[4,t.$api.userGet(n.value.id)];case 1:return e=a.sent(),0===e.code?(m.value=e.data,_.value=e.data.userlist):(C.value="",k.value=[],_.value=[]),[2]}}))}))},U=function(n){return Object(v["b"])(e,void 0,void 0,(function(){var e;return Object(v["c"])(this,(function(a){switch(a.label){case 0:return""===n?[3,2]:(V.value=!0,[4,t.$api.queryMainAccountList(n)]);case 1:return e=a.sent(),0===e.code&&(k.value=e.data),V.value=!1,[3,3];case 2:k.value=[],a.label=3;case 3:return[2]}}))}))},D=function(){k.value.map((function(e){e.id===C.value&&_.value.push({id:e.id,username:e.username,nickname:e.nickname})}))},$=function(e){for(var t=0,n=0;n<_.value.length;n++)e.id===_.value[n].id&&(t=n);_.value.splice(t,1)},x=function(n){return Object(v["b"])(e,void 0,void 0,(function(){var e,a;return Object(v["c"])(this,(function(o){switch(o.label){case 0:return[4,new Promise((function(e){n.toBlob((function(t){e(t)}))}))];case 1:return e=o.sent(),[4,t.$api.uploadImage(e)];case 2:return a=o.sent(),0===a.code?m.value.headPic=a.data:t.$notify({type:"error",title:"提示",message:a.msg}),[2]}}))}))},R=function(a){return Object(v["b"])(e,void 0,void 0,(function(){var e,o;return Object(v["c"])(this,(function(r){switch(r.label){case 0:return[4,new Promise((function(e){t.$refs[a].validate((function(t){e(t)}))}))];case 1:return e=r.sent(),e?(j.value.id=n.value.id,[4,t.$api.userPwd(j.value)]):[2];case 2:return o=r.sent(),0===o.code?(t.$notify({type:"success",title:"提示",message:"操作成功！"}),j.value.password="",j.value.passwordConfirm=""):t.$notify({type:"error",title:"提示",message:o.msg}),[2]}}))}))};return Object(a["onMounted"])((function(){b.value=o.value})),{imgId2Url:S,updateUserInfo:F,handleInfoSubmit:I,open:P,handleLink:D,remoteMethod:U,handleUnLink:$,onCropped:x,handlePasswordSubmit:R,parseUA:T,dataDict:r,activeTab:b,infoForm:m,infoRules:O,passwordForm:j,passwordRules:g,selectLoading:V,linkUser:C,linkOptions:k,userLinkData:_,userInfo:n,activeName:o,tableData:i,handleSearch:l,pageNoChange:u,pageSizeChange:d,pageConditionSearch:s,handleReset:f}}};C.render=j,C.__scopeId="data-v-0463ec1f";t["default"]=C}}]);