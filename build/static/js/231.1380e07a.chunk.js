"use strict";(self.webpackChunkdex=self.webpackChunkdex||[]).push([[231],{23231:(e,t,r)=>{r.r(t),r.d(t,{AlchemyProvider:()=>h});var i=r(12492),s=r(88133),n=r(18050),o=r(28786);r(31881);class c{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100;this.sendBatchFn=e,this.maxBatchSize=t,this.pendingBatch=[]}enqueueRequest(e){return(0,i._)(this,void 0,void 0,(function*(){const t={request:e,resolve:void 0,reject:void 0},r=new Promise(((e,r)=>{t.resolve=e,t.reject=r}));return this.pendingBatch.push(t),this.pendingBatch.length===this.maxBatchSize?this.sendBatchRequest():this.pendingBatchTimer||(this.pendingBatchTimer=setTimeout((()=>this.sendBatchRequest()),10)),r}))}sendBatchRequest(){return(0,i._)(this,void 0,void 0,(function*(){const e=this.pendingBatch;this.pendingBatch=[],this.pendingBatchTimer&&(clearTimeout(this.pendingBatchTimer),this.pendingBatchTimer=void 0);const t=e.map((e=>e.request));return this.sendBatchFn(t).then((t=>{e.forEach(((e,r)=>{const i=t[r];if(i.error){const t=new Error(i.error.message);t.code=i.error.code,t.data=i.error.data,e.reject(t)}else e.resolve(i.result)}))}),(t=>{e.forEach((e=>{e.reject(t)}))}))}))}}class h extends n.r{constructor(e){const t=h.getApiKey(e.apiKey),r=h.getAlchemyNetwork(e.network),s=h.getAlchemyConnectionInfo(r,t,"http");void 0!==e.url&&(s.url=e.url),s.throttleLimit=e.maxRetries;super(s,i.E[r]),this.apiKey=e.apiKey,this.maxRetries=e.maxRetries,this.batchRequests=e.batchRequests;const n=Object.assign(Object.assign({},this.connection),{headers:Object.assign(Object.assign({},this.connection.headers),{"Alchemy-Ethers-Sdk-Method":"batchSend"})});this.batcher=new c((e=>(0,o.rd)(n,JSON.stringify(e)))),this.modifyFormatter()}static getApiKey(e){if(null==e)return i.D;if(e&&"string"!==typeof e)throw new Error("Invalid apiKey '".concat(e,"' provided. apiKey must be a string."));return e}static getNetwork(e){return"string"===typeof e&&e in i.C?i.C[e]:(0,s.H)(e)}static getAlchemyNetwork(e){if(void 0===e)return i.a;if("number"===typeof e)throw new Error("Invalid network '".concat(e,"' provided. Network must be a string."));if(!Object.values(i.N).includes(e))throw new Error("Invalid network '".concat(e,"' provided. Network must be one of: ")+"".concat(Object.values(i.N).join(", "),"."));return e}static getAlchemyConnectionInfo(e,t,r){const s="http"===r?(0,i.g)(e,t):(0,i.b)(e,t);return{headers:i.I?{"Alchemy-Ethers-Sdk-Version":i.V}:{"Alchemy-Ethers-Sdk-Version":i.V,"Accept-Encoding":"gzip"},allowGzip:!0,url:s}}detectNetwork(){const e=Object.create(null,{detectNetwork:{get:()=>super.detectNetwork}});return(0,i._)(this,void 0,void 0,(function*(){let t=this.network;if(null==t&&(t=yield e.detectNetwork.call(this),!t))throw new Error("No network detected");return t}))}_startPending(){(0,i.l)("WARNING: Alchemy Provider does not support pending filters")}isCommunityResource(){return this.apiKey===i.D}send(e,t){return this._send(e,t,"send")}_send(e,t,r){let s=arguments.length>3&&void 0!==arguments[3]&&arguments[3];const n={method:e,params:t,id:this._nextId++,jsonrpc:"2.0"};if(Object.assign({},this.connection).headers["Alchemy-Ethers-Sdk-Method"]=r,this.batchRequests||s)return this.batcher.enqueueRequest(n);this.emit("debug",{action:"request",request:(0,i.d)(n),provider:this});const c=["eth_chainId","eth_blockNumber"].indexOf(e)>=0;if(c&&this._cache[e])return this._cache[e];const h=(0,o.rd)(this.connection,JSON.stringify(n),a).then((e=>(this.emit("debug",{action:"response",request:n,response:e,provider:this}),e)),(e=>{throw this.emit("debug",{action:"response",error:e,request:n,provider:this}),e}));return c&&(this._cache[e]=h,setTimeout((()=>{this._cache[e]=null}),0)),h}modifyFormatter(){this.formatter.formats.receiptLog.removed=e=>{if("boolean"===typeof e)return e}}}function a(e){if(e.error){const t=new Error(e.error.message);throw t.code=e.error.code,t.data=e.error.data,t}return e.result}}}]);