"use strict";(self.webpackChunkdex=self.webpackChunkdex||[]).push([[290],{52337:function(e,t,n){n.d(t,{t0:function(){return k},zv:function(){return w},uA:function(){return C},uc:function(){return X},jb:function(){return $},zb:function(){return W},AV:function(){return y},Ic:function(){return ie},Vs:function(){return ce}});var r=n(93433),o=n(37762),a=n(74165),i=n(15861),s=n(29439),c=n(1413),u=n(70501),l=function(e){return"object"===typeof e&&null!==e},f=new WeakMap,d=new WeakSet,p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Object.is,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return new Proxy(e,t)},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(e){return l(e)&&!d.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(e){return e.configurable&&e.enumerable&&e.writable},a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}},i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:new WeakMap,p=arguments.length>6&&void 0!==arguments[6]?arguments[6]:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:a,r=i.get(e);if((null==r?void 0:r[0])===t)return r[1];var o=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return(0,u.jc)(o,!0),i.set(e,[t,o]),Reflect.ownKeys(e).forEach((function(t){if(!Object.getOwnPropertyDescriptor(o,t)){var r=Reflect.get(e,t),a={value:r,enumerable:!0,configurable:!0};if(d.has(r))(0,u.jc)(r,!1);else if(r instanceof Promise)delete a.value,a.get=function(){return n(r)};else if(f.has(r)){var i=f.get(r),c=(0,s.Z)(i,2),l=c[0],v=c[1];a.value=p(l,v(),n)}Object.defineProperty(o,t,a)}})),Object.preventExtensions(o)},v=arguments.length>7&&void 0!==arguments[7]?arguments[7]:new WeakMap,h=arguments.length>8&&void 0!==arguments[8]?arguments[8]:[1,1],b=arguments.length>9&&void 0!==arguments[9]?arguments[9]:function(a){if(!l(a))throw new Error("object required");var i=v.get(a);if(i)return i;var m=h[0],g=new Set,y=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:++h[0];m!==t&&(m=t,g.forEach((function(n){return n(e,t)})))},w=h[1],I=function(e){return function(t,n){var o=(0,r.Z)(t);o[1]=[e].concat((0,r.Z)(o[1])),y(o,n)}},C=new Map,O=function(e){var t,n=C.get(e);n&&(C.delete(e),null==(t=n[1])||t.call(n))},W=Array.isArray(a)?[]:Object.create(Object.getPrototypeOf(a)),E=function(t,r,o,a,i){if(!t||!(e(r,a)||v.has(a)&&e(r,v.get(a)))){O(o),l(a)&&(a=(0,u.o5)(a)||a);var s=a;if(a instanceof Promise)a.then((function(e){a.status="fulfilled",a.value=e,y(["resolve",[o],e])})).catch((function(e){a.status="rejected",a.reason=e,y(["reject",[o],e])}));else{!f.has(a)&&n(a)&&(s=b(a));var c=!d.has(s)&&f.get(s);c&&function(e,t){if(C.has(e))throw new Error("prop listener already exists");if(g.size){var n=t[3](I(e));C.set(e,[t,n])}else C.set(e,[t])}(o,c)}i(s),y(["set",[o],a,r])}},k=t(W,{deleteProperty:function(e,t){var n=Reflect.get(e,t);O(t);var r=Reflect.deleteProperty(e,t);return r&&y(["delete",[t],n]),r},set:function(e,t,n,r){var o=Reflect.has(e,t),a=Reflect.get(e,t,r);return E(o,a,t,n,(function(n){Reflect.set(e,t,n,r)})),!0},defineProperty:function(e,t,n){if(o(n)){var r=Reflect.getOwnPropertyDescriptor(e,t);if(!r||o(r))return E(!!r&&"value"in r,null==r?void 0:r.value,t,n.value,(function(r){Reflect.defineProperty(e,t,(0,c.Z)((0,c.Z)({},n),{},{value:r}))})),!0}return Reflect.defineProperty(e,t,n)}});v.set(a,k);var j=[W,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:++h[1];return w===e||g.size||(w=e,C.forEach((function(t){var n=(0,s.Z)(t,1)[0][1](e);n>m&&(m=n)}))),m},p,function(e){g.add(e),1===g.size&&C.forEach((function(e,t){var n=(0,s.Z)(e,2),r=n[0];if(n[1])throw new Error("remove already exists");var o=r[3](I(t));C.set(t,[r,o])}));return function(){g.delete(e),0===g.size&&C.forEach((function(e,t){var n=(0,s.Z)(e,2),r=n[0],o=n[1];o&&(o(),C.set(t,[r]))}))}}];return f.set(k,j),Reflect.ownKeys(a).forEach((function(e){var t=Object.getOwnPropertyDescriptor(a,e);"value"in t&&(k[e]=a[e],delete t.value,delete t.writable),Object.defineProperty(W,e,t)})),k};return[b,f,d,e,t,n,o,a,i,p,v,h]},v=p(),h=(0,s.Z)(v,1)[0];function b(){return h(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{})}function m(e,t,n){var r,o=f.get(e);o||console.warn("Please use proxy object");var a=[],i=o[3],s=!1,c=i((function(e){a.push(e),n?t(a.splice(0)):r||(r=Promise.resolve().then((function(){r=void 0,s&&t(a.splice(0))})))}));return s=!0,function(){s=!1,c()}}var g=b({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),y={state:g,subscribe:function(e){return m(g,(function(){return e(g)}))},push:function(e,t){e!==g.view&&(g.view=e,t&&(g.data=t),g.history.push(e))},reset:function(e){g.view=e,g.history=[e]},replace:function(e){g.history.length>1&&(g.history[g.history.length-1]=e,g.view=e)},goBack:function(){if(g.history.length>1){g.history.pop();var e=g.history.slice(-1),t=(0,s.Z)(e,1)[0];g.view=t}},setData:function(e){g.data=e}},w={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",WCM_VERSION:"WCM_VERSION",RECOMMENDED_WALLET_AMOUNT:9,isMobile:function(){return typeof window<"u"&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/.test(navigator.userAgent))},isAndroid:function(){return w.isMobile()&&navigator.userAgent.toLowerCase().includes("android")},isIos:function(){var e=navigator.userAgent.toLowerCase();return w.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl:function(e){return e.startsWith("http://")||e.startsWith("https://")},isArray:function(e){return Array.isArray(e)&&e.length>0},formatNativeUrl:function(e,t,n){if(w.isHttpUrl(e))return this.formatUniversalUrl(e,t,n);var r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r="".concat(r,"://")),r.endsWith("/")||(r="".concat(r,"/")),this.setWalletConnectDeepLink(r,n);var o=encodeURIComponent(t);return"".concat(r,"wc?uri=").concat(o)},formatUniversalUrl:function(e,t,n){if(!w.isHttpUrl(e))return this.formatNativeUrl(e,t,n);var r=e;r.endsWith("/")||(r="".concat(r,"/")),this.setWalletConnectDeepLink(r,n);var o=encodeURIComponent(t);return"".concat(r,"wc?uri=").concat(o)},wait:function(e){return(0,i.Z)((0,a.Z)().mark((function t(){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t){setTimeout(t,e)})));case 1:case"end":return t.stop()}}),t)})))()},openHref:function(e,t){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink:function(e,t){try{localStorage.setItem(w.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))}catch(n){console.info("Unable to set WalletConnect deep link")}},setWalletConnectAndroidDeepLink:function(e){try{var t=e.split("?"),n=(0,s.Z)(t,1)[0];localStorage.setItem(w.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:n,name:"Android"}))}catch(r){console.info("Unable to set WalletConnect android deep link")}},removeWalletConnectDeepLink:function(){try{localStorage.removeItem(w.WALLETCONNECT_DEEPLINK_CHOICE)}catch(e){console.info("Unable to remove WalletConnect deep link")}},setModalVersionInStorage:function(){try{typeof localStorage<"u"&&localStorage.setItem(w.WCM_VERSION,"2.6.1")}catch(e){console.info("Unable to set Web3Modal version in storage")}},getWalletRouterData:function(){var e,t=null==(e=y.state.data)?void 0:e.Wallet;if(!t)throw new Error('Missing "Wallet" view data');return t}},I=b({enabled:typeof location<"u"&&(location.hostname.includes("localhost")||location.protocol.includes("https")),userSessionId:"",events:[],connectedWalletId:void 0}),C={state:I,subscribe:function(e){return m(I.events,(function(){return e(function(e,t){var n=f.get(e);n||console.warn("Please use proxy object");var r=(0,s.Z)(n,3),o=r[0],a=r[1];return(0,r[2])(o,a(),t)}(I.events[I.events.length-1]))}))},initialize:function(){I.enabled&&typeof(null==crypto?void 0:crypto.randomUUID)<"u"&&(I.userSessionId=crypto.randomUUID())},setConnectedWalletId:function(e){I.connectedWalletId=e},click:function(e){if(I.enabled){var t={type:"CLICK",name:e.name,userSessionId:I.userSessionId,timestamp:Date.now(),data:e};I.events.push(t)}},track:function(e){if(I.enabled){var t={type:"TRACK",name:e.name,userSessionId:I.userSessionId,timestamp:Date.now(),data:e};I.events.push(t)}},view:function(e){if(I.enabled){var t={type:"VIEW",name:e.name,userSessionId:I.userSessionId,timestamp:Date.now(),data:e};I.events.push(t)}}},O=b({chains:void 0,walletConnectUri:void 0,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1}),W={state:O,subscribe:function(e){return m(O,(function(){return e(O)}))},setChains:function(e){O.chains=e},setWalletConnectUri:function(e){O.walletConnectUri=e},setIsCustomDesktop:function(e){O.isCustomDesktop=e},setIsCustomMobile:function(e){O.isCustomMobile=e},setIsDataLoaded:function(e){O.isDataLoaded=e},setIsUiLoaded:function(e){O.isUiLoaded=e},setIsAuth:function(e){O.isAuth=e}},E=b({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chains:void 0,enableAuthMode:!1,enableExplorer:!0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),k={state:E,subscribe:function(e){return m(E,(function(){return e(E)}))},setConfig:function(e){var t,n;C.initialize(),W.setChains(e.chains),W.setIsAuth(Boolean(e.enableAuthMode)),W.setIsCustomMobile(Boolean(null==(t=e.mobileWallets)?void 0:t.length)),W.setIsCustomDesktop(Boolean(null==(n=e.desktopWallets)?void 0:n.length)),w.setModalVersionInStorage(),Object.assign(E,e)}},j=Object.defineProperty,x=Object.getOwnPropertySymbols,A=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable,Z=function(e,t,n){return t in e?j(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n},M=function(e,t){for(var n in t||(t={}))A.call(t,n)&&Z(e,n,t[n]);if(x){var r,a=(0,o.Z)(x(t));try{for(a.s();!(r=a.n()).done;){n=r.value;L.call(t,n)&&Z(e,n,t[n])}}catch(i){a.e(i)}finally{a.f()}}return e},P="https://explorer-api.walletconnect.com",U="wcm",D="js-2.6.1";function S(e,t){return N.apply(this,arguments)}function N(){return(N=(0,i.Z)((0,a.Z)().mark((function e(t,n){var r,o;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=M({sdkType:U,sdkVersion:D},n),(o=new URL(t,P)).searchParams.append("projectId",k.state.projectId),Object.entries(r).forEach((function(e){var t=(0,s.Z)(e,2),n=t[0],r=t[1];r&&o.searchParams.append(n,String(r))})),e.next=5,fetch(o);case 5:return e.abrupt("return",e.sent.json());case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var R=function(e){return(0,i.Z)((0,a.Z)().mark((function t(){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",S("/w3m/v1/getDesktopListings",e));case 1:case"end":return t.stop()}}),t)})))()},T=function(e){return(0,i.Z)((0,a.Z)().mark((function t(){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",S("/w3m/v1/getMobileListings",e));case 1:case"end":return t.stop()}}),t)})))()},_=function(e){return(0,i.Z)((0,a.Z)().mark((function t(){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",S("/w3m/v1/getAllListings",e));case 1:case"end":return t.stop()}}),t)})))()},V=function(e){return"".concat(P,"/w3m/v1/getWalletImage/").concat(e,"?projectId=").concat(k.state.projectId,"&sdkType=").concat(U,"&sdkVersion=").concat(D)},z=function(e){return"".concat(P,"/w3m/v1/getAssetImage/").concat(e,"?projectId=").concat(k.state.projectId,"&sdkType=").concat(U,"&sdkVersion=").concat(D)},B=Object.defineProperty,H=Object.getOwnPropertySymbols,K=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable,q=function(e,t,n){return t in e?B(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n},F=function(e,t){for(var n in t||(t={}))K.call(t,n)&&q(e,n,t[n]);if(H){var r,a=(0,o.Z)(H(t));try{for(a.s();!(r=a.n()).done;){n=r.value;J.call(t,n)&&q(e,n,t[n])}}catch(i){a.e(i)}finally{a.f()}}return e},G=w.isMobile(),Q=b({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},recomendedWallets:[]}),X={state:Q,getRecomendedWallets:function(){return(0,i.Z)((0,a.Z)().mark((function e(){var t,n,r,o,i,s,c,u,l,f,d,p,v,h,b;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=k.state,n=t.explorerRecommendedWalletIds,r=t.explorerExcludedWalletIds,"NONE"!==n&&("ALL"!==r||n)){e.next=3;break}return e.abrupt("return",Q.recomendedWallets);case 3:if(!w.isArray(n)){e.next=13;break}return o={recommendedIds:n.join(",")},e.next=7,_(o);case 7:i=e.sent,s=i.listings,(c=Object.values(s)).sort((function(e,t){return n.indexOf(e.id)-n.indexOf(t.id)})),Q.recomendedWallets=c,e.next=31;break;case 13:if(u=W.state,l=u.chains,f=u.isAuth,d=null===l||void 0===l?void 0:l.join(","),p=w.isArray(r),v={page:1,sdks:f?"auth_v1":void 0,entries:w.RECOMMENDED_WALLET_AMOUNT,chains:d,version:2,excludedIds:p?r.join(","):void 0},!G){e.next=25;break}return e.next=22,T(v);case 22:e.t0=e.sent,e.next=28;break;case 25:return e.next=27,R(v);case 27:e.t0=e.sent;case 28:h=e.t0,b=h.listings,Q.recomendedWallets=Object.values(b);case 31:return e.abrupt("return",Q.recomendedWallets);case 32:case"end":return e.stop()}}),e)})))()},getWallets:function(e){return(0,i.Z)((0,a.Z)().mark((function t(){var n,o,i,s,c,u,l,f,d,p,v,h;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=F({},e),o=k.state,i=o.explorerRecommendedWalletIds,s=o.explorerExcludedWalletIds,c=Q.recomendedWallets,"ALL"!==s){t.next=3;break}return t.abrupt("return",Q.wallets);case 3:if(c.length?n.excludedIds=c.map((function(e){return e.id})).join(","):w.isArray(i)&&(n.excludedIds=i.join(",")),w.isArray(s)&&(n.excludedIds=[n.excludedIds,s].filter(Boolean).join(",")),W.state.isAuth&&(n.sdks="auth_v1"),u=e.page,l=e.search,!G){t.next=12;break}return t.next=9,T(n);case 9:t.t0=t.sent,t.next=15;break;case 12:return t.next=14,R(n);case 14:t.t0=t.sent;case 15:return f=t.t0,d=f.listings,p=f.total,v=Object.values(d),h=l?"search":"wallets",t.abrupt("return",(Q[h]={listings:[].concat((0,r.Z)(Q[h].listings),v),total:p,page:null!==u&&void 0!==u?u:1},{listings:v,total:p}));case 21:case"end":return t.stop()}}),t)})))()},getWalletImageUrl:function(e){return V(e)},getAssetImageUrl:function(e){return z(e)},resetSearch:function(){Q.search={listings:[],total:0,page:1}}},Y=b({open:!1}),$={state:Y,subscribe:function(e){return m(Y,(function(){return e(Y)}))},open:function(e){return(0,i.Z)((0,a.Z)().mark((function t(){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t){var n=W.state,r=n.isUiLoaded,o=n.isDataLoaded;if(w.removeWalletConnectDeepLink(),W.setWalletConnectUri(null===e||void 0===e?void 0:e.uri),W.setChains(null===e||void 0===e?void 0:e.chains),y.reset("ConnectWallet"),r&&o)Y.open=!0,t();else var a=setInterval((function(){var e=W.state;e.isUiLoaded&&e.isDataLoaded&&(clearInterval(a),Y.open=!0,t())}),200)})));case 1:case"end":return t.stop()}}),t)})))()},close:function(){Y.open=!1}},ee=Object.defineProperty,te=Object.getOwnPropertySymbols,ne=Object.prototype.hasOwnProperty,re=Object.prototype.propertyIsEnumerable,oe=function(e,t,n){return t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n};var ae=b({themeMode:typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}),ie={state:ae,subscribe:function(e){return m(ae,(function(){return e(ae)}))},setThemeConfig:function(e){var t=e.themeMode,n=e.themeVariables;t&&(ae.themeMode=t),n&&(ae.themeVariables=function(e,t){for(var n in t||(t={}))ne.call(t,n)&&oe(e,n,t[n]);if(te){var r,a=(0,o.Z)(te(t));try{for(a.s();!(r=a.n()).done;)n=r.value,re.call(t,n)&&oe(e,n,t[n])}catch(i){a.e(i)}finally{a.f()}}return e}({},n))}},se=b({open:!1,message:"",variant:"success"}),ce={state:se,subscribe:function(e){return m(se,(function(){return e(se)}))},openToast:function(e,t){se.open=!0,se.message=e,se.variant=t},closeToast:function(){se.open=!1}}},4290:function(e,t,n){n.r(t),n.d(t,{WalletConnectModal:function(){return c}});var r=n(74165),o=n(15861),a=n(15671),i=n(43144),s=n(52337),c=function(){function e(t){(0,a.Z)(this,e),this.openModal=s.jb.open,this.closeModal=s.jb.close,this.subscribeModal=s.jb.subscribe,this.setTheme=s.Ic.setThemeConfig,s.Ic.setThemeConfig(t),s.t0.setConfig(t),this.initUi()}return(0,i.Z)(e,[{key:"initUi",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(typeof window<"u")){e.next=5;break}return e.next=3,n.e(383).then(n.bind(n,98383));case 3:t=document.createElement("wcm-modal"),document.body.insertAdjacentElement("beforeend",t),s.zb.setIsUiLoaded(!0);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}]),e}()}}]);