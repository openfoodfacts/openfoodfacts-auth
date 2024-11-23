import{u as c,aV as u,aW as d,a4 as i}from"./main-6tNfb3KR.js";import{useCallback as l,useMemo as m}from"react";function p(){const{t}=c(),{addAlert:a,addError:s}=u(),o=l((n,r)=>{if(!(r instanceof d)){s(n,r);return}const e=t(n,{error:r.message});a(e,i.danger,r.description)},[a,s,t]);return m(()=>({addAlert:a,addError:o}),[o,a])}export{p as u};
//# sourceMappingURL=useAccountAlerts-CAkhmYC0.js.map
