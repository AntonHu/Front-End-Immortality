import{u as d,a as p}from"./theme.BkSTs5a3.js";import{d as l,p as u,q as c,v as f,o as _,c as b,_ as m}from"./framework.CDZb2PWb.js";const v=l({__name:"VPCarbonAds",props:{carbonAds:{}},setup(r){const{page:i}=d(),a=r.carbonAds,{isAsideEnabled:s}=p(),o=u();let n=!1;function t(){if(!n){n=!0;const e=document.createElement("script");e.id="_carbonads_js",e.src=`//cdn.carbonads.com/carbon.js?serve=${a.code}&placement=${a.placement}`,e.async=!0,o.value.appendChild(e)}}return c(()=>i.value.relativePath,()=>{var e;n&&s.value&&((e=window._carbonads)==null||e.refresh())}),a&&f(()=>{s.value?t():c(s,e=>e&&t())}),(e,h)=>(_(),b("div",{class:"VPCarbonAds",ref_key:"container",ref:o},null,512))}}),k=m(v,[["__scopeId","data-v-b1b96790"]]);export{k as default};