"use strict";(self.webpackChunkliga_bet=self.webpackChunkliga_bet||[]).push([[390],{45809:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,"@media(max-width: 450px){.LB-MultiBetExplanationDialog .MuiDialog-paper{margin:12px}}.LB-MultiBetExplanationDialog .closeButton{position:absolute;left:8px;top:8px}.LB-MultiBetExplanationDialog .LB-EditableBetView{width:330px;max-width:100%;height:40px;border-radius:12px 12px 0px 0px;margin:auto;overflow:hidden}.LB-MultiBetExplanationDialog .LB-EditableBetView .EditableBetView-header{height:100%}.LB-MultiBetExplanationDialog .LB-EditableBetView .EditableBetView-header .forAllTournamentsInput{border:1px solid red;border-radius:100%}.LB-MultiBetExplanationDialog .buttonContainer{display:flex;align-items:center;justify-content:center}",""]);const o=l},17301:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,"@media(max-width: 450px){.LB-WaitForMvpDialog .MuiDialog-paper{margin:12px}}.LB-WaitForMvpDialog .closeButton{position:absolute;left:8px;top:8px}.LB-WaitForMvpDialog .buttonContainer{margin-top:40px;display:flex;align-items:center;justify-content:center}",""]);const o=l},73884:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,".LigaBet-SetPasswordDialog .close_button{position:absolute;left:8px;top:8px}.LigaBet-SetPasswordDialog .dialog_content{margin-top:16px;display:flex;flex-direction:column}.LigaBet-SetPasswordDialog .dialog_content .LigaBet-PasswordField{margin-bottom:12px}.LigaBet-SetPasswordDialog .dialog_content .LigaBet-LoadingButton{margin:20px auto 0px}",""]);const o=l},37954:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,".LB-MultiBetsSettings .MultiBetsSettings-content{display:flex;align-items:center;justify-content:space-between}.LB-MultiBetsSettings .MultiBetsSettings-content>p{font-size:16px;margin:8px 0px}.LB-MultiBetsSettings .MultiBetsSettings-content .MultiBetsSettings-infoIcon.infoIconClickable{cursor:pointer}.LB-MultiBetsSettings .MultiBetsSettings-isMultiBet{display:flex;align-items:center;justify-content:flex-end}",""]);const o=l},95801:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,".LigaBet-PasswordField{padding-top:8px}.LigaBet-PasswordField .MuiTextField-root{padding-bottom:24px}.LigaBet-PasswordField .MuiFormHelperText-root{position:absolute;bottom:0px}",""]);const o=l},53507:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(23645),l=n.n(a)()((function(e){return e[1]}));l.push([e.id,".LB-StickyConfig.StickyConfig-pinned{position:sticky;top:70px;z-index:10}.LB-StickyConfig .StickyConfig-content{border-radius:12px;border:1px dashed #1976d2;background-color:rgba(186,219,245,.95);margin:auto;width:332px;max-width:100%;padding:6px}.LB-StickyConfig .StickyConfig-headerWrapper{display:flex;align-items:center;width:100%}.LB-StickyConfig .StickyConfig-headerWrapper .StickyConfig-header{flex:1 auto}.LB-StickyConfig .StickyConfig-form{display:block}",""]);const o=l},66464:(e,t,n)=>{n.d(t,{Au:()=>i,U1:()=>o,_8:()=>r,sh:()=>l});var a=n(2487);function l(e){return async(t,n)=>{e?localStorage.setItem("ligaBetIsMultipleBetsOn","1"):localStorage.removeItem("ligaBetIsMultipleBetsOn"),t(a.Z.actions.update({forAllTournaments:e}))}}function o(){return async(e,t)=>{e(a.Z.actions.updateExplanationDialog({seen:!0}))}}function i(){return async(e,t)=>{e(a.Z.actions.updateExplanationDialog({initialized:!0}))}}function r(e){return async(t,n)=>{e?localStorage.setItem("ligaBetDontShowMultiBetExplanation","1"):localStorage.removeItem("ligaBetDontShowMultiBetExplanation"),t(a.Z.actions.updateExplanationDialog({dontShowAgain:e}))}}},74390:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Q});var a=n(67294),l=n(86706),o=n(97789),i=n(71840),r=n(67759),s=n(84196),c=n(16550),d=n(87536),u=n(2305),m=n(58653),p=n(24498),g=n(77745),E=n(50130),f=n(50594),B=n(8451),h=n(19316),w=n(3646),x=n(22961),S=n(72450),Z=n(96486),C=n(93379),v=n.n(C),b=n(95801);function k({label:e,error:t,InputProps:n,clearErrors:l,...o}){const[i,r]=(0,a.useState)(!1),s=`password_input_${(0,Z.startCase)(e)}`;return a.createElement(a.Fragment,null,a.createElement("div",{className:"LigaBet-PasswordField"},a.createElement(w.Z,{error:!!t,variant:"outlined",id:s,helperText:t,type:i?"text":"password",InputProps:{endAdornment:a.createElement(h.Z,{position:"end"},a.createElement(E.Z,{onClick:()=>{r(!i)},edge:"end"},i?a.createElement(S.Z,null):a.createElement(x.Z,null))),onFocus:()=>l&&l(),...n},label:e,...o})))}v()(b.Z,{insert:"head",singleton:!1}),b.Z.locals;var y=n(19501);const L=y.Z_().min(4,"סיסמה חייבת להכיל לפחות 4 תווים").required("חובה למלא שדה זה"),M=y.Ry({password:L,confirmPassword:y.Z_().required("חובה למלא שדה זה").oneOf([y.iH("password")],"הסיסמה לא תואמת את הסיסמה למעלה")});var D=n(73884);function P({open:e,onClose:t,setPassword:n}){const{handleSubmit:l,register:o,formState:i,clearErrors:r,reset:s}=(0,d.cI)({resolver:(0,u.X)(M),reValidateMode:"onSubmit",shouldFocusError:!1}),{errors:c,isSubmitting:h}=i,w=()=>{s({password:"",confirmPassword:""}),t()};return a.createElement(m.Z,{open:e,onClose:w},a.createElement("div",{className:"LigaBet-SetPasswordDialog"},a.createElement(g.Z,null,a.createElement(E.Z,{onClick:w,className:"close_button"},a.createElement(f.Z,null)),"עדכן סיסמה"),a.createElement(p.Z,null,a.createElement("div",{className:"dialog_content"},a.createElement(k,{label:"סיסמה חדשה",error:c.password?.message,InputProps:{...o("password")},clearErrors:()=>r("password")}),a.createElement(k,{label:"ודא סיסמה",error:c.confirmPassword?.message,InputProps:{...o("confirmPassword")},clearErrors:()=>r("confirmPassword")}),a.createElement(B.Z,{onClick:l((async({password:e,confirmPassword:t})=>{await n({new_password:e,new_password_confirmation:t}).then((()=>{window.toastr.success("סיסמתך עודכנה בהצלחה"),w()}))})),loading:h},"עדכן סיסמה")))))}v()(D.Z,{insert:"head",singleton:!1}),D.Z.locals;const N={closeDialog:i.g,openDialog:i.G},I=(0,l.$j)(r.oaC,N)((function({closeDialog:e,openDialog:t}){const n=(0,c.TH)(),i=(0,c.k6)(),d=new URLSearchParams(n.search).has("reset-password"),u=(0,l.v9)(r.qYe);return(0,a.useEffect)((()=>{d&&(t(o.W.ChangePassword),i.push("/"))}),[d]),a.createElement(P,{open:u,onClose:()=>e(o.W.ChangePassword),setPassword:s.gQ})}));var A=n(26569),F=n(18037),_=n(49960),T=n(95305),W=n(65342),V=n(24419);function $({open:e,onClose:t,onDontShowAgain:n,isAutoShown:l}){const[o,i]=(0,a.useState)(!1),r=(0,W.C)(),s=()=>{t(),o&&n()};return a.createElement(m.Z,{classes:{root:"LB-MultiBetExplanationDialog"},open:e,onClose:s},a.createElement("div",null,a.createElement(g.Z,null,a.createElement(E.Z,{onClick:s,className:"closeButton"},a.createElement(f.Z,null)),"שליחת ניחוש לכל הטורנירים שלך"),a.createElement(p.Z,{className:"dialogContent"},a.createElement("h5",null,"ניתן לשלוח ניחוש מסוים לכל הטורנירים בהם אתה משתתף"),a.createElement("h5",{style:{marginTop:-6}},"בעזרת המתג מצד שמאל למעלה שמופיע בזמן עריכת הניחוש:"),a.createElement("div",{className:`LB-EditableBetView ${r} sendingforAllTournaments`},a.createElement("div",{className:"EditableBetView-header"},a.createElement(A.Z,{className:"forAllTournamentsInput",checked:!0}))),a.createElement("h5",null,"כשהמתג ",a.createElement("span",null,a.createElement("b",null,"דלוק")),' הרקע של הכותרת יהיה סגול ובלחיצה על "שלח" הניחוש יישלח ',a.createElement("span",null,a.createElement("b",null,"לכל הטורנירים"))),a.createElement("div",{className:`LB-EditableBetView ${r}`},a.createElement("div",{className:"EditableBetView-header"},a.createElement(A.Z,{className:"forAllTournamentsInput",checked:!1}))),a.createElement("h5",null,"כשהמתג ",a.createElement("span",null,a.createElement("b",null,"כבוי")),' הרקע של הכותרת יהיה בצבע של הטורניר הנוכחי ובלחיצה על "שלח" הניחוש יישלח רק ',a.createElement("span",null,a.createElement("b",null,"לטורניר הנוכחי"))),a.createElement("h5",{style:{marginTop:32}},"אפשר להגדיר ברירת מחדל למצב ההתחלתי של המתג:"),a.createElement("div",{style:{marginBottom:12}},a.createElement(V.Z,{pinned:!0,setPinned:()=>null,forAllTournaments:!0,setForAllTournaments:()=>null})),l&&a.createElement(a.Fragment,null,a.createElement(F.Z,{control:a.createElement(_.Z,{size:"medium",checked:o,onChange:(e,t)=>i(t)}),label:"הבנתי, אל תציג שוב"}),a.createElement("div",{className:"buttonContainer"},a.createElement(T.Z,{variant:"contained",color:"primary",onClick:s},"אוקיי"))))))}var j=n(66464),z=n(45809);v()(z.Z,{insert:"head",singleton:!1}),z.Z.locals;const q={closeDialog:i.g,openDialog:i.G,updateDontShowAgain:j._8,markAsSeen:j.U1},H=(0,l.$j)(r.oaC,q)((function({openDialog:e,closeDialog:t,updateDontShowAgain:n,markAsSeen:i}){const s=(0,l.v9)(r.pLE),c=(0,l.v9)(r.DEL);return(0,a.useEffect)((()=>{s&&e(o.W.MultiBetExplanation)}),[s]),a.createElement($,{open:c,onClose:()=>{t(o.W.MultiBetExplanation),i()},onDontShowAgain:()=>n(!0),isAutoShown:s})}));function O({open:e,onClose:t,onConfirm:n}){return a.createElement(m.Z,{classes:{root:"LB-WaitForMvpDialog"},open:e,onClose:t},a.createElement("div",null,a.createElement(g.Z,null,a.createElement(E.Z,{onClick:t,className:"closeButton"},a.createElement(f.Z,null)),"רגע, זה עדיין לא נגמר..."),a.createElement(p.Z,{className:"dialogContent"},a.createElement("h5",null,"עדיין לא הוכרז מצטיין הטורניר, ולכן הניקוד שמוצג הוא עדיין לא הניקוד הסופי."),a.createElement("h5",null,"לאחר ההכרזה על מצטיין הטורניר (mvp), הניקוד יתעדכן ותוצג הטבלה הסופית."),a.createElement("div",{className:"buttonContainer"},a.createElement(T.Z,{variant:"contained",color:"primary",onClick:n},"אוקיי, הבנתי")))))}var U=n(17301);v()(U.Z,{insert:"head",singleton:!1}),U.Z.locals;const G={closeDialog:i.g},R=(0,l.$j)(r.oaC,G)((function({closeDialog:e}){const t=localStorage.getItem("ligaBetSeenWaitForMvpMsg"),n=(0,l.v9)(r.b8$),i=()=>{e(o.W.WaitForMvp)};return a.createElement(O,{open:n&&!t,onClose:i,onConfirm:()=>{localStorage.setItem("ligaBetSeenWaitForMvpMsg","1"),i()}})}));function Q(){return a.createElement(a.Fragment,null,a.createElement(I,null),a.createElement(H,null),a.createElement(R,null))}},24419:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(67294),l=n(26569),o=n(2548),i=n(77164),r=n(93379),s=n.n(r),c=n(37954);s()(c.Z,{insert:"head",singleton:!1}),c.Z.locals;const d=function({forAllTournaments:e,setForAllTournaments:t,pinned:n,setPinned:r,onInfoClick:s}){return a.createElement(i.Z,{pinned:n,setPinned:r,className:"LB-MultiBetsSettings",header:a.createElement("div",{className:"MultiBetsSettings-content"},a.createElement("p",null,"ערוך לכל הטורנירים שלי"),a.createElement("div",{className:"MultiBetsSettings-isMultiBet"},a.createElement(o.Z,{className:"MultiBetsSettings-infoIcon "+(s?"infoIconClickable":""),color:"primary",onClick:s}),a.createElement(l.Z,{color:"secondary",className:"forAllTournamentsInput",checked:e,onChange:(e,n)=>t(n)})))})}},77164:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(67294),l=n(50130),o=n(24238),i=n(13360),r=n(93379),s=n.n(r),c=n(53507);s()(c.Z,{insert:"head",singleton:!1}),c.Z.locals;const d=function({pinned:e,setPinned:t,children:n,header:r,className:s}){const c=e?"StickyConfig-pinned":"";return a.createElement("div",{className:`LB-StickyConfig ${s??""} ${c}`},a.createElement("div",{className:"StickyConfig-content"},a.createElement("div",{className:"StickyConfig-headerWrapper"},a.createElement(l.Z,{className:"StickyConfig-pinIcon",onClick:()=>t(!e)},e?a.createElement(o.Z,null):a.createElement(i.Z,null)),a.createElement("div",{className:"StickyConfig-header"},r)),a.createElement("div",{className:"StickyConfig-form"},n)))}}}]);