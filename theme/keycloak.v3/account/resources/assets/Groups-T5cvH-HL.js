import{jsx as e,jsxs as L}from"react/jsx-runtime";import{useState as m}from"react";import{u as C,K as D,a as M,P as w,L as p,N as k}from"./main-6tNfb3KR.js";import{D as $,a as c,b as l}from"./DataListItemRow-fblFPHfe.js";import{D as o,a as s}from"./DataListItemCells-BHb5yAbM.js";import"react-dom";const O=()=>{const{t:r}=C(),u=D(),[b,g]=m([]),[h,f]=m(!1);M(i=>k({signal:i,context:u}),i=>{h||i.forEach(t=>n(t,i,i.map(({path:d})=>d))),g(i)},[h]);const n=(i,t,d)=>{const a=i.path.slice(0,i.path.lastIndexOf("/"));a&&!d.includes(a)&&(i={name:a.slice(a.lastIndexOf("/")+1),path:a},t.push(i),d.push(a),n(i,t,d))};return e(w,{title:r("groups"),description:r("groupDescriptionLabel"),children:L($,{id:"groups-list","aria-label":r("groups"),isCompact:!0,children:[e(c,{id:"groups-list-header","aria-label":r("groupsListHeader"),children:e(l,{children:e(o,{dataListCells:[e(s,{children:e(p,{label:r("directMembership"),id:"directMembership-checkbox","data-testid":"directMembership-checkbox",isChecked:h,onChange:(i,t)=>f(t)})},"directMembership-header")]})})}),e(c,{id:"groups-list-columns-names","aria-label":r("groupsListColumnsNames"),children:e(l,{children:e(o,{dataListCells:[e(s,{width:2,children:e("strong",{children:r("name")})},"group-name-header"),e(s,{width:2,children:e("strong",{children:r("path")})},"group-path-header"),e(s,{width:2,children:e("strong",{children:r("directMembership")})},"group-direct-membership-header")]})})}),b.map((i,t)=>e(c,{id:`${t}-group`,"aria-labelledby":"groups-list",children:e(l,{children:e(o,{dataListCells:[e(s,{"data-testid":`group[${t}].name`,width:2,children:i.name},"name-"+t),e(s,{id:`${t}-group-path`,width:2,children:i.path},"path-"+t),e(s,{id:`${t}-group-directMembership`,width:2,children:e(p,{id:`${t}-checkbox-directMembership`,isChecked:i.id!=null,isDisabled:!0})},"directMembership-"+t)]})})},"group-"+t))]})})};export{O as Groups,O as default};
//# sourceMappingURL=Groups-T5cvH-HL.js.map