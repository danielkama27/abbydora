(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{1462:function(e,t,s){Promise.resolve().then(s.bind(s,1176))},8030:function(e,t,s){"use strict";s.d(t,{Z:function(){return o}});var r=s(2265);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),n=function(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];return t.filter((e,t,s)=>!!e&&s.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let c=(0,r.forwardRef)((e,t)=>{let{color:s="currentColor",size:a=24,strokeWidth:c=2,absoluteStrokeWidth:o,className:i="",children:d,iconNode:h,...u}=e;return(0,r.createElement)("svg",{ref:t,...l,width:a,height:a,stroke:s,strokeWidth:o?24*Number(c)/Number(a):c,className:n("lucide",i),...u},[...h.map(e=>{let[t,s]=e;return(0,r.createElement)(t,s)}),...Array.isArray(d)?d:[d]])}),o=(e,t)=>{let s=(0,r.forwardRef)((s,l)=>{let{className:o,...i}=s;return(0,r.createElement)(c,{ref:l,iconNode:t,className:n("lucide-".concat(a(e)),o),...i})});return s.displayName="".concat(e),s}},9715:function(e,t,s){"use strict";s.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,s(8030).Z)("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]])},1240:function(e,t,s){"use strict";s.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,s(8030).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},1176:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return i}});var r=s(7437),a=s(8030);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,a.Z)("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);var l=s(9715),c=s(1240);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,a.Z)("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);function i(){let e=[{label:"Total Revenue",value:"$24,530",icon:n,change:"+12%"},{label:"Total Orders",value:"1,284",icon:l.Z,change:"+5%"},{label:"Total Customers",value:"3,420",icon:c.Z,change:"+8%"},{label:"Conversion",value:"3.2%",icon:o,change:"+0.4%"}];return(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsx)("h1",{className:"font-serif text-2xl font-medium text-stone-900",children:"Dashboard"}),(0,r.jsx)("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-4",children:e.map((e,t)=>(0,r.jsxs)("div",{className:"bg-white border border-stone-100 p-6",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,r.jsx)(e.icon,{className:"h-5 w-5 text-stone-400"}),(0,r.jsx)("span",{className:"text-xs text-green-600 bg-green-50 px-2 py-0.5",children:e.change})]}),(0,r.jsx)("p",{className:"text-2xl font-medium text-stone-900",children:e.value}),(0,r.jsx)("p",{className:"text-sm text-stone-400 mt-1",children:e.label})]},t))}),(0,r.jsxs)("div",{className:"bg-white border border-stone-100 p-6",children:[(0,r.jsx)("h2",{className:"font-medium text-stone-900 mb-4",children:"Recent Orders"}),(0,r.jsx)("div",{className:"overflow-x-auto",children:(0,r.jsxs)("table",{className:"w-full text-sm",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{className:"text-left text-stone-400 border-b border-stone-100",children:[(0,r.jsx)("th",{className:"pb-3 font-normal",children:"Order ID"}),(0,r.jsx)("th",{className:"pb-3 font-normal",children:"Customer"}),(0,r.jsx)("th",{className:"pb-3 font-normal",children:"Total"}),(0,r.jsx)("th",{className:"pb-3 font-normal",children:"Status"})]})}),(0,r.jsx)("tbody",{className:"text-stone-600",children:[{id:"#ORD-001",customer:"Alice M.",total:"$245.00",status:"Delivered"},{id:"#ORD-002",customer:"John D.",total:"$128.00",status:"Shipped"},{id:"#ORD-003",customer:"Sarah K.",total:"$89.00",status:"Processing"},{id:"#ORD-004",customer:"Mike R.",total:"$356.00",status:"Delivered"}].map((e,t)=>(0,r.jsxs)("tr",{className:"border-b border-stone-50 last:border-0",children:[(0,r.jsx)("td",{className:"py-3",children:e.id}),(0,r.jsx)("td",{className:"py-3",children:e.customer}),(0,r.jsx)("td",{className:"py-3",children:e.total}),(0,r.jsx)("td",{className:"py-3",children:(0,r.jsx)("span",{className:"text-xs px-2 py-0.5 rounded-sm ".concat("Delivered"===e.status?"bg-green-50 text-green-600":"Shipped"===e.status?"bg-blue-50 text-blue-600":"bg-amber-50 text-amber-600"),children:e.status})})]},t))})]})})]})]})}}},function(e){e.O(0,[971,23,744],function(){return e(e.s=1462)}),_N_E=e.O()}]);