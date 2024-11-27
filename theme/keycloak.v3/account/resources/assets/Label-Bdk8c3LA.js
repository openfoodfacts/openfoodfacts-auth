import{_ as oe,B as ne,p as se,f as p,q as ie,r as W}from"./main-6tNfb3KR.js";import*as t from"react";import{useState as S}from"react";const l={button:"pf-v5-c-button",label:"pf-v5-c-label",labelActions:"pf-v5-c-label__actions",labelContent:"pf-v5-c-label__content",labelIcon:"pf-v5-c-label__icon",labelText:"pf-v5-c-label__text",modifiers:{compact:"pf-m-compact",blue:"pf-m-blue",green:"pf-m-green",orange:"pf-m-orange",red:"pf-m-red",purple:"pf-m-purple",cyan:"pf-m-cyan",gold:"pf-m-gold",outline:"pf-m-outline",overflow:"pf-m-overflow",add:"pf-m-add",editable:"pf-m-editable",editableActive:"pf-m-editable-active",disabled:"pf-m-disabled"},themeDark:"pf-v5-theme-dark"},re={button:"pf-v5-c-button",labelGroup:"pf-v5-c-label-group",labelGroupClose:"pf-v5-c-label-group__close",labelGroupLabel:"pf-v5-c-label-group__label",labelGroupList:"pf-v5-c-label-group__list",labelGroupListItem:"pf-v5-c-label-group__list-item",labelGroupMain:"pf-v5-c-label-group__main",labelGroupTextarea:"pf-v5-c-label-group__textarea",modifiers:{category:"pf-m-category",vertical:"pf-m-vertical",editable:"pf-m-editable",textarea:"pf-m-textarea"}},ce={name:"--pf-v5-c-label__text--MaxWidth",value:"100%",var:"var(--pf-v5-c-label__text--MaxWidth)"},pe={blue:l.modifiers.blue,cyan:l.modifiers.cyan,green:l.modifiers.green,orange:l.modifiers.orange,purple:l.modifiers.purple,red:l.modifiers.red,gold:l.modifiers.gold,grey:""},ue=x=>{var{children:i,className:V="",color:F="grey",variant:q="filled",isCompact:H=!1,isDisabled:y=!1,isEditable:c=!1,editableProps:k,textMaxWidth:L,tooltipPosition:w,icon:O,onClose:P,onClick:r,onEditCancel:R,onEditComplete:d,closeBtn:K,closeBtnAriaLabel:$,closeBtnProps:z,href:s,isOverflowLabel:f,render:j}=x,J=oe(x,["children","className","color","variant","isCompact","isDisabled","isEditable","editableProps","textMaxWidth","tooltipPosition","icon","onClose","onClick","onEditCancel","onEditComplete","closeBtn","closeBtnAriaLabel","closeBtnProps","href","isOverflowLabel","render"]);const[o,u]=S(!1),[Q,U]=S(i),n=t.useRef(),a=t.useRef();t.useEffect(()=>(document.addEventListener("mousedown",I),document.addEventListener("keydown",B),()=>{document.removeEventListener("mousedown",I),document.removeEventListener("keydown",B)})),t.useEffect(()=>{r&&s?console.warn("Link labels cannot have onClick passed, this results in invalid HTML. Please remove either the href or onClick prop."):r&&c&&console.warn("Editable labels cannot have onClick passed, clicking starts the label edit process. Please remove either the isEditable or onClick prop.")},[r,s,c]);const I=e=>{o&&a&&a.current&&!a.current.contains(e.target)&&(a.current.value&&d&&d(e,a.current.value),u(!1))},B=e=>{var E,_;const g=e.key;if(!(!o&&(!n||!n.current||!n.current.contains(e.target))||o&&(!a||!a.current||!a.current.contains(e.target)))&&(o&&(g==="Enter"||g==="Tab")&&(e.preventDefault(),e.stopImmediatePropagation(),a.current.value&&d&&d(e,a.current.value),u(!1),(E=n?.current)===null||E===void 0||E.focus()),o&&g==="Escape"&&(e.preventDefault(),e.stopImmediatePropagation(),a.current.value&&(a.current.value=i,R&&R(e,i)),u(!1),(_=n?.current)===null||_===void 0||_.focus()),!o&&g==="Enter")){e.preventDefault(),e.stopImmediatePropagation(),u(!0);const ae=e.target,h=document.createRange(),G=window.getSelection();h.selectNodeContents(ae),h.collapse(!1),G.removeAllRanges(),G.addRange(h)}},b=(s||r)&&y,X=t.createElement(ne,Object.assign({type:"button",variant:"plain",onClick:P,"aria-label":$||`Close ${i}`},b&&{isDisabled:!0},z),t.createElement(se,null)),Y=t.createElement("span",{className:p(l.labelActions)},K||X),D=t.createRef(),N=t.useRef(),[C,Z]=t.useState(!1);ie(()=>{const e=c?n:D;o||Z(e.current&&e.current.offsetWidth<e.current.scrollWidth)},[o]);const T=t.createElement(t.Fragment,null,O&&t.createElement("span",{className:p(l.labelIcon)},O),t.createElement("span",Object.assign({ref:D,className:p(l.labelText)},L&&{style:{[ce.name]:L}}),i));t.useEffect(()=>{o&&a&&a.current&&a.current.focus()},[a,o]);const ee=()=>{U(a.current.value)};let m="span";s?m="a":(c||r&&!f)&&(m="button");const te={type:"button",onClick:r},A=m==="button",le=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({className:p(l.labelContent)},C&&{tabIndex:0}),s&&{href:s}),s&&y&&{onClick:e=>e.preventDefault()}),A&&te),c&&Object.assign({ref:n,onClick:e=>{u(!0),e.stopPropagation()}},k)),b&&A&&{disabled:!0}),b&&s&&{tabIndex:-1,"aria-disabled":!0});let v=t.createElement(m,Object.assign({},le),T);j?v=t.createElement(t.Fragment,null,C&&t.createElement(W,{triggerRef:N,content:i,position:w}),j({className:l.labelContent,content:T,componentRef:N})):C&&(v=t.createElement(W,{content:i,position:w},v));const M=f?"button":"span";return t.createElement(M,Object.assign({},J,{className:p(l.label,b&&l.modifiers.disabled,pe[F],q==="outline"&&l.modifiers.outline,f&&l.modifiers.overflow,H&&l.modifiers.compact,c&&re.modifiers.editable,o&&l.modifiers.editableActive,V),onClick:f?r:void 0},M==="button"&&{type:"button"}),!o&&v,!o&&P&&Y,o&&t.createElement("input",Object.assign({className:p(l.labelContent),type:"text",id:"editable-input",ref:a,value:Q,onChange:ee},k)))};ue.displayName="Label";export{ue as L};
//# sourceMappingURL=Label-Bdk8c3LA.js.map