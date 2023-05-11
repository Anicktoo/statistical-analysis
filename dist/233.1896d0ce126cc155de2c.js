/*! For license information please see 233.1896d0ce126cc155de2c.js.LICENSE.txt */
"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[233],{693:(t,e,s)=>{s.r(e),s.d(e,{default:()=>h});const a=s.p+"f000561d4f327acaf4e7.png";var i=s(988),l=s(211),o=s(820),d=s(815);class h extends o.Z{static#t="Проверка корреляции";static#e=a;static#s=null;static testText={pearson:"Тест Пирсона",spearman:"Тест Спирмена"};static altHypText={both:"Наличие корреляции (r ≠ 0)",right:"Положительная корреляция (r &#62; 0)",left:"Отрицательная корреляция (r &#60; 0)"};#a;#n={first:void 0,second:void 0};#i;#r={z:void 0,pearson:{r:void 0},spearman:{p:void 0}};#l;#o;#d;#h={first:void 0,second:void 0};#c;#p;#u;#m=[];#b=[];#v={pair:void 0,indepTable:void 0,depTable:void 0};#_;#g;#f;#y;constructor(t,e=null){super(),this.#a=t,e&&this.#T(e)}static setModuleTypeId(t){h.#s=t}static getModuleTypeId(){return h.#s}static getName(){return h.#t}static getImage(){return h.#e}deleteSelf(){uiControls.parametersContainer.removeChild(this.#p),uiControls.resultsContainer.removeChild(this.#_)}#T(t){const e=t.getAllData();this.#n=e.data,this.#i=e.power,this.#r=e.resultsTableData,this.#l=e.testType,this.#o=e.inputType,this.#d=e.altHypTest,this.#h=e.vars,this.#c=e.hypName;uiControls.parametersContainer,uiControls.resultsContainer;const s=e.element.cloneNode(!0),a=document.createElement("div");a.classList.add("results__block"),this.#w(s,a);const n=this.#p.querySelector("#module-option-form_"+e.id);n.setAttribute("id","module-option-form_"+this.#a),n.dataset.id=this.#a,[...this.#p.querySelectorAll(".form-change-trigger_"+e.id)].forEach((t=>{t.classList.replace("form-change-trigger_"+e.id,"form-change-trigger_"+this.#a),t.setAttribute("form","module-option-form_"+this.#a)})),uiControls.parametersContainer.insertBefore(this.#p,e.element.nextElementSibling),uiControls.resultsContainer.insertBefore(this.#_,e.resultBlock.nextElementSibling)}getAllData(){const t={};return t.id=this.#a,t.data=Object.assign({},this.#n),t.power=this.#i,t.resultsTableData=Object.deepCopy(this.#r),t.testType=this.#l,t.inputType=this.#o,t.altHypTest=this.#d,t.vars=Object.assign({},this.#h),t.hypName=this.#c,t.element=this.#p,t.resultBlock=this.#_,t}setName(t){this.#c=t,this.#p.querySelector(".parameters__title").textContent=t,this.#_.querySelector(".results__header").textContent=t}setId(t){const e=this.#a,s=this.#p.querySelector("#module-option-form_"+e);s.setAttribute("id","module-option-form_"+t),s.dataset.id=t,[...this.#p.querySelectorAll(".form-change-trigger_"+e)].forEach((s=>{s.classList.replace("form-change-trigger_"+e,"form-change-trigger_"+t),s.setAttribute("form","module-option-form_"+t)})),this.#a=t}getName(){return this.#c}getElement(){return this.#p}getResultElement(){return this.#_}getFormSheets(){return this.#m}getSheetSelects(){return this.#b}setSheetOptions(t){let e="";for(let s of t){e+=`<option class='select-option-${s.id}' value="${s.id}">${s.name}</option>`}for(let t of this.#b)t.innerHTML=e}addSheetOptions(t){const e=[];for(let s of t)if(!this.#b[0].querySelector(`.select-option-${s.id}`)){const t=document.createElement("option");t.classList.add(`select-option-${s.id}`),t.value=s.id,t.textContent=s.name,e.push(t)}const s=e.map((t=>t.cloneNode(!0)));this.#b[0].append(...e),this.#b[1].append(...s)}addListeners(t){const e=t.querySelector(".two-column-var"),s=e.querySelector(".switch-button"),a=e.querySelector(".two-column-var__table-body"),n=e.querySelector(".target-table-data"),r=t.querySelector(".grouping-var"),[l,o]=[...r.querySelectorAll(".switch-button")],d=t.querySelector(".grouping-var__table-body"),h=t.querySelector(".grouping-var__dependent-table-body"),c=t.querySelector(".grouping-var__independent-table-body");this.#g=s,this.#f=l,this.#y=o;const p=()=>{(h.firstElementChild&&c.firstElementChild||2===n.children.length)&&i.Z.setSettings(this.#a)},u=function(t,e,s,a){const n=t.querySelector("input:checked")||e.querySelector("input:checked");if(!n)return;const i=n.parentElement,r=i.parentElement;if(r.isSameNode(e))r.removeChild(i),((t,e)=>{const s=e.querySelector(".var-table__anchor_"+t.dataset.varId);s&&e.insertBefore(t,s)})(i,t),a.classList.replace("switch-button_left","switch-button_right");else{if(e.children.length===s)return;r.removeChild(i),e.appendChild(i),a.classList.replace("switch-button_right","switch-button_left")}p()};s.addEventListener("click",u.bind(this,a,n,2,s)),l.addEventListener("click",u.bind(this,d,h,1,l)),o.addEventListener("click",u.bind(this,d,c,1,o))}displayVarsOfSheet(t,e){const s=l.Z.getVarsBySheetId(t);if(!s)return;let a,n=[];if("two-column-var"===e){a=this.#p.querySelector(".two-column-var__table-body");const t=this.#v.pair;n.push(t.firstElementChild?.dataset.varId),n.push(t.lastElementChild?.dataset.varId),a.innerHTML=i();const e=t=>{const e=this.#v.pair.firstElementChild,s=this.#v.pair.lastElementChild;e?.dataset.varId!==t.dataset.varId&&s?.dataset.varId!==t.dataset.varId?this.#g.classList.replace("switch-button_left","switch-button_right"):this.#g.classList.replace("switch-button_right","switch-button_left")};[...a.querySelectorAll(".var-table__item")].forEach((t=>t.querySelector("input").addEventListener("change",e.bind(this,t))))}else if("grouping-var"===e){a=this.#p.querySelector(".grouping-var__table-body");const t=this.#v.depTable.firstElementChild,e=this.#v.indepTable.firstElementChild;n.push(t?.dataset.varId),n.push(e?.dataset.varId),a.innerHTML=i();const s=t=>{this.#v.indepTable.firstElementChild?.dataset.varId===t.dataset.varId?this.#y.classList.replace("switch-button_right","switch-button_left"):this.#v.depTable.firstElementChild?.dataset.varId===t.dataset.varId?this.#f.classList.replace("switch-button_right","switch-button_left"):(this.#f.classList.replace("switch-button_left","switch-button_right"),this.#y.classList.replace("switch-button_left","switch-button_right"))};[...a.querySelectorAll(".var-table__item")].forEach((t=>t.querySelector("input").addEventListener("change",s.bind(this,t))))}function i(){let t="";return s.forEach((e=>{const s=e.getID();let a=`\n                <label title="${e.getName()}" class="var-table__item" data-var-id=${s}>\n                    <input type="radio" name="data_value">\n                    <img src=${e.getImg()} alt="${e.getTypeName()}" class="var-table__img">\n                    <span>${e.getName()}</span>\n                </label>`;n.includes(s)||(t+=a),t+=`<div class='var-table__anchor var-table__anchor_${s}'></div>`})),t}}updateSelectedVarsVisual(t){let e=this.#v.pair,s=[...e.querySelectorAll("label")];function a(e){e.forEach((e=>{if(e){const s=e.dataset.varId.split("_");if(s[1]==t){const t=l.Z.getVarBySheetIdAndVarId(s[1],s[2]),a=e.querySelector("img");e.querySelector("span").innerHTML=t.getName(),a.setAttribute("src",t.getImg()),a.setAttribute("alt",t.getTypeName())}}}))}a(s),e=this.#v,s=[e.depTable?.firstElementChild,e.indepTable?.firstElementChild],a(s)}clearSelectedVars(){this.#v.pair.innerHTML="",this.#v.depTable.innerHTML="",this.#v.indepTable.innerHTML=""}createHTML(){const t="Гипотеза "+(this.#a+1),e=uiControls.parametersContainer,s=uiControls.resultsContainer,a=document.createElement("div"),n=document.createElement("div");a.classList.add("parameters__item","collapsible"),n.classList.add("results__block");const i=`\n        <label class="collapsible__head">\n            <input class="collapsible__input" type="checkbox" checked>\n            <div class="parameters__head">\n                <div class="parameters__title-container">\n                    <div class="collapsible__symbol collapsible__symbol_checked"></div>\n                    <h2 class="parameters__title">${t}</h2>\n                    <input class="parameters__title-input" type='text'>\n                </div>\n                <div class="parameters__extra-container">\n                    <button title="Изменить название гипотезы"\n                        class="parameters__extra-item parameters__edit-button main-button"></button>\n                    <label title="Убрать гипотезу из вычислений"\n                        class="parameters__extra-item parameters__hide-button main-button">\n                        <input type="checkbox">\n                    </label>\n                    <button title="Дублировать гипотезу"\n                        class="parameters__extra-item parameters__duplicate-button main-button"></button>\n                    <button title="Удалить гипотезу"\n                        class="parameters__extra-item parameters__delete-button main-button"></button>\n                </div>\n            </div>\n        </label>\n        <div class="collapsible__content collapsible__content_checked">\n            <div class="parameters__content">\n                <form id="module-option-form_${this.#a}" class="module-option-form" data-id=${this.#a}></form>\n                <div class="option-block">\n                    <p>Метод проверки: Проверка корреляции</p>\n                    <div class="option-block__sub">\n                        Тип ввода\n                        <div class="option-block__list">\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#a} data-input-two" type="radio" name="input-type" value="data-input-two" form="module-option-form_${this.#a}"\n                                    checked>\n                                <span>Вычисление по данным (два столбца)</span>\n                            </label>\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#a} data-input-group" type="radio" name="input-type" value="data-input-group" form="module-option-form_${this.#a}"\n                                    >\n                                <span>Вычисление по данным (группировка по переменной)</span>\n                            </label>\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#a} manual-input-on" type="radio" name="input-type" value="manual" form="module-option-form_${this.#a}">\n                                <span>Ввести величину эффекта</span>\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__two-column">\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Тест\n                                <div class="option-block__list option-block__test-type">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#a}" type="radio"\n                                            name="test-type" value="pearson"\n                                            form="module-option-form_${this.#a}" checked>\n                                        <span>Пирсона</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#a}" type="radio"\n                                            name="test-type" value="spearman"\n                                            form="module-option-form_${this.#a}">\n                                        <span>Спирмена</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Проверка альтернативной гипотезы\n                                <div class="option-block__list">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#a}" type="radio"\n                                            name="hyp-check" value="both"\n                                            form="module-option-form_${this.#a}" checked>\n                                        <span>${h.altHypText.both}</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#a}" type="radio"\n                                            name="hyp-check" value="right"\n                                            form="module-option-form_${this.#a}">\n                                        <span>${h.altHypText.right}</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#a}" type="radio"\n                                            name="hyp-check" value="left"\n                                            form="module-option-form_${this.#a}">\n                                        <span>${h.altHypText.left}</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__pearson option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Коэффициент корреляции Пирсона (r):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#a}" name="r" value="0.5" step="0.01" max="1" min="-1" form="module-option-form_${this.#a}">\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__spearman option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Коэффициент корреляции Спримена (&#961;):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#a}" name="p" value="0.5" step="0.01" max="1" min="-1" form="module-option-form_${this.#a}">\n                            </label>\n                        </div>\n                    </div>\n                    \n                    <div class="option-block__tables two-column-var">\n                        <div class="var-table">\n                            <div class="var-table__header">\n                                <form class="sheet-form" data-type="two-column-var">\n                                    <div class="main-select">\n                                       <select class="main-input two-column-var__sheet-select sheet-select" name="sheet-select"></select>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class="var-table__body two-column-var__table-body"></div>\n                        </div>\n                        <div class="two-column-var__switch-container">\n                            <div class="switch-button switch-button_right">\n                                <div class="switch-button__symbol"></div>\n                            </div>\n                        </div>\n                        <div class="var-table">\n                            <div class="var-table__header">Сравниваемые переменные</div>\n                            <div class="var-table__body two-column-var__table-body">\n                                <div class="two-column-var__item target-table-data">\n                                </div>\n                                <div class="two-column-var__delimiter"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="option-block__tables grouping-var option-block_hidden">\n                        <div class="var-table">\n                            <div class="var-table__header">\n                                <form class="sheet-form" data-type="grouping-var">\n                                    <div class="main-select">\n                                        <select class="main-input grouping-var__sheet-select sheet-select"\n                                            name="sheet-select"></select>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class="var-table__body grouping-var__table-body">\n                            </div>\n                        </div>\n                        <div class="grouping-var__tables-and-switches">\n                            <div class="grouping-var__container">\n                                <div class="grouping-var__switch-container">\n                                    <div class="switch-button switch-button_right">\n                                        <div class="switch-button__symbol"></div>\n                                    </div>\n                                </div>\n                                <div class="var-table">\n                                    <div class="var-table__header">Зависимая переменная</div>\n                                    <div class="var-table__body grouping-var__dependent-table-body">\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="grouping-var__container">\n                                <div class="grouping-var__switch-container">\n                                    <div class="switch-button switch-button_right">\n                                        <div class="switch-button__symbol"></div>\n                                    </div>\n                                </div>\n                                <div class="var-table">\n                                    <div class="var-table__header">Группировка по переменной</div>\n                                    <div class="var-table__body grouping-var__independent-table-body">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>`;a.innerHTML=i,this.#w(a,n),this.#c=t,e.appendChild(a),s.appendChild(n)}#w(t,e){this.#p=t,this.#u=t.querySelector(".module-option-form"),this.#m=[...t.querySelectorAll(".sheet-form")],this.#b=[...t.querySelectorAll(".sheet-select")],this.#v.pair=t.querySelector(".target-table-data"),this.#v.indepTable=t.querySelector(".grouping-var__independent-table-body"),this.#v.depTable=t.querySelector(".grouping-var__dependent-table-body"),this.#_=e}setSettings(){const t=new FormData(this.#u);switch(this.#l=t.get("test-type"),this.#d=t.get("hyp-check"),this.#o=t.get("input-type"),this.#l){case"pearson":"manual"===this.#o?this.#r.pearson.r=Number(t.get("r")):this.#r.pearson.r=null;break;case"spearman":"manual"===this.#o?this.#r.spearman.p=Number(t.get("p")):this.#r.spearman.p=null}this.#r.z=null;const e=[];this.#n.first=null,this.#n.second=null;const s=[];if(this.#h.first=null,this.#h.second=null,"manual"!==this.#o){const t=this.#v,a=t.depTable.firstElementChild,n=t.indepTable.firstElementChild;let i,r;"data-input-two"===this.#o?(i=[...t.pair.children],r=2===i.length):(i=[a,n],r=a&&n),r&&(i.forEach((t=>{const a=t.dataset.varId.split("_");e.push(l.Z.getDataBySheetAndVarId(a[1],a[2]).slice(1)),s.push(l.Z.getVarBySheetIdAndVarId(a[1],a[2]))})),this.#n.first=e[0],this.#n.second=e[1],this.#h.first=s[0],this.#h.second=s[1])}}getN(t,e){return!t||Number.isNaN(t)||"number"!=typeof t?null:e&&!Number.isNaN(e)&&"number"==typeof e?this.#S(!1,t,e):void 0}setStatPower(t,e){if(!t||Number.isNaN(t)||"number"!=typeof t)return null;e&&!Number.isNaN(e)&&"number"==typeof e&&(this.#i=this.#S(!0,t,e))}#S(t,e,s){let a,n,i,r,l=[],o=[];if("manual"!==this.#o){if(!this.#n.first||!this.#n.second)return;if(a=this.#h.first.getTypeName(),n=this.#h.second.getTypeName(),"data-input-two"===this.#o){if(i=this.#v.pair,a!==n)return void uiControls.showError(i,"Нельзя сравнить данные разного типа");if(this.#n.first.length!==this.#n.second.length)return void uiControls.showError(i,"Выбранные наборы данных должны иметь равный размер");l=[...this.#n.first],o=[...this.#n.second]}else{if(i=this.#v.indepTable,n!==d.Z.Binary.name)return void uiControls.showError(i,"Переменная для группировки должна быть дихотомического типа");if(this.#n.first.length!==this.#n.second.length)return void uiControls.showError(i,"Размеры данных зависимой переменной и переменной для группировки должны совпадать");const t=this.#h.second;if(this.#n.first.forEach(((e,s)=>{const a=t.isValInZeroGroup(this.#n.second[s]);if(0===a)l.push(e);else{if(1!==a)return void uiControls.showError(i,"Ошибка вычисления");o.push(e)}})),l.length!==o.length)return void uiControls.showError(i,"Выборки должны иметь равный размер")}if(0===l.length||0===o.length)return void uiControls.showError(i,"Присутствует пустая выборка, невозможно провести вычисления")}else i=this.#p;try{switch(this.#l){case"pearson":if("manual"!==this.#o&&a!==d.Z.Continues.name)throw new Error(h([d.Z.Continues.ruName]));r=t?this.#k(e,s,l,o):this.#C(e,s,l,o);break;case"spearman":if("manual"!==this.#o&&a!==d.Z.Rang.name)throw new Error(h([d.Z.Rang.ruName]));r=t?this.#E(e,s,l,o):this.#$(e,s,l,o)}}catch(t){return void uiControls.showError(i,t.message)}return r;function h(t){return`Выбранный тест поддерживает следующий тип данных: ${t.join(", ")}`}}#C(t,e,s,a){let n;const i=Math.getZAlpha(this.#d,t),r=Math.getZ(i,e);if("manual"===this.#o)n=this.#r.pearson.r;else{const t=Math.mean(s),e=Math.mean(a),i=[],r=[];for(let n=0;n<s.length;n++){if(""===s[n]||""===a[n])throw new Error("Невозможно обработать набор данных, имеются пропущенные значения");i.push(s[n]-t),r.push(a[n]-e)}const l=0,o=i.reduce(((t,e,s)=>t+e*r[s]),l),d=i.reduce(((t,e)=>t+e**2),l),h=r.reduce(((t,e)=>t+e**2),l);n=o/Math.sqrt(d*h)}this.#r.z=r,this.#r.pearson.r=n;const l=(r/Math.fisher(n))**2+3;if(void 0===l||"number"!=typeof l)throw new Error("Ошибка расчета данных");return l}#k(t,e,s,a){let n,i;const r=Math.getZAlpha(this.#d,t);if("manual"===this.#o)n=this.#r.pearson.r;else{const t=Math.mean(s),e=Math.mean(a),i=[],r=[];for(let n=0;n<s.length;n++){if(""===s[n]||""===a[n])throw new Error("Невозможно обработать набор данных, имеются пропущенные значения");i.push(s[n]-t),r.push(a[n]-e)}const l=0,o=i.reduce(((t,e,s)=>t+e*r[s]),l),d=i.reduce(((t,e)=>t+e**2),l),h=r.reduce(((t,e)=>t+e**2),l);n=o/Math.sqrt(d*h)}this.#r.pearson.r=n,i=Math.sqrt(Math.fisher(n)**2*(e-3)),i>0&&(i*=-1),this.#r.z=i;const l=i-r,o=100-Math.normdist(l);if(void 0===o||"number"!=typeof o)throw new Error("Ошибка расчета данных");return o}#$(t,e,s,a){let i;const l=Math.getZAlpha(this.#d,t),o=Math.getZ(l,e);if("manual"===this.#o)i=this.#r.spearman.p;else{const t=Math.mean(s),e=Math.mean(a),n=[],i=[];for(let r=0;r<s.length;r++){if(""===s[r]||""===a[r])throw new Error("Невозможно обработать набор данных, имеются пропущенные значения");n.push(s[r]-t),i.push(a[r]-e)}const l=0,o=n.reduce(((t,e,s)=>t+e*i[s]),l),d=n.reduce(((t,e)=>t+e**2),l),h=i.reduce(((t,e)=>t+e**2),l),c=Math.sqrt(d*h);r=o/c}if(this.#r.z=o,this.#r.spearman.p=i,void 0===n||"number"!=typeof n)throw new Error("Ошибка расчета данных");return n}#E(t,e,s,a){}updateResultsHtml(t){const e=this.#c,s=t?"<p><b>Основная гипотеза</b></p>":`<p>Статистическая мощность: ${Number.resultForm(this.#i)}%</p>`;let a,n;n="manual"===this.#o?"\n            <th>\n            </th>\n            <th>\n            </th>":"data-input-two"===this.#o?"\n            <th>\n                Выборка 1\n            </th>\n            <th>\n                Выборка 2\n            </th>":"\n            <th>\n                Зависимая переменная\n            </th>\n            <th>\n                Переменная для группировки\n            </th>","pearson"===this.#l?a=`<thead>\n                        <tr>\n                            ${n}\n                            <th>\n                                r\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#h.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#h.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.pearson.r)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.z)}\n                            </td>\n                        </tr >\n                    </tbody >`:"spearman"===this.#l&&(a=`<thead>\n                        <tr>\n                            ${n}\n                            <th>\n                                &#961;\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#h.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#h.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.spearman.p)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.z)}\n                            </td>\n                        </tr >\n                    </tbody >`);const i=`\n        <h2 class="results__header">${e}</h2>\n        <div class="results__block-inner">\n            ${s}\n            <p>Проверка корреляции</p>\n            <p>${h.testText[this.#l]}</p>\n            ${h.altHypText[this.#d]}\n            <table class="results__table">\n                <caption><small>${"manual"===this.#o?"Данные введены вручную":""}</small>\n                </caption>\n                ${a}\n            </table >\n        </div > `;this.#_.innerHTML=i}changeVisibilityResultsHtml(t){this.#_.style.display=t?"none":""}}}}]);