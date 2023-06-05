"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[330],{969:(t,e,s)=>{s.r(e),s.d(e,{default:()=>o});const n=s.p+"e121201de7736b84a3aa.png";var a=s(988),i=s(211),l=s(820),r=s(240);class o extends l.Z{static#t="Сравнение парных выборок";static#e=n;static#s=null;static testText={student:"Парный тест Стьюдента",wilcoxon:"Тест Уилкоксона",sign:"Тест знаков"};static altHypText={both:"Двусторонняя проверка альтернативной гипотезы (M2 ≠ M1)",right:"Правосторонняя проверка альтернативной гипотезы (M2 &#62; M1)",left:"Левосторонняя проверка альтернативной гипотезы (M2 &#60; M1)"};#n;#a={first:void 0,second:void 0};#i;#l={z:void 0,sign:{p0:void 0,p1:void 0,p2:void 0},wilcoxon:{v:void 0},student:{d:void 0,sd:void 0}};#r;#o;#h;#u={first:void 0,second:void 0};#d;#c;#p;#m=[];#b=[];#g={pair:void 0};#v;#_;#f;constructor(t,e=null){super(),this.#n=t,e&&this.#y(e)}static setModuleTypeId(t){o.#s=t}static getModuleTypeId(){return o.#s}static getName(){return o.#t}static getImage(){return o.#e}deleteSelf(){uiControls.parametersContainer.removeChild(this.#c),uiControls.resultsContainer.removeChild(this.#_)}#y(t){const e=t.getAllData();this.#a=e.data,this.#i=e.power,this.#l=e.resultsTableData,this.#r=e.testType,this.#o=e.inputType,this.#h=e.altHypTest,this.#u=e.vars,this.#d=e.hypName;const s=e.element.cloneNode(!0),n=document.createElement("div");n.classList.add("results__block"),this.#T(s,n);const a=this.#c.querySelector("#module-option-form_"+e.id);a.setAttribute("id","module-option-form_"+this.#n),a.dataset.id=this.#n,[...this.#c.querySelectorAll(".form-change-trigger_"+e.id)].forEach((t=>{t.classList.replace("form-change-trigger_"+e.id,"form-change-trigger_"+this.#n),t.setAttribute("form","module-option-form_"+this.#n)})),uiControls.parametersContainer.insertBefore(this.#c,e.element.nextElementSibling),uiControls.resultsContainer.insertBefore(this.#_,e.resultBlock.nextElementSibling)}getAllData(t){const e={};return e.hypName=this.#d,e.inputType=this.#o,e.testType=this.#r,e.altHypTest=this.#h,e.resultsTableData=Object.deepCopy(this.#l),t?(e.moduleTypeId=o.#s,e.varIds=[this.#u.first?.getID(),this.#u.second?.getID()],e):(e.element=this.#c,e.resultBlock=this.#_,e.vars=Object.assign({},this.#u),e.power=this.#i,e.data=Object.assign({},this.#a),e.id=this.#n,e)}setId(t){const e=this.#n,s=this.#c.querySelector("#module-option-form_"+e);s.setAttribute("id","module-option-form_"+t),s.dataset.id=t,[...this.#c.querySelectorAll(".form-change-trigger_"+e)].forEach((s=>{s.classList.replace("form-change-trigger_"+e,"form-change-trigger_"+t),s.setAttribute("form","module-option-form_"+t)})),this.#n=t}setLoadingData(t,e,s,n,a){const i=(t,e)=>{[...this.#c.querySelector(".option-block__"+t).querySelectorAll("input")].forEach((t=>{t.value==e&&t.click()}))},l=(t,e)=>{const s=this.#c.querySelector(".option-block__"+t);e.forEach((t=>{const e=`input[name='${t[0]}']`,n=s.querySelector(e);n&&null!==t[1]&&void 0!==t[1]&&(n.value=t[1])}))};this.#o=t,this.#r=e,this.#h=s,this.#l=n,i("input-type",t),i("test-type",e),i("hyp-check",s);for(let t in this.#l)"z"!==t&&l(t,Object.entries(this.#l[t]));if("manual"===this.#o||!a[0]&&!a[1])return;const r=a[0].split("_"),o=a[1].split("_"),h=(t,e,s,n,a)=>{this.displayVarsOfSheet(t,e);s.querySelector(".var-table__item_"+n).click(),a.click()};h(r[1],"two-column-var",this.#v,a[0],this.#f),h(o[1],"two-column-var",this.#v,a[1],this.#f)}setName(t){this.#d=t,this.#c.querySelector(".parameters__title").textContent=t,this.#_.querySelector(".results__header").textContent=t}getName(){return this.#d}getElement(){return this.#c}getResultElement(){return this.#_}getFormSheets(){return this.#m}getSheetSelects(){return this.#b}setSheetOptions(t){let e="";for(let s of t){e+=`<option class='select-option-${s.id}' value="${s.id}">${s.name}</option>`}for(let t of this.#b)t.innerHTML=e}addSheetOptions(t){const e=[];for(let s of t)if(!this.#b[0].querySelector(`.select-option-${s.id}`)){const t=document.createElement("option");t.classList.add(`select-option-${s.id}`),t.value=s.id,t.textContent=s.name,e.push(t)}this.#b.forEach((t=>{const s=e.map((t=>t.cloneNode(!0)));t.append(...s)}))}addListeners(t){const e=this.#v,s=e.querySelector(".switch-button"),n=e.querySelector(".two-column-var__table-body"),i=e.querySelector(".target-table-data");this.#f=s;const l=()=>{2===i.children.length&&a.Z.setSettings(this.#n)};s.addEventListener("click",function(t,e,s,n){const a=t.querySelector("input:checked")||e.querySelector("input:checked");if(!a)return;const i=a.parentElement,r=i.parentElement;if(r.isSameNode(e))r.removeChild(i),((t,e)=>{const s=e.querySelector(".var-table__anchor_"+t.dataset.varId);s&&e.insertBefore(t,s)})(i,t),n.classList.replace("switch-button_left","switch-button_right");else{if(e.children.length===s)return;r.removeChild(i),e.appendChild(i),n.classList.replace("switch-button_right","switch-button_left")}l()}.bind(this,n,i,2,s))}displayVarsOfSheet(t,e){const s=i.Z.getVarsBySheetId(t);if(!s)return;let n,a=[];if("two-column-var"===e){n=this.#c.querySelector(".two-column-var__table-body");const t=this.#g.pair;a.push(t.firstElementChild?.dataset.varId),a.push(t.lastElementChild?.dataset.varId),n.innerHTML=function(){let t="";return s.forEach((e=>{const s=e.getID();let n=`\n                <label title="${e.getName()}" class="var-table__item var-table__item_${s}" data-var-id=${s}>\n                    <input type="radio" name="data_value">\n                    <img src=${e.getImg()} alt="${e.getTypeName()}" class="var-table__img">\n                    <span>${e.getName()}</span>\n                </label>`;a.includes(s)||(t+=n),t+=`<div class='var-table__anchor var-table__anchor_${s}'></div>`})),t}();const e=t=>{const e=this.#g.pair.firstElementChild,s=this.#g.pair.lastElementChild;e?.dataset.varId!==t.dataset.varId&&s?.dataset.varId!==t.dataset.varId?this.#f.classList.replace("switch-button_left","switch-button_right"):this.#f.classList.replace("switch-button_right","switch-button_left")};[...n.querySelectorAll(".var-table__item")].forEach((t=>t.querySelector("input").addEventListener("change",e.bind(this,t))))}}updateSelectedVarsVisual(t){(e=>{e.forEach((e=>{if(e){const s=e.dataset.varId.split("_");if(s[1]==t){const t=i.Z.getVarBySheetIdAndVarId(s[1],s[2]);if(!t)return void this.#g.pair.removeChild(e);const n=e.querySelector("img");e.querySelector("span").innerHTML=t.getName(),n.setAttribute("src",t.getImg()),n.setAttribute("alt",t.getTypeName())}}}))})([...this.#g.pair.querySelectorAll("label")])}clearSelectedVars(){this.#g.pair.innerHTML=""}createHTML(){const t="Гипотеза "+(this.#n+1),e=uiControls.parametersContainer,s=uiControls.resultsContainer,n=document.createElement("div"),a=document.createElement("div");n.classList.add("parameters__item","collapsible"),a.classList.add("results__block");const i=`\n        <label class="collapsible__head">\n            <input class="collapsible__input" type="checkbox" checked>\n            <div class="parameters__head">\n                <div class="parameters__title-container">\n                    <div class="collapsible__symbol collapsible__symbol_checked"></div>\n                    <h2 class="parameters__title">${t}</h2>\n                    <input class="parameters__title-input hidden" type='text'>\n                </div>\n                <div class="parameters__extra-container">\n                    <button title="Изменить название гипотезы"\n                        class="extra extra_edit-button main-button"></button>\n                    <label title="Убрать гипотезу из вычислений"\n                        class="extra extra_hide-button main-button">\n                        <input type="checkbox">\n                    </label>\n                    <button title="Дублировать гипотезу"\n                        class="extra extra_duplicate-button main-button"></button>\n                    <button title="Удалить гипотезу"\n                        class="extra extra_delete-button main-button"></button>\n                </div>\n            </div>\n        </label>\n        <div class="collapsible__content collapsible__content_checked">\n            <div class="parameters__content">\n            <form id="module-option-form_${this.#n}" class="module-option-form" data-id=${this.#n}></form>\n                <div class="option-block">\n                    <p>Метод проверки: Сравнение парных выборок</p>\n                    <div class="option-block__sub">\n                        Тип ввода\n                        <div class="option-block__list option-block__input-type">\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#n} data-input-two" type="radio" name="input-type" value="data-input-two" form="module-option-form_${this.#n}"\n                                    checked>\n                                <span>Вычисление по данным (два столбца)</span>\n                            </label>\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#n} manual-input-on" type="radio" name="input-type" value="manual" form="module-option-form_${this.#n}">\n                                <span>Ввести величину эффекта</span>\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__two-column">\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Тест\n                                <div class="option-block__list option-block__test-type">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="test-type"\n                                            value="sign" form="module-option-form_${this.#n}" checked>\n                                        <span>Тест знаков</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="test-type"\n                                            value="wilcoxon" form="module-option-form_${this.#n}">\n                                        <span>Уилкоксона</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="test-type"\n                                            value="student" form="module-option-form_${this.#n}">\n                                        <span>Стьюдента</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Проверка альтернативной гипотезы\n                                <div class="option-block__list option-block__hyp-check">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="hyp-check"\n                                            value="both" form="module-option-form_${this.#n}" checked>\n                                        <span>Двусторонняя (M1 ≠ M2)</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="hyp-check"\n                                            value="right" form="module-option-form_${this.#n}">\n                                        <span>Правосторонняя (M2 &#62; M1)</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio" name="hyp-check"\n                                            value="left" form="module-option-form_${this.#n}">\n                                        <span>Левосторонняя (M2 &#60; M1)</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class="option-block__sub option-block__manual-input option-block__student option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Средняя разность ( d&#772; ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="d" value="1" step="0.1" min="0" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Стандартное отклонение разностей ( s<sub>d</sub> ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="sd" value="1" step="0.1" min="0" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__wilcoxon option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Величина эффекта ( v ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="v" value="0.01" step="0.01" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__sign option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Доля нулевых разностей ( &#961;<sub>&#965;</sub> ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="p0" value="0" step="0.01" min="0" max="1" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Доля положительных разностей ( &#961;<sub>1</sub> ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n\n\n                    <div class="option-block__tables two-column-var">\n                        <div class="var-table">\n                            <div class="var-table__header">\n                                <form class="sheet-form" data-type="two-column-var">\n                                    <div class="main-select">\n                                       <select class="main-input two-column-var__sheet-select sheet-select" name="sheet-select"></select>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class="var-table__body two-column-var__table-body"></div>\n                        </div>\n                        <div class="two-column-var__switch-container">\n                            <div class="switch-button switch-button_right">\n                                <div class="switch-button__symbol"></div>\n                            </div>\n                        </div>\n                        <div class="var-table">\n                            <div class="var-table__header">Парные переменные</div>\n                            <div class="var-table__body two-column-var__table-body">\n                                <div class="two-column-var__item target-table-data">\n                                </div>\n                                <div class="two-column-var__delimiter"></div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>`;n.innerHTML=i,this.#T(n,a),this.#d=t,e.appendChild(n),s.appendChild(a)}#T(t,e){this.#c=t,this.#p=t.querySelector(".module-option-form"),this.#m=[...t.querySelectorAll(".sheet-form")],this.#b=[...t.querySelectorAll(".sheet-select")],this.#g.pair=t.querySelector(".target-table-data"),this.#v=t.querySelector(".two-column-var"),this.#_=e}setSettings(){const t=new FormData(this.#p);switch(this.#r=t.get("test-type"),this.#h=t.get("hyp-check"),this.#o=t.get("input-type"),this.#r){case"student":"manual"===this.#o?(this.#l.student.d=Number(t.get("d")),this.#l.student.sd=Number(t.get("sd"))):(this.#l.student.d=null,this.#l.student.sd=null);break;case"wilcoxon":"manual"===this.#o?this.#l.wilcoxon.v=Number(t.get("v")):this.#l.wilcoxon.v=null;break;case"sign":"manual"===this.#o?(this.#l.sign.p0=Number(t.get("p0")),this.#l.sign.p1=Number(t.get("p1"))):(this.#l.sign.p0=null,this.#l.sign.p1=null),this.#l.sign.p2=null}this.#l.z=null;const e=[];this.#a.first=null,this.#a.second=null;const s=[];if(this.#u.first=null,this.#u.second=null,"manual"!==this.#o){const t=this.#g;let n,a;"data-input-two"===this.#o&&(n=[...t.pair.children],a=2===n.length),a&&(n.forEach((t=>{const n=t.dataset.varId.split("_");e.push(i.Z.getDataBySheetAndVarId(n[1],n[2])),s.push(i.Z.getVarBySheetIdAndVarId(n[1],n[2]))})),this.#a.first=e[0],this.#a.second=e[1],this.#u.first=s[0],this.#u.second=s[1])}}getN(t,e){return!t||Number.isNaN(t)||"number"!=typeof t?null:e&&!Number.isNaN(e)&&"number"==typeof e?this.#w(!1,t,e):void 0}setStatPower(t,e){if(!t||Number.isNaN(t)||"number"!=typeof t)return null;e&&!Number.isNaN(e)&&"number"==typeof e&&(this.#i=this.#w(!0,t,e))}#w(t,e,s){let n,a,i,l,o=[],h=[];if("manual"!==this.#o){if(!this.#a.first||!this.#a.second)return;if(n=this.#u.first.getTypeName(),a=this.#u.second.getTypeName(),"data-input-two"===this.#o){if(i=this.#g.pair,n!==a)return void uiControls.showError(i,"Нельзя сравнить данные разного типа");const t=Math.min(this.#a.first.length,this.#a.second.length);for(let e=0;e<t;e++){const t=this.#a.first[e],s=this.#a.second[e];""!==t&&""!==s&&(o.push(t),h.push(s))}}if(0===o.length||0===h.length)return void uiControls.showError(i,"Присутствует пустая выборка, невозможно провести вычисления")}else i=this.#c;try{switch(this.#r){case"student":if("manual"!==this.#o&&n!==r.Z.Continues.name)throw new Error(u([r.Z.Continues.ruName]));l=t?this.#k(e,s,o,h):this.#D(e,s,o,h);break;case"wilcoxon":if("manual"!==this.#o&&n!==r.Z.Continues.name&&n!==r.Z.Rang.name)throw new Error(u([r.Z.Continues.ruName,r.Z.Rang.name]));if("manual"!==this.#o&&n===r.Z.Rang.name&&!this.#u.first.isUnitedWith(this.#u.second))throw new Error("Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца");l=t?this.#N(e,s,o,h):this.#$(e,s,o,h);break;case"sign":if("manual"!==this.#o&&n===r.Z.Nominal.name)throw new Error(u([r.Z.Continues.ruName,r.Z.Rang.ruName,r.Z.Binary.ruName]));if("manual"!==this.#o&&n===r.Z.Rang.name&&!this.#u.first.isUnitedWith(this.#u.second))throw new Error("Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца");l=t?this.#S(e,s,o,h):this.#E(e,s,o,h)}}catch(t){return void uiControls.showError(i,t.message)}return l;function u(t){return`Выбранный тест поддерживает следующий тип данных: ${t.join(", ")}`}}#E(t,e,s,n){let a,i,l;const r=Math.getZAlpha(this.#h,t),o=Math.getZ(r,e);if("manual"===this.#o)a=this.#l.sign.p0,i=this.#l.sign.p1;else{const t=this.#u.first,e="data-input-two"===this.#o?this.#u.second:t,l=this.#M(t.getTypeName(),s,n,t,e),r=l[1]+l[2];a=l[0]/s.length,i=l[1]/r,this.#l.sign.p0=a,this.#l.sign.p1=i}l=1-i,this.#l.z=o,this.#l.sign.p2=l;const h=o**2/(4*(1-a)*(i-.5)**2);if(void 0===h||"number"!=typeof h)throw new Error("Ошибка расчета данных");return h}#S(t,e,s,n){let a,i,l;const r=Math.getZAlpha(this.#h,t);if("manual"===this.#o)a=this.#l.sign.p0,i=this.#l.sign.p1;else{const t=this.#u.first,e="data-input-two"===this.#o?this.#u.second:t,l=this.#M(t.getTypeName(),s,n,t,e),r=l[1]+l[2];a=l[0]/s.length,i=l[1]/r,this.#l.sign.p0=a,this.#l.sign.p1=i}l=1-i,this.#l.sign.p2=l;let o=Math.sqrt(4*e*(i-.5)**2*(1-a));o>0&&(o*=-1),this.#l.z=o;const h=o-r,u=100-Math.normdist(h);if(void 0===u||"number"!=typeof u)throw new Error("Ошибка расчета данных");return u}#$(t,e,s,n){let a;const i=Math.getZAlpha(this.#h,t),l=Math.getZ(i,e);if("manual"===this.#o)a=this.#l.wilcoxon.v;else{const t=r.Z.prototype.getOrderOfValUnited.bind(this.#u.first);let e=Math.getW(s,n,this.#u.first.getTypeName()===r.Z.Rang.name?t:null);a=e.W/e.nn**2,this.#l.wilcoxon.v=a}this.#l.z=l;const o=l**2/(3*a**2);if(void 0===o||"number"!=typeof o)throw new Error("Ошибка расчета данных");return o}#N(t,e,s,n){let a;const i=Math.getZAlpha(this.#h,t);if("manual"===this.#o)a=this.#l.wilcoxon.v;else{const t=r.Z.prototype.getOrderOfValUnited.bind(this.#u.first);let e=Math.getW(s,n,this.#u.first.getTypeName()===r.Z.Rang.name?t:null);a=e.W/e.nn**2,this.#l.wilcoxon.v=a}const l=-Math.sqrt(a**2*3*e);this.#l.z=l;const o=l-i,h=100-Math.normdist(o);if(void 0===h||"number"!=typeof h)throw new Error("Ошибка расчета данных");return h}#D(t,e,s,n){let a,i;const l=Math.getZAlpha(this.#h,t),r=Math.getZ(l,e);if("manual"===this.#o)a=this.#l.student.d,i=this.#l.student.sd;else{const t=s.map(((t,e)=>t-n[e]));a=Math.abs(Math.mean(t)),i=Math.stddev.s(t),this.#l.student.d=a,this.#l.student.sd=i}this.#l.z=r;const o=(r*i/a)**2+l**2/2;if(void 0===o||"number"!=typeof o)throw new Error("Ошибка расчета данных");return o}#k(t,e,s,n){let a,i,l;const r=Math.getZAlpha(this.#h,t);if("manual"===this.#o)a=this.#l.student.d,i=this.#l.student.sd;else{const t=s.map(((t,e)=>t-n[e]));a=Math.abs(Math.mean(t)),i=Math.stddev.s(t),this.#l.student.d=a,this.#l.student.sd=i}l=Math.sqrt(e-r**2/2)*a/i,l>0&&(l*=-1),this.#l.z=l;const o=l-r,h=100-Math.normdist(o);if(void 0===h||"number"!=typeof h)throw new Error("Ошибка расчета данных");return h}#M(t,e,s,n,a){const i=[0,0,0];let l,o,h;return"binary"===t?l=n.isValInZeroGroup:"rang"===t&&(l=r.Z.prototype.getOrderOfValUnited.bind(n)),"continues"===t?(o=e,h=s):(o=u(e,n,l),h=u(s,a,l)),o.forEach(((t,e)=>{const s=t-h[e];0===s?i[0]++:s>0?i[1]++:s<0&&i[2]++})),i;function u(t,e,s){return t.map((t=>{const n=s.call(e,t);if(-1===n)throw new Error("Ошибка вычислений");return n}))}}updateResultsHtml(t){const e=this.#d,s=t?"<p><b>Основная гипотеза</b></p>":`<p>Статистическая мощность: ${Number.resultForm(this.#i)}%</p>`;let n,a;"manual"===this.#o?a="\n            <th>\n            </th>\n            <th>\n            </th>":"data-input-two"===this.#o&&(a="\n            <th>\n                Выборка 1\n            </th>\n            <th>\n                Выборка 2\n            </th>"),"student"===this.#r?n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                d&#772;\n                            </th>\n                            <th>\n                                s<sub>d</sub>\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.student.d)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.student.sd)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.z)}\n                            </td>\n                        </tr >\n                    </tbody >`:"sign"===this.#r?n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                &#961;<sub>&#965;</sub>\n                            </th>\n                            <th>\n                                &#961;<sub>1</sub>\n                            </th>\n                            <th>\n                                &#961;<sub>2</sub>\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.sign.p0)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.sign.p1)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.sign.p2)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.z)}\n                            </td>\n                        </tr >\n                    </tbody >`:"wilcoxon"===this.#r&&(n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                v\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.wilcoxon.v)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#l.z)}\n                            </td>\n                        </tr >\n                    </tbody >`);const i=`\n        <h2 class="results__header">${e}</h2>\n        <div class="results__block-inner">\n            ${s}\n            <p>Сравнение парных выборок</p>\n            <p>${o.testText[this.#r]}</p>\n            ${o.altHypText[this.#h]}\n            <table class="results__table">\n                <caption><small>${"manual"===this.#o?"Данные введены вручную":""}</small>\n                </caption>\n                ${n}\n            </table >\n        </div > `;this.#_.innerHTML=i}changeVisibilityResultsHtml(t){this.#_.style.display=t?"none":""}}}}]);