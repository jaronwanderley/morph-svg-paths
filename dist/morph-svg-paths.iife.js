var morphSVGPaths=function(e){"use strict";const a=(e=[],a=[])=>e.reduce(((e,t,r)=>e+t*(a[r]||0)),0);return e.blendValues=a,e.morphPaths=function(e=[]){const t=(e,a)=>`${e} need to ${a}!`,r=" ",o=e=>e.toLowerCase();if(!Array.isArray(e))throw t("Parameter","be a array");if(e.length<2)throw t("Number of paths","minimal of 2");if(e.some((e=>"string"!=typeof e)))throw t("Paths","be String");const n=e.map((e=>e.replace(/,/g,r).replace(/$/g,r).replace(/ *([a-zA-Z]) */g,"$1").replace(/(.*) +$/g,"$1").replace(/([0-9]+)-/g,"$1 -").replace(/ *(a-zA-Z) */g,"$1").replace(/ *( ) */g,"$1").replace(/\s{1,}/g,r).replace(/ ($)/g,"$1").match(/[a-zA-Z][0-9 .-]*/g)?.filter((([e])=>"mlthvcsqaz".split("").includes(o(e)))).map((([e,...a])=>({command:e,values:a.join("").split(r).map((e=>+e))})))));if(new Set(n.map((e=>e?.map((({command:e,values:a})=>`${e}${a.length}`)).join("")))).size>1)throw t("Paths","have same commands");const s=n[0]?.map((({command:e,values:a},t)=>({command:e,values:a.map(((e,a)=>n.reduce(((e,r)=>(r&&e.push(r[t]?.values[a]),e)),[])))})));return(n=[])=>{if(n.length!==e.length)throw t("Count of percentages","be equal to paths");if(n.some((e=>"number"!=typeof e)))throw t("Percentages","be numbers");return s?.map((({command:e,values:t})=>{const s=t.map((e=>a(e,n))).join(r);return`${e}${"z"===o(e)?"":r+s}`})).join(r)}},Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),e}({});
