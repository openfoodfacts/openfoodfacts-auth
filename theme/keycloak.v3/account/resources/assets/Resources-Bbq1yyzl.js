import{jsx as n,jsxs as y,Fragment as J}from"react/jsx-runtime";import*as o from"react";import k,{useEffect as Xe,Fragment as Ot,useState as $}from"react";import{a9 as wt,Q as St,R as Ie,_ as M,f as C,v as pe,aa as ne,B as N,r as Et,p as Ct,c as H,A as fe,ab as Tt,ac as Lt,ad as It,ae as kt,af as Bt,ag as G,ah as _t,ai as ke,aj as Be,U as At,x as _e,ak as Rt,al as Nt,am as Ae,u as X,K as ae,V as Ge,an as qe,ao as ve,X as He,ap as Ze,aq as Mt,ar as Qe,I as Kt,as as Dt,at as Pt,au as Je,av as Ye,aw as q,ax as z,ay as et,az as D,aA as $t,aB as ge,i as Wt,j as zt,k as Re,m as Vt,n as jt,aC as Ft,aD as me,aE as Ut,aF as Ne,aG as Xt,aH as Me,aI as tt,aJ as Gt,a as qt,aK as Ht,S as Zt,z as Qt,D as Ke,M as De,E as Pe,aL as $e,W as We,aM as Jt,P as Yt}from"./main-VxsXDFHF.js";import{u as nt,f as at,a as it,b as en}from"./api-B5--sxS0.js";import{u as ie}from"./useAccountAlerts-ChKJBvtE.js";import{T as tn}from"./Trans-BgoI7Vgw.js";import"react-dom";const V={divider:"pf-v5-c-divider",modifiers:{buttonGroup:"pf-m-button-group",iconButtonGroup:"pf-m-icon-button-group",vertical:"pf-m-vertical"},overflowMenu:"pf-v5-c-overflow-menu",overflowMenuContent:"pf-v5-c-overflow-menu__content",overflowMenuControl:"pf-v5-c-overflow-menu__control",overflowMenuGroup:"pf-v5-c-overflow-menu__group",overflowMenuItem:"pf-v5-c-overflow-menu__item"},j=o.createContext({isBelowBreakpoint:!1});class ye extends o.Component{constructor(e){super(e),this.observer=()=>{},this.handleResize=()=>{const t=wt[this.props.breakpoint];if(!t){console.error("OverflowMenu will not be visible without a valid breakpoint.");return}const l=(this.state.breakpointRef?this.state.breakpointRef.clientWidth:window.innerWidth)<t;this.state.isBelowBreakpoint!==l&&this.setState({isBelowBreakpoint:l})},this.handleResizeWithDelay=St(this.handleResize,250),this.state={isBelowBreakpoint:!1,breakpointRef:void 0}}getBreakpointRef(){const{breakpointReference:e}=this.props;if(e.current)return e.current;if(typeof e=="function")return e()}componentDidMount(){const e=this.props.breakpointReference?this.getBreakpointRef():void 0;this.setState({breakpointRef:e}),this.observer=Ie(e,this.handleResizeWithDelay),this.handleResize()}componentDidUpdate(e,t){const a=this.props.breakpointReference?this.getBreakpointRef():void 0;t.breakpointRef!==a&&(this.observer(),this.setState({breakpointRef:a}),this.observer=Ie(a,this.handleResizeWithDelay),this.handleResize())}componentWillUnmount(){this.observer()}render(){const e=this.props,{className:t,breakpoint:a,children:l,breakpointReference:c}=e,r=M(e,["className","breakpoint","children","breakpointReference"]);return o.createElement("div",Object.assign({},r,{className:C(V.overflowMenu,t)}),o.createElement(j.Provider,{value:{isBelowBreakpoint:this.state.isBelowBreakpoint}},l))}}ye.displayName="OverflowMenu";ye.contextType=j;const st=i=>{var{className:e,children:t,hasAdditionalOptions:a}=i,l=M(i,["className","children","hasAdditionalOptions"]);return o.createElement(j.Consumer,null,c=>(c.isBelowBreakpoint||a)&&o.createElement("div",Object.assign({className:C(V.overflowMenuControl,e)},l)," ",t," "))};st.displayName="OverflowMenuControl";const lt=({className:i,children:e,isPersistent:t})=>o.createElement(j.Consumer,null,a=>(!a.isBelowBreakpoint||t)&&o.createElement("div",{className:C(V.overflowMenuContent,i)},e));lt.displayName="OverflowMenuContent";const ot=i=>{var{className:e,children:t,isPersistent:a=!1,groupType:l}=i,c=M(i,["className","children","isPersistent","groupType"]);return o.createElement(j.Consumer,null,r=>(a||!r.isBelowBreakpoint)&&o.createElement("div",Object.assign({className:C(V.overflowMenuGroup,l==="button"&&V.modifiers.buttonGroup,l==="icon"&&V.modifiers.iconButtonGroup,e)},c),t))};ot.displayName="OverflowMenuGroup";const ue=({className:i,children:e,isPersistent:t=!1})=>o.createElement(j.Consumer,null,a=>(t||!a.isBelowBreakpoint)&&o.createElement("div",{className:C(V.overflowMenuItem,i)}," ",e," "));ue.displayName="OverflowMenuItem";const Y=i=>{var{children:e,isShared:t=!1,itemId:a}=i,l=M(i,["children","isShared","itemId"]);return o.createElement(j.Consumer,null,c=>(!t||c.isBelowBreakpoint)&&o.createElement(pe,Object.assign({component:"button",value:a},l),e))};Y.displayName="OverflowMenuDropdownItem";const u={button:"pf-v5-c-button",dirRtl:"pf-v5-m-dir-rtl",modifiers:{fill:"pf-m-fill",scrollable:"pf-m-scrollable",noBorderBottom:"pf-m-no-border-bottom",box:"pf-m-box",vertical:"pf-m-vertical",current:"pf-m-current",colorSchemeLight_300:"pf-m-color-scheme--light-300",expandable:"pf-m-expandable",nonExpandable:"pf-m-non-expandable",expandableOnSm:"pf-m-expandable-on-sm",nonExpandableOnSm:"pf-m-non-expandable-on-sm",expandableOnMd:"pf-m-expandable-on-md",nonExpandableOnMd:"pf-m-non-expandable-on-md",expandableOnLg:"pf-m-expandable-on-lg",nonExpandableOnLg:"pf-m-non-expandable-on-lg",expandableOnXl:"pf-m-expandable-on-xl",nonExpandableOnXl:"pf-m-non-expandable-on-xl",expandableOn_2xl:"pf-m-expandable-on-2xl",nonExpandableOn_2xl:"pf-m-non-expandable-on-2xl",expanded:"pf-m-expanded",secondary:"pf-m-secondary",pageInsets:"pf-m-page-insets",overflow:"pf-m-overflow",action:"pf-m-action",active:"pf-m-active",disabled:"pf-m-disabled",ariaDisabled:"pf-m-aria-disabled",insetNone:"pf-m-inset-none",insetSm:"pf-m-inset-sm",insetMd:"pf-m-inset-md",insetLg:"pf-m-inset-lg",insetXl:"pf-m-inset-xl",inset_2xl:"pf-m-inset-2xl",insetNoneOnSm:"pf-m-inset-none-on-sm",insetSmOnSm:"pf-m-inset-sm-on-sm",insetMdOnSm:"pf-m-inset-md-on-sm",insetLgOnSm:"pf-m-inset-lg-on-sm",insetXlOnSm:"pf-m-inset-xl-on-sm",inset_2xlOnSm:"pf-m-inset-2xl-on-sm",insetNoneOnMd:"pf-m-inset-none-on-md",insetSmOnMd:"pf-m-inset-sm-on-md",insetMdOnMd:"pf-m-inset-md-on-md",insetLgOnMd:"pf-m-inset-lg-on-md",insetXlOnMd:"pf-m-inset-xl-on-md",inset_2xlOnMd:"pf-m-inset-2xl-on-md",insetNoneOnLg:"pf-m-inset-none-on-lg",insetSmOnLg:"pf-m-inset-sm-on-lg",insetMdOnLg:"pf-m-inset-md-on-lg",insetLgOnLg:"pf-m-inset-lg-on-lg",insetXlOnLg:"pf-m-inset-xl-on-lg",inset_2xlOnLg:"pf-m-inset-2xl-on-lg",insetNoneOnXl:"pf-m-inset-none-on-xl",insetSmOnXl:"pf-m-inset-sm-on-xl",insetMdOnXl:"pf-m-inset-md-on-xl",insetLgOnXl:"pf-m-inset-lg-on-xl",insetXlOnXl:"pf-m-inset-xl-on-xl",inset_2xlOnXl:"pf-m-inset-2xl-on-xl",insetNoneOn_2xl:"pf-m-inset-none-on-2xl",insetSmOn_2xl:"pf-m-inset-sm-on-2xl",insetMdOn_2xl:"pf-m-inset-md-on-2xl",insetLgOn_2xl:"pf-m-inset-lg-on-2xl",insetXlOn_2xl:"pf-m-inset-xl-on-2xl",inset_2xlOn_2xl:"pf-m-inset-2xl-on-2xl"},tabs:"pf-v5-c-tabs",tabsAdd:"pf-v5-c-tabs__add",tabsItem:"pf-v5-c-tabs__item",tabsItemAction:"pf-v5-c-tabs__item-action",tabsItemActionIcon:"pf-v5-c-tabs__item-action-icon",tabsItemIcon:"pf-v5-c-tabs__item-icon",tabsItemText:"pf-v5-c-tabs__item-text",tabsLink:"pf-v5-c-tabs__link",tabsLinkToggleIcon:"pf-v5-c-tabs__link-toggle-icon",tabsList:"pf-v5-c-tabs__list",tabsScrollButton:"pf-v5-c-tabs__scroll-button",tabsToggle:"pf-v5-c-tabs__toggle",tabsToggleButton:"pf-v5-c-tabs__toggle-button",tabsToggleIcon:"pf-v5-c-tabs__toggle-icon",tabsToggleText:"pf-v5-c-tabs__toggle-text",themeDark:"pf-v5-theme-dark"},xe=i=>{var{children:e,tabContentRef:t,ouiaId:a,parentInnerRef:l,ouiaSafe:c}=i,r=M(i,["children","tabContentRef","ouiaId","parentInnerRef","ouiaSafe"]);const h=r.href?"a":"button";return o.createElement(h,Object.assign({},!r.href&&{type:"button"},{ref:l},ne(xe.displayName,a,c),r),e)};xe.displayName="TabButton";const se=o.createContext({variant:"default",mountOnEnter:!1,unmountOnExit:!1,localActiveKey:"",uniqueId:"",handleTabClick:()=>null,handleTabClose:void 0}),nn=se.Provider,an=se.Consumer,sn=i=>{var{children:e,className:t,onClick:a,isDisabled:l,"aria-label":c="Tab action",innerRef:r,ouiaId:h,ouiaSafe:m}=i,p=M(i,["children","className","onClick","isDisabled","aria-label","innerRef","ouiaId","ouiaSafe"]);return o.createElement("span",{className:C(u.tabsItemAction,t)},o.createElement(N,Object.assign({ref:r,type:"button",variant:"plain","aria-label":c,onClick:a,isDisabled:l},ne(Oe.displayName,h,m),p),o.createElement("span",{className:C(u.tabsItemActionIcon)},e)))},Oe=o.forwardRef((i,e)=>o.createElement(sn,Object.assign({},i,{innerRef:e})));Oe.displayName="TabAction";const ln=i=>{var{title:e,eventKey:t,tabContentRef:a,id:l,tabContentId:c,className:r="",ouiaId:h,isDisabled:m,isAriaDisabled:p,inoperableEvents:b=["onClick","onKeyPress"],href:d,innerRef:v,tooltip:g,closeButtonAriaLabel:L,isCloseDisabled:_=!1,actions:A}=i,B=M(i,["title","eventKey","tabContentRef","id","tabContentId","className","ouiaId","isDisabled","isAriaDisabled","inoperableEvents","href","innerRef","tooltip","closeButtonAriaLabel","isCloseDisabled","actions"]);const S=b.reduce((P,le)=>Object.assign(Object.assign({},P),{[le]:oe=>{oe.preventDefault()}}),{}),{mountOnEnter:s,localActiveKey:x,unmountOnExit:w,uniqueId:K,handleTabClick:W,handleTabClose:T}=o.useContext(se);let f=c?`${c}`:`pf-tab-section-${t}-${l||K}`;(s||w)&&t!==x&&(f=void 0);const O=!d,R=()=>{if(m)return O?null:-1;if(p)return null},I=o.createElement(xe,Object.assign({parentInnerRef:v,className:C(u.tabsLink,m&&d&&u.modifiers.disabled,p&&u.modifiers.ariaDisabled),disabled:O?m:null,"aria-disabled":m||p,tabIndex:R(),onClick:P=>W(P,t,a)},p?S:null,{id:`pf-tab-${t}-${l||K}`,"aria-controls":f,tabContentRef:a,ouiaId:h,href:d,role:"tab","aria-selected":t===x},B),e);return o.createElement("li",{className:C(u.tabsItem,t===x&&u.modifiers.current,(T||A)&&u.modifiers.action,(m||p)&&u.modifiers.disabled,r),role:"presentation"},g?o.createElement(Et,Object.assign({},g.props),I):I,A&&A,T!==void 0&&o.createElement(Oe,{"aria-label":L||"Close tab",onClick:P=>T(P,t,a),isDisabled:_},o.createElement(Ct,null)))},he=o.forwardRef((i,e)=>o.createElement(ln,Object.assign({innerRef:e},i)));he.displayName="Tab";const on={name:"PlusIcon",height:512,width:448,svgPath:"M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z",yOffset:0,xOffset:0},rn=H(on),be={modifiers:{light_300:"pf-m-light-300",padding:"pf-m-padding"},tabContent:"pf-v5-c-tab-content",tabContentBody:"pf-v5-c-tab-content__body"},ze={default:"",light300:be.modifiers.light_300},cn=i=>{var{id:e,activeKey:t,"aria-label":a,child:l,children:c,className:r,eventKey:h,innerRef:m,ouiaId:p,ouiaSafe:b}=i,d=M(i,["id","activeKey","aria-label","child","children","className","eventKey","innerRef","ouiaId","ouiaSafe"]);if(c||l){let v;return a?v=null:v=c?`${e}`:`pf-tab-${l.props.eventKey}-${e}`,o.createElement(an,null,({variant:g})=>o.createElement("section",Object.assign({ref:m,hidden:c?null:l.props.eventKey!==t,className:c?C(be.tabContent,r,ze[g]):C(be.tabContent,l.props.className,ze[g]),id:c?e:`pf-tab-section-${l.props.eventKey}-${e}`,"aria-label":a,"aria-labelledby":v,role:"tabpanel",tabIndex:0},ne("TabContent",p,b),d),c||l.props.children))}return null},dn=o.forwardRef((i,e)=>o.createElement(cn,Object.assign({},i,{innerRef:e}))),ee=i=>{var{children:e,className:t=""}=i,a=M(i,["children","className"]);return o.createElement("span",Object.assign({className:C(u.tabsItemText,t)},a),e)};ee.displayName="TabTitleText";const rt=i=>{var{className:e,overflowingTabs:t=[],showTabCount:a,defaultTitleText:l="More",toggleAriaLabel:c,zIndex:r=9999}=i,h=M(i,["className","overflowingTabs","showTabCount","defaultTitleText","toggleAriaLabel","zIndex"]);const m=k.useRef(),p=k.useRef(),b=k.useRef(),[d,v]=k.useState(!1),{localActiveKey:g,handleTabClick:L}=k.useContext(se),_=()=>{v(!1),p.current.focus()},A=f=>{var O;const R=(O=m?.current)===null||O===void 0?void 0:O.contains(f.target);d&&R&&f.key==="Escape"&&_()},B=f=>{var O,R;const I=!(!((O=m?.current)===null||O===void 0)&&O.contains(f.target)),P=!(!((R=p?.current)===null||R===void 0)&&R.contains(f.target));d&&I&&P&&_()};k.useEffect(()=>(window.addEventListener("click",B),window.addEventListener("keydown",A),()=>{window.removeEventListener("click",B),window.removeEventListener("keydown",A)}),[d,m,p]);const S=t.find(f=>f.eventKey===g),s=S?.title?S.title:l,x=()=>{v(f=>!f),setTimeout(()=>{if(m?.current){const f=m.current.querySelector("li > button,input:not(:disabled)");f&&f.focus()}},0)},w=k.createElement("li",Object.assign({className:C(u.tabsItem,u.modifiers.overflow,S&&u.modifiers.current,e),role:"presentation",ref:b},h),k.createElement("button",{type:"button",className:C(u.tabsLink,d&&u.modifiers.expanded),onClick:()=>x(),"aria-label":c,"aria-haspopup":"menu","aria-expanded":d,role:"tab",ref:p},k.createElement(ee,null,s,a&&s===l&&` (${t.length})`),k.createElement("span",{className:u.tabsLinkToggleIcon},k.createElement(fe,null)))),K=t.map(f=>k.createElement(Tt,{key:f.eventKey,itemId:f.eventKey,isSelected:g===f.eventKey},f.title)),W=(f,O)=>{_();const R=t.find(I=>I.eventKey===O).tabContentRef;L(f,O,R)},T=k.createElement(Lt,{ref:m,onSelect:(f,O)=>W(f,O)},k.createElement(It,null,k.createElement(kt,null,K)));return k.createElement(k.Fragment,null,w,k.createElement(Bt,{triggerRef:p,popper:T,popperRef:m,isVisible:d,minWidth:"revert",appendTo:b.current,zIndex:r}))};rt.displayName="OverflowTab";var te;(function(i){i.div="div",i.nav="nav"})(te||(te={}));const mn={default:"",light300:u.modifiers.colorSchemeLight_300};class U extends o.Component{constructor(e){super(e),this.tabList=o.createRef(),this.leftScrollButtonRef=o.createRef(),this.direction="ltr",this.scrollTimeout=null,this.countOverflowingElements=t=>Array.from(t.children).filter(l=>!G(t,l)).length,this.handleScrollButtons=()=>{const{isOverflowHorizontal:t}=this.props;clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{const a=this.tabList.current;let l=!0,c=!0,r=!1,h=0;if(a&&!this.props.isVertical&&!t){const m=!G(a,a.firstChild),p=!G(a,a.lastChild);r=m||p,l=!m,c=!p}t&&(h=this.countOverflowingElements(a)),this.setState({enableScrollButtons:r,disableBackScrollButton:l,disableForwardScrollButton:c,overflowingTabCount:h})},100)},this.scrollBack=()=>{if(this.tabList.current){const t=this.tabList.current,a=Array.from(t.children);let l,c,r;for(r=0;r<a.length&&!l;r++)G(t,a[r])&&(l=a[r],c=a[r-1]);c&&(this.direction==="ltr"?t.scrollLeft-=c.scrollWidth:t.scrollLeft+=c.scrollWidth)}},this.scrollForward=()=>{if(this.tabList.current){const t=this.tabList.current,a=Array.from(t.children);let l,c;for(let r=a.length-1;r>=0&&!l;r--)G(t,a[r])&&(l=a[r],c=a[r+1]);c&&(this.direction==="ltr"?t.scrollLeft+=c.scrollWidth:t.scrollLeft-=c.scrollWidth)}},this.hideScrollButtons=()=>{const{enableScrollButtons:t,renderScrollButtons:a,showScrollButtons:l}=this.state;!t&&!l&&a&&this.setState({renderScrollButtons:!1})},this.state={enableScrollButtons:!1,showScrollButtons:!1,renderScrollButtons:!1,disableBackScrollButton:!0,disableForwardScrollButton:!0,shownKeys:this.props.defaultActiveKey!==void 0?[this.props.defaultActiveKey]:[this.props.activeKey],uncontrolledActiveKey:this.props.defaultActiveKey,uncontrolledIsExpandedLocal:this.props.defaultIsExpanded,ouiaStateId:_t(U.displayName),overflowingTabCount:0},this.props.isVertical&&this.props.expandable!==void 0&&!this.props.toggleAriaLabel&&!this.props.toggleText&&console.error("Tabs:","toggleAriaLabel or the toggleText prop is required to make the toggle button accessible")}handleTabClick(e,t,a){const{shownKeys:l}=this.state,{onSelect:c,defaultActiveKey:r}=this.props;r!==void 0?this.setState({uncontrolledActiveKey:t}):c(e,t),a&&(o.Children.toArray(this.props.children).filter(h=>o.isValidElement(h)).filter(({props:h})=>h.tabContentRef&&h.tabContentRef.current).forEach(h=>h.props.tabContentRef.current.hidden=!0),a.current&&(a.current.hidden=!1)),this.props.mountOnEnter&&this.setState({shownKeys:l.concat(t)})}componentDidMount(){this.props.isVertical||(ke&&window.addEventListener("resize",this.handleScrollButtons,!1),this.direction=Be(this.tabList.current),this.handleScrollButtons())}componentWillUnmount(){var e;this.props.isVertical||ke&&window.removeEventListener("resize",this.handleScrollButtons,!1),clearTimeout(this.scrollTimeout),(e=this.leftScrollButtonRef.current)===null||e===void 0||e.removeEventListener("transitionend",this.hideScrollButtons)}componentDidUpdate(e,t){const{activeKey:a,mountOnEnter:l,isOverflowHorizontal:c,children:r}=this.props,{shownKeys:h,overflowingTabCount:m,enableScrollButtons:p}=this.state;e.activeKey!==a&&l&&h.indexOf(a)<0&&this.setState({shownKeys:h.concat(a)}),e.children&&r&&o.Children.toArray(e.children).length!==o.Children.toArray(r).length&&this.handleScrollButtons();const b=this.countOverflowingElements(this.tabList.current);c&&b&&this.setState({overflowingTabCount:b+m}),!t.enableScrollButtons&&p?(this.setState({renderScrollButtons:!0}),setTimeout(()=>{var d;(d=this.leftScrollButtonRef.current)===null||d===void 0||d.addEventListener("transitionend",this.hideScrollButtons),this.setState({showScrollButtons:!0})},100)):t.enableScrollButtons&&!p&&this.setState({showScrollButtons:!1}),this.direction=Be(this.tabList.current)}static getDerivedStateFromProps(e,t){return t.uncontrolledActiveKey===void 0||o.Children.toArray(e.children).filter(l=>o.isValidElement(l)).some(({props:l})=>l.eventKey===t.uncontrolledActiveKey)?null:{uncontrolledActiveKey:e.defaultActiveKey,shownKeys:e.defaultActiveKey!==void 0?[e.defaultActiveKey]:[e.activeKey]}}render(){const e=this.props,{className:t,children:a,activeKey:l,defaultActiveKey:c,id:r,isFilled:h,isSecondary:m,isVertical:p,isBox:b,hasNoBorderBottom:d,leftScrollAriaLabel:v,rightScrollAriaLabel:g,backScrollAriaLabel:L,forwardScrollAriaLabel:_,"aria-label":A,component:B,ouiaId:S,ouiaSafe:s,mountOnEnter:x,unmountOnExit:w,usePageInsets:K,inset:W,variant:T,expandable:f,isExpanded:O,defaultIsExpanded:R,toggleText:I,toggleAriaLabel:P,addButtonAriaLabel:le,onToggle:oe,onClose:dt,onAdd:we,isOverflowHorizontal:Z}=e,mt=M(e,["className","children","activeKey","defaultActiveKey","id","isFilled","isSecondary","isVertical","isBox","hasNoBorderBottom","leftScrollAriaLabel","rightScrollAriaLabel","backScrollAriaLabel","forwardScrollAriaLabel","aria-label","component","ouiaId","ouiaSafe","mountOnEnter","unmountOnExit","usePageInsets","inset","variant","expandable","isExpanded","defaultIsExpanded","toggleText","toggleAriaLabel","addButtonAriaLabel","onToggle","onClose","onAdd","isOverflowHorizontal"]),{showScrollButtons:pt,renderScrollButtons:Se,disableBackScrollButton:Ee,disableForwardScrollButton:Ce,shownKeys:ft,uncontrolledActiveKey:ut,uncontrolledIsExpandedLocal:ht,overflowingTabCount:re}=this.state,F=o.Children.toArray(a).filter(E=>o.isValidElement(E)).filter(({props:E})=>!E.isHidden),bt=F.slice(0,F.length-re),vt=F.slice(F.length-re).map(E=>E.props),Te=r||At(),gt=B===te.nav?"nav":"div",ce=c!==void 0?ut:l,de=R!==void 0?ht:O,yt=(E,Q)=>{O===void 0?this.setState({uncontrolledIsExpandedLocal:Q}):oe(E,Q)},Le=Z&&re>0,xt=typeof Z=="object"?Object.assign({},Z):{};return o.createElement(nn,{value:{variant:T,mountOnEnter:x,unmountOnExit:w,localActiveKey:ce,uniqueId:Te,handleTabClick:(...E)=>this.handleTabClick(...E),handleTabClose:dt}},o.createElement(gt,Object.assign({"aria-label":A,className:C(u.tabs,h&&u.modifiers.fill,m&&u.modifiers.secondary,p&&u.modifiers.vertical,p&&f&&_e(f,u),p&&f&&de&&u.modifiers.expanded,b&&u.modifiers.box,pt&&u.modifiers.scrollable,K&&u.modifiers.pageInsets,d&&u.modifiers.noBorderBottom,_e(W,u),mn[T],Le&&u.modifiers.overflow,t)},ne(U.displayName,S!==void 0?S:this.state.ouiaStateId,s),{id:r&&r},mt),f&&p&&o.createElement(Rt,null,E=>o.createElement("div",{className:C(u.tabsToggle)},o.createElement("div",{className:C(u.tabsToggleButton)},o.createElement(N,{onClick:Q=>yt(Q,!de),variant:"plain","aria-label":P,"aria-expanded":de,id:`${E}-button`,"aria-labelledby":`${E}-text ${E}-button`},o.createElement("span",{className:C(u.tabsToggleIcon)},o.createElement(fe,{"arian-hidden":"true"})),I&&o.createElement("span",{className:C(u.tabsToggleText),id:`${E}-text`},I))))),Se&&o.createElement("button",{type:"button",className:C(u.tabsScrollButton,m&&Ae.modifiers.secondary),"aria-label":L||v,onClick:this.scrollBack,disabled:Ee,"aria-hidden":Ee,ref:this.leftScrollButtonRef},o.createElement(Nt,null)),o.createElement("ul",{className:C(u.tabsList),ref:this.tabList,onScroll:this.handleScrollButtons,role:"tablist"},Z?bt:F,Le&&o.createElement(rt,Object.assign({overflowingTabs:vt},xt))),Se&&o.createElement("button",{type:"button",className:C(u.tabsScrollButton,m&&Ae.modifiers.secondary),"aria-label":_||g,onClick:this.scrollForward,disabled:Ce,"aria-hidden":Ce},o.createElement(fe,null)),we!==void 0&&o.createElement("span",{className:C(u.tabsAdd)},o.createElement(N,{variant:"plain","aria-label":le||"Add tab",onClick:we},o.createElement(rn,null)))),F.filter(E=>E.props.children&&!(w&&E.props.eventKey!==ce)&&!(x&&ft.indexOf(E.props.eventKey)===-1)).map(E=>o.createElement(dn,{key:E.props.eventKey,activeKey:ce,child:E,id:E.props.id||Te,ouiaId:E.props.ouiaId})))}}U.displayName="Tabs";U.defaultProps={activeKey:0,onSelect:()=>{},isFilled:!1,isSecondary:!1,isVertical:!1,isBox:!1,hasNoBorderBottom:!1,leftScrollAriaLabel:"Scroll left",backScrollAriaLabel:"Scroll back",rightScrollAriaLabel:"Scroll right",forwardScrollAriaLabel:"Scroll forward",component:te.div,mountOnEnter:!1,unmountOnExit:!1,ouiaSafe:!0,variant:"default",onToggle:(i,e)=>{}};const pn={name:"EditAltIcon",height:1024,width:1024,svgPath:"M1024,187.9 C1024,207 1017.3,223.1 1004,236.4 L857.5,386.9 L638.8,168.4 L787.3,20.5 C800.3,6.83333333 816.5,0 835.9,0 C855,0 871.366667,6.83333333 885,20.5 L1004,138.9 C1017.3,152.9 1023.96667,169.233333 1024,187.9 Z M806.2,438.9 L219.4,1024 L0,1024 L0,804.6 L586.6,219.5 L806.2,438.9 Z M219.6,950.9 L292.9,877.8 L146.3,731.4 L73.2,804.5 L73.2,877.6 L146.3,877.6 L146.3,951 L219.6,950.9 Z",yOffset:0,xOffset:0},Ve=H(pn),fn={name:"Remove2Icon",height:1024,width:896,svgPath:"M576,128 L576,0 L320,0 L320,128 L0,128 L0,320 L64,256 L832,256 L896,320 L896,128 L576,128 Z M512,128 L384,128 L384,64 L512,64 L512,128 Z M64,320 L128,1024 L731.4,1024 L832,320 L64,320 Z",yOffset:0,xOffset:0},je=H(fn),un={name:"ShareAltIcon",height:512,width:448,svgPath:"M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z",yOffset:0,xOffset:0},Fe=H(un),hn={name:"UserCheckIcon",height:512,width:640,svgPath:"M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z",yOffset:0,xOffset:0},bn=H(hn),vn=({resource:i,permissions:e,onClose:t})=>{const{t:a}=X(),l=ae(),{addAlert:c,addError:r}=ie(),h=Ge(),{control:m,reset:p,handleSubmit:b}=h,{fields:d}=qe({control:m,name:"permissions"});Xe(()=>p({permissions:e}),[]);const v=async({permissions:g})=>{try{await Promise.all(g.map(L=>nt(l,i._id,[L]))),c(a("updateSuccess")),t()}catch(L){r("updateError",L)}};return n(ve,{title:a("editTheResource",{name:i.name}),variant:"medium",isOpen:!0,onClose:t,actions:[n(N,{variant:"primary",id:"done",type:"submit",form:"edit-form",children:a("done")},"confirm")],children:n(He,{id:"edit-form",onSubmit:b(v),children:n(Ze,{...h,children:d.map((g,L)=>y(Ot,{children:[n(Mt,{name:`permissions.${L}.username`,label:a("user"),isDisabled:!0}),n(Qe,{id:`permissions-${g.id}`,name:`permissions.${L}.scopes`,label:"permissions",variant:"typeaheadMulti",controller:{defaultValue:[]},options:i.scopes.map(({name:_,displayName:A})=>({key:_,value:A||_}))})]},g.id))})})})},gn=({resource:i,refresh:e})=>{const{t}=X(),a=ae(),{addAlert:l,addError:c}=ie(),[r,h]=$(!1),m=()=>h(!r),p=async(b,d=!1)=>{try{const v=await at({context:a},i._id),{scopes:g,username:L}=v.find(_=>_.username===b.username)||{scopes:[],username:b.username};await it(a,i._id,L,d?[...g,...b.scopes]:g),l(t("shareSuccess")),m(),e()}catch(v){c("shareError",v)}};return y(J,{children:[y(N,{variant:"link",onClick:m,children:[n(Kt,{size:"lg",children:n(bn,{})}),n(Dt,{children:i.shareRequests?.length})]}),n(ve,{title:t("permissionRequest",{name:i.name}),variant:Pt.large,isOpen:r,onClose:m,actions:[n(N,{variant:"link",onClick:m,children:t("close")},"close")],children:y(Je,{"aria-label":t("resources"),children:[n(Ye,{children:y(q,{children:[n(z,{children:t("requestor")}),n(z,{children:t("permissionRequests")}),n(z,{"aria-hidden":"true"})]})}),n(et,{children:i.shareRequests?.map(b=>y(q,{children:[y(D,{children:[b.firstName," ",b.lastName," ",b.lastName?"":b.username,n("br",{}),n($t,{component:"small",children:b.email})]}),n(D,{children:b.scopes.map(d=>n(ge,{isReadOnly:!0,children:d},d.toString()))}),y(D,{children:[n(N,{onClick:()=>{p(b,!0)},children:t("accept")}),n(N,{onClick:()=>{p(b)},className:"pf-v5-u-ml-sm",variant:"danger",children:t("deny")})]})]},b.username))})]})})]})},yn=({count:i,first:e,max:t,onNextClick:a,onPreviousClick:l,onPerPageSelect:c,onFilter:r,hasNext:h})=>{const{t:m}=X(),[p,b]=$(""),d=Math.round(e/t)+1;return n(Wt,{children:y(zt,{children:[n(Re,{children:n(Vt,{placeholder:m("filterByName"),"aria-label":m("filterByName"),value:p,onChange:(v,g)=>{b(g)},onSearch:()=>r(p),onKeyDown:v=>{v.key==="Enter"&&r(p)},onClear:()=>{b(""),r("")}})}),n(Re,{variant:"pagination",children:n(jt,{isCompact:!0,perPageOptions:[{title:"5",value:5},{title:"10",value:10},{title:"20",value:20}],toggleTemplate:({firstIndex:v,lastIndex:g})=>y("b",{children:[v," - ",g]}),itemCount:i+(d-1)*t+(h?1:0),page:d,perPage:t,onNextClick:(v,g)=>a((g-1)*t),onPreviousClick:(v,g)=>l((g-1)*t),onPerPageSelect:(v,g,L)=>c(L-1,g)})})]})})},ct=({permissions:i=[]})=>n("div",{"data-testid":`shared-with-${i.length?i.map(e=>e.username):"none"}`,children:y(tn,{i18nKey:"resourceSharedWith",count:i.length,children:[n("strong",{children:{username:i[0]?i[0].username:void 0}}),n("strong",{children:{other:i.length-1}})]})}),xn=({resource:i,permissions:e,open:t,onClose:a})=>{const{t:l}=X(),c=ae(),{addAlert:r,addError:h}=ie(),m=Ge(),{control:p,register:b,reset:d,formState:{errors:v,isValid:g},setError:L,clearErrors:_,handleSubmit:A}=m,{fields:B,append:S,remove:s}=qe({control:p,name:"usernames"});Xe(()=>{B.length===0&&S({value:""})},[B]);const w=Ft({control:p,name:"usernames",defaultValue:[]}).every(({value:T})=>T.trim().length===0),K=async({usernames:T,permissions:f})=>{try{await Promise.all(T.filter(({value:O})=>O!=="").map(({value:O})=>it(c,i._id,O,f))),r(l("shareSuccess")),a()}catch(O){h("shareError",O)}d({})},W=async()=>{const T=B.map(I=>I.value).filter(I=>I!==""),f=e?.map(I=>[I.username,I.email]).flat(),O=T.length>0,R=T.filter(I=>f?.includes(I)).length!==0;return!O||R?L("usernames",{message:l(O?"resourceAlreadyShared":"required")}):_(),O&&!R};return n(ve,{title:l("shareTheResource",{name:i.name}),variant:"medium",isOpen:t,onClose:a,actions:[n(N,{variant:"primary","data-testid":"done",isDisabled:!g,type:"submit",form:"share-form",children:l("done")},"confirm"),n(N,{variant:"link",onClick:a,children:l("cancel")},"cancel")],children:y(He,{id:"share-form",onSubmit:A(K),children:[y(me,{label:l("shareUser"),type:"string",fieldId:"users",isRequired:!0,children:[y(Ut,{children:[n(Ne,{children:n(Xt,{id:"users","data-testid":"users",placeholder:l("usernamePlaceholder"),validated:v.usernames?Me.error:Me.default,...b(`usernames.${B.length-1}.value`,{validate:W})})}),n(Ne,{children:n(N,{variant:"primary","data-testid":"add",onClick:()=>S({value:""}),isDisabled:w,children:l("add")},"add-user")})]}),B.length>1&&n(tt,{categoryName:l("shareWith"),children:B.map((T,f)=>f!==B.length-1&&n(ge,{onClick:()=>s(f),children:T.value},T.id))}),v.usernames&&n(Gt,{message:v.usernames.message})]}),n(Ze,{...m,children:n(me,{label:"",fieldId:"permissions-selected","data-testid":"permissions",children:n(Qe,{name:"permissions",variant:"typeaheadMulti",controller:{defaultValue:[]},options:i.scopes.map(({name:T,displayName:f})=>({key:T,value:f||T}))})})}),n(me,{children:n(ct,{permissions:e})})]})})},Ue=({isShared:i=!1})=>{const{t:e}=X(),t=ae(),{addAlert:a,addError:l}=ie(),[c,r]=$({first:"0",max:"5"}),[h,m]=$(),[p,b]=$(),[d,v]=$({}),[g,L]=$(1),_=()=>L(g+1);if(qt(async s=>{const x=await en({signal:s,context:t},c,i);return i||await Promise.all(x.data.map(async w=>w.shareRequests=await Ht(w._id,{signal:s,context:t}))),x},({data:s,links:x})=>{b(s),m(x)},[c,g]),!p)return n(Zt,{});const A=async s=>{let x=d[s]?.permissions||[];return d[s]||(x=await at({context:t},s)),x},B=async s=>{try{const x=(await A(s._id)).map(({username:w})=>({username:w,scopes:[]}));await nt(t,s._id,x),v({}),a(e("unShareSuccess"))}catch(x){l("unShareError",x)}},S=async(s,x,w)=>{const K=await A(s);v({...d,[s]:{...d[s],[x]:w,permissions:K}})};return y(J,{children:[n(yn,{onFilter:s=>r({...c,name:s}),count:p.length,first:parseInt(c.first),max:parseInt(c.max),onNextClick:()=>r(h?.next||{}),onPreviousClick:()=>r(h?.prev||{}),onPerPageSelect:(s,x)=>r({first:`${s}`,max:`${x}`}),hasNext:!!h?.next}),y(Je,{"aria-label":e("resources"),children:[n(Ye,{children:y(q,{children:[n(z,{"aria-hidden":"true"}),n(z,{children:e("resourceName")}),n(z,{children:e("application")}),n(z,{"aria-hidden":i,children:i?"":e("permissionRequests")})]})}),p.map((s,x)=>y(et,{isExpanded:d[s._id]?.rowOpen,children:[y(q,{children:[n(D,{"data-testid":`expand-${s.name}`,expand:i?void 0:{isExpanded:d[s._id]?.rowOpen||!1,rowIndex:x,onToggle:()=>S(s._id,"rowOpen",!d[s._id]?.rowOpen)}}),n(D,{dataLabel:e("resourceName"),"data-testid":`row[${x}].name`,children:s.name}),n(D,{dataLabel:e("application"),children:y("a",{href:s.client.baseUrl,children:[s.client.name||s.client.clientId," ",n(Qt,{})]})}),y(D,{dataLabel:e("permissionRequests"),children:[s.shareRequests&&s.shareRequests.length>0&&n(gn,{resource:s,refresh:()=>_()}),n(xn,{resource:s,permissions:d[s._id]?.permissions,open:d[s._id]?.shareDialogOpen||!1,onClose:()=>v({})}),d[s._id]?.editDialogOpen&&n(vn,{resource:s,permissions:d[s._id]?.permissions,onClose:()=>v({})})]}),i?n(D,{children:s.scopes.length>0&&n(tt,{categoryName:e("permissions"),children:s.scopes.map(w=>n(ge,{isReadOnly:!0,children:w.displayName||w.name},w.name))})}):n(D,{isActionCell:!0,children:y(ye,{breakpoint:"lg",children:[n(lt,{children:y(ot,{groupType:"button",children:[n(ue,{children:y(N,{"data-testid":`share-${s.name}`,variant:"link",onClick:()=>S(s._id,"shareDialogOpen",!0),children:[n(Fe,{})," ",e("share")]})}),n(ue,{children:n(Ke,{popperProps:{position:"right"},onOpenChange:w=>S(s._id,"contextOpen",w),toggle:w=>n(De,{variant:"plain",ref:w,onClick:()=>S(s._id,"contextOpen",!d[s._id]?.contextOpen),isExpanded:d[s._id]?.contextOpen,children:n(Pe,{})}),isOpen:!!d[s._id]?.contextOpen,children:y($e,{children:[y(pe,{isDisabled:d[s._id]?.permissions?.length===0,onClick:()=>S(s._id,"editDialogOpen",!0),children:[n(Ve,{})," ",e("edit")]}),n(We,{buttonTitle:y(J,{children:[n(je,{})," ",e("unShare")]}),modalTitle:e("unShare"),continueLabel:e("confirm"),cancelLabel:e("cancel"),component:pe,onContinue:()=>B(s),isDisabled:d[s._id]?.permissions?.length===0,children:e("unShareAllConfirm")})]})})})]})}),n(st,{children:n(Ke,{popperProps:{position:"right"},onOpenChange:w=>S(s._id,"contextOpen",w),toggle:w=>n(De,{variant:"plain",ref:w,isExpanded:d[s._id]?.contextOpen,onClick:()=>S(s._id,"contextOpen",!d[s._id]?.contextOpen),children:n(Pe,{})}),isOpen:!!d[s._id]?.contextOpen,children:y($e,{children:[y(Y,{isShared:!0,onClick:()=>S(s._id,"shareDialogOpen",!0),children:[n(Fe,{})," ",e("share")]},"share"),y(Y,{isShared:!0,onClick:()=>S(s._id,"editDialogOpen",!0),isDisabled:d[s._id]?.permissions?.length===0,children:[n(Ve,{})," ",e("edit")]},"edit"),n(We,{buttonTitle:y(J,{children:[n(je,{})," ",e("unShare")]}),modalTitle:e("unShare"),continueLabel:e("confirm"),cancelLabel:e("cancel"),component:Y,onContinue:()=>B(s),isDisabled:d[s._id]?.permissions?.length===0,children:e("unShareAllConfirm")},"unShare")]})})})]})})]}),n(q,{isExpanded:d[s._id]?.rowOpen||!1,children:n(D,{colSpan:4,textCenter:!0,children:n(Jt,{children:n(ct,{permissions:d[s._id]?.permissions})})})})]},s.name))]})]})},kn=()=>{const{t:i}=X(),[e,t]=$(0);return n(Yt,{title:i("resources"),description:i("resourceIntroMessage"),children:y(U,{activeKey:e,onSelect:(a,l)=>t(l),mountOnEnter:!0,unmountOnExit:!0,children:[n(he,{"data-testid":"myResources",eventKey:0,title:n(ee,{children:i("myResources")}),children:n(Ue,{})}),n(he,{"data-testid":"sharedWithMe",eventKey:1,title:n(ee,{children:i("sharedWithMe")}),children:n(Ue,{isShared:!0})})]})})};export{kn as Resources,kn as default};
//# sourceMappingURL=Resources-Bbq1yyzl.js.map
