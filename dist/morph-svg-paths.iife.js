var MorphSVGPaths=function(e){"use strict";const a=(e=[],a=[])=>e.reduce(((e,r,t)=>e+r*(a[t]||0)),0);return e.blendValues=a,e.morphPaths=function(e=[]){const r=(e,a)=>`${e} need to ${a}!`,t=" ",o=e=>e.toLowerCase();if(!Array.isArray(e))throw r("Parameter","be a array");if(e.length<2)throw r("Number of paths","minimal of 2");if(e.some((e=>"string"!=typeof e)))throw r("Paths","be String");const n=e.map((e=>e.replace(/,/g,t).replace(/$/g,t).replace(/ *([a-zA-Z]) */g,"$1").replace(/(.*) +$/g,"$1").replace(/([0-9]+)-/g,"$1 -").replace(/ *(a-zA-Z) */g,"$1").replace(/ *( ) */g,"$1").replace(/\s{1,}/g,t).replace(/ ($)/g,"$1").match(/[a-zA-Z][0-9 .-]*/g)?.filter((([e])=>"mlthvcsqaz".includes(o(e)))).map((([e,...a])=>({command:e,values:a.join("").split(t).map((e=>+e))})))));if(new Set(n.map((e=>e?.map((({command:e,values:a})=>`${e}${a.length}`)).join("")))).size>1)throw r("Paths","have same commands");const s=n[0]?.map((({command:e,values:a},r)=>({command:e,values:a.map(((e,a)=>n.reduce(((e,t)=>(t&&e.push(t[r]?.values[a]),e)),[])))})));return(n=[])=>{if(n.length!==e.length)throw r("Count of percentages","be equal to paths");if(n.some((e=>"number"!=typeof e)))throw r("Percentages","be numbers");return s?.map((({command:e,values:r})=>{const s=r.map((e=>a(e,n))).join(t);return`${e}${"z"===o(e)?"":t+s}`})).join(t)}},Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),e}({});
