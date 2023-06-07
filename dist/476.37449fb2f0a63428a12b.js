"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[476],{510:(t,e,s)=>{s.r(e),s.d(e,{default:()=>o});const n=s.p+"cd9285569f05521af3fc.png";var a=s(988),i=s(211),r=s(820),l=s(240);class o extends r.Z{static#t="Сравнение независимых выборок";static#e=n;static#s=null;static testText={fisher:"Точный тест Фишера",mann:"Тест Манна-Уитни",student:"Независимый тест Стьюдента"};static altHypText={both:"Двусторонняя проверка альтернативной гипотезы (M2 ≠ M1)",right:"Правосторонняя проверка альтернативной гипотезы (M2 &#62; M1)",left:"Левосторонняя проверка альтернативной гипотезы (M2 &#60; M1)"};#n;#a={first:void 0,second:void 0};#i;#r={z:void 0,student:{x:void 0,y:void 0,varX:void 0,varY:void 0},fisher:{p0:void 0,p1:void 0,p2:void 0},mann:{p:void 0}};#l;#o;#h;#u={first:void 0,second:void 0};#d;#c;#p;#m=[];#b=[];#v={pair:void 0,indepTable:void 0,depTable:void 0};#g;#_;#f;#y;#T;#w;constructor(t,e=null){super(),this.#n=t,e&&this.#D(e)}static setModuleTypeId(t){o.#s=t}static getModuleTypeId(){return o.#s}static getName(){return o.#t}static getImage(){return o.#e}deleteSelf(){uiControls.parametersContainer.removeChild(this.#c),uiControls.resultsContainer.removeChild(this.#f)}#D(t){const e=t.getAllData();this.#a=e.data,this.#i=e.power,this.#r=e.resultsTableData,this.#l=e.testType,this.#o=e.inputType,this.#h=e.altHypTest,this.#u=e.vars,this.#d=e.hypName;const s=e.element.cloneNode(!0),n=document.createElement("div");n.classList.add("results__block"),this.#k(s,n);const a=this.#c.querySelector("#module-option-form_"+e.id);a.setAttribute("id","module-option-form_"+this.#n),a.dataset.id=this.#n,[...this.#c.querySelectorAll(".form-change-trigger_"+e.id)].forEach((t=>{t.classList.replace("form-change-trigger_"+e.id,"form-change-trigger_"+this.#n),t.setAttribute("form","module-option-form_"+this.#n)})),uiControls.parametersContainer.insertBefore(this.#c,e.element.nextElementSibling),uiControls.resultsContainer.insertBefore(this.#f,e.resultBlock.nextElementSibling)}getAllData(t){const e={};return e.hypName=this.#d,e.inputType=this.#o,e.testType=this.#l,e.altHypTest=this.#h,e.resultsTableData=Object.deepCopy(this.#r),t?(e.moduleTypeId=o.#s,e.varIds=[this.#u.first?.getID(),this.#u.second?.getID()],e):(e.element=this.#c,e.resultBlock=this.#f,e.vars=Object.assign({},this.#u),e.power=this.#i,e.data=Object.assign({},this.#a),e.id=this.#n,e)}setName(t){this.#d=t,this.#c.querySelector(".parameters__title").textContent=t,this.#f.querySelector(".results__header").textContent=t}setId(t){const e=this.#n,s=this.#c.querySelector("#module-option-form_"+e);s.setAttribute("id","module-option-form_"+t),s.dataset.id=t,[...this.#c.querySelectorAll(".form-change-trigger_"+e)].forEach((s=>{s.classList.replace("form-change-trigger_"+e,"form-change-trigger_"+t),s.setAttribute("form","module-option-form_"+t)})),this.#n=t}setLoadingData(t,e,s,n,a){const i=(t,e)=>{[...this.#c.querySelector(".option-block__"+t).querySelectorAll("input")].forEach((t=>{t.value==e&&t.click()}))},r=(t,e)=>{const s=this.#c.querySelector(".option-block__"+t);e.forEach((t=>{const e=`input[name='${t[0]}']`,n=s.querySelector(e);n&&null!==t[1]&&void 0!==t[1]&&(n.value=t[1])}))};this.#o=t,this.#l=e,this.#h=s,this.#r=n,i("input-type",t),i("test-type",e),i("hyp-check",s);for(let t in this.#r)"z"!==t&&r(t,Object.entries(this.#r[t]));if("manual"===this.#o||!a[0]&&!a[1])return;const l=a[0].split("_"),o=a[1].split("_"),h=(t,e,s,n,a)=>{this.displayVarsOfSheet(t,e);s.querySelector(".var-table__item_"+n).click(),a.click()};"data-input-two"===this.#o?(h(l[1],"two-column-var",this.#g,a[0],this.#y),h(o[1],"two-column-var",this.#g,a[1],this.#y)):(h(l[1],"grouping-var",this.#_,a[0],this.#T),h(o[1],"grouping-var",this.#_,a[1],this.#w))}getName(){return this.#d}getElement(){return this.#c}getResultElement(){return this.#f}getFormSheets(){return this.#m}getSheetSelects(){return this.#b}setSheetOptions(t){let e="";for(let s of t){e+=`<option class='select-option-${s.id}' value="${s.id}">${s.name}</option>`}for(let t of this.#b)t.innerHTML=e}addSheetOptions(t){const e=[];for(let s of t)if(!this.#b[0].querySelector(`.select-option-${s.id}`)){const t=document.createElement("option");t.classList.add(`select-option-${s.id}`),t.value=s.id,t.textContent=s.name,e.push(t)}this.#b.forEach((t=>{const s=e.map((t=>t.cloneNode(!0)));t.append(...s)}))}addListeners(t){const e=this.#g,s=e.querySelector(".switch-button"),n=e.querySelector(".two-column-var__table-body"),i=e.querySelector(".target-table-data"),r=this.#_,[l,o]=[...r.querySelectorAll(".switch-button")],h=t.querySelector(".grouping-var__table-body"),u=t.querySelector(".grouping-var__dependent-table-body"),d=t.querySelector(".grouping-var__independent-table-body");this.#y=s,this.#T=l,this.#w=o;const c=()=>{(u.firstElementChild&&d.firstElementChild||2===i.children.length)&&a.Z.setSettings(this.#n)},p=function(t,e,s,n){const a=t.querySelector("input:checked")||e.querySelector("input:checked");if(!a)return;const i=a.parentElement,r=i.parentElement;if(r.isSameNode(e))r.removeChild(i),((t,e)=>{const s=e.querySelector(".var-table__anchor_"+t.dataset.varId);s&&e.insertBefore(t,s)})(i,t),n.classList.replace("switch-button_left","switch-button_right");else{if(e.children.length===s)return;r.removeChild(i),e.appendChild(i),n.classList.replace("switch-button_right","switch-button_left")}c()};s.addEventListener("click",p.bind(this,n,i,2,s)),l.addEventListener("click",p.bind(this,h,u,1,l)),o.addEventListener("click",p.bind(this,h,d,1,o))}displayVarsOfSheet(t,e){const s=i.Z.getVarsBySheetId(t);if(!s)return;let n,a=[];if("two-column-var"===e){n=this.#c.querySelector(".two-column-var__table-body");const t=this.#v.pair;a.push(t.firstElementChild?.dataset.varId),a.push(t.lastElementChild?.dataset.varId),n.innerHTML=r();const e=t=>{const e=this.#v.pair.firstElementChild,s=this.#v.pair.lastElementChild;e?.dataset.varId!==t.dataset.varId&&s?.dataset.varId!==t.dataset.varId?this.#y.classList.replace("switch-button_left","switch-button_right"):this.#y.classList.replace("switch-button_right","switch-button_left")};[...n.querySelectorAll(".var-table__item")].forEach((t=>t.querySelector("input").addEventListener("change",e.bind(this,t))))}else if("grouping-var"===e){n=this.#c.querySelector(".grouping-var__table-body");const t=this.#v.depTable.firstElementChild,e=this.#v.indepTable.firstElementChild;a.push(t?.dataset.varId),a.push(e?.dataset.varId),n.innerHTML=r();const s=t=>{this.#v.indepTable.firstElementChild?.dataset.varId===t.dataset.varId?this.#w.classList.replace("switch-button_right","switch-button_left"):this.#v.depTable.firstElementChild?.dataset.varId===t.dataset.varId?this.#T.classList.replace("switch-button_right","switch-button_left"):(this.#T.classList.replace("switch-button_left","switch-button_right"),this.#w.classList.replace("switch-button_left","switch-button_right"))};[...n.querySelectorAll(".var-table__item")].forEach((t=>t.querySelector("input").addEventListener("change",s.bind(this,t))))}function r(){let t="";return s.forEach((e=>{const s=e.getID();let n=`\n                <label title="${e.getName()}" class="var-table__item var-table__item_${s}" data-var-id=${s}>\n                    <input type="radio" name="data_value">\n                    <img src=${e.getImg()} alt="${e.getTypeName()}" class="var-table__img">\n                    <span>${e.getName()}</span>\n                </label>`;a.includes(s)||(t+=n),t+=`<div class='var-table__anchor var-table__anchor_${s}'></div>`})),t}}updateSelectedVarsVisual(t){const e=e=>{e.forEach((e=>{if(e){const s=e.dataset.varId.split("_");if(s[1]==t){const t=i.Z.getVarBySheetIdAndVarId(s[1],s[2]);if(!t)return void this.#v.pair.removeChild(e);const n=e.querySelector("img");e.querySelector("span").innerHTML=t.getName(),n.setAttribute("src",t.getImg()),n.setAttribute("alt",t.getTypeName())}}}))};let s=this.#v.pair,n=[...s.querySelectorAll("label")];e(n),s=this.#v,n=[s.depTable?.firstElementChild,s.indepTable?.firstElementChild],e(n)}clearSelectedVars(){this.#v.pair.innerHTML="",this.#v.depTable.innerHTML="",this.#v.indepTable.innerHTML=""}createHTML(){const t="Гипотеза "+(this.#n+1),e=uiControls.parametersContainer,s=uiControls.resultsContainer,n=document.createElement("div"),a=document.createElement("div");n.classList.add("parameters__item","collapsible"),a.classList.add("results__block");const i=`\n        <label class="collapsible__head">\n            <input class="collapsible__input" type="checkbox" checked>\n            <div class="parameters__head">\n                <div class="parameters__title-container">\n                    <div class="collapsible__symbol collapsible__symbol_checked"></div>\n                    <h2 class="parameters__title">${t}</h2>\n                    <input class="parameters__title-input hidden" type='text'>\n                </div>\n                <div class="parameters__extra-container">\n                    <button title="Изменить название гипотезы"\n                        class="extra extra_edit-button main-button"></button>\n                    <label title="Убрать гипотезу из вычислений"\n                        class="extra extra_hide-button main-button">\n                        <input type="checkbox">\n                    </label>\n                    <button title="Дублировать гипотезу"\n                        class="extra extra_duplicate-button main-button"></button>\n                    <button title="Удалить гипотезу"\n                        class="extra extra_delete-button main-button"></button>\n                </div>\n            </div>\n        </label>\n        <div class="collapsible__content collapsible__content_checked">\n            <div class="parameters__content">\n                <form id="module-option-form_${this.#n}" class="module-option-form" data-id=${this.#n}></form>\n                <div class="option-block">\n                    <p>Метод проверки: Сравнение независимых выборок</p>\n                    <div class="option-block__sub">\n                        Тип ввода\n                        <div class="option-block__list option-block__input-type">\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#n} data-input-two" type="radio" name="input-type" value="data-input-two" form="module-option-form_${this.#n}"\n                                    checked>\n                                <span>Вычисление по данным (два столбца)</span>\n                            </label>\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#n} data-input-group" type="radio" name="input-type" value="data-input-group" form="module-option-form_${this.#n}"\n                                    >\n                                <span>Вычисление по данным (группировка по переменной)</span>\n                            </label>\n                            <label class="radio-line">\n                                <input class="main-radio form-change-trigger form-change-trigger_${this.#n} manual-input-on" type="radio" name="input-type" value="manual" form="module-option-form_${this.#n}">\n                                <span>Ввести величину эффекта</span>\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__two-column">\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Тест\n                                <div class="option-block__list option-block__test-type">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="test-type" value="fisher"\n                                            form="module-option-form_${this.#n}" checked>\n                                        <span>Точный тест Фишера</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="test-type" value="mann"\n                                            form="module-option-form_${this.#n}">\n                                        <span>Манна-Уитни</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="test-type" value="student"\n                                            form="module-option-form_${this.#n}">\n                                        <span>Стьюдента</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="option-block">\n                            <div class="option-block__sub">\n                                Проверка альтернативной гипотезы\n                                <div class="option-block__list option-block__hyp-check">\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="hyp-check" value="both"\n                                            form="module-option-form_${this.#n}" checked>\n                                        <span>Двусторонняя (M1 ≠ M2)</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="hyp-check" value="right"\n                                            form="module-option-form_${this.#n}">\n                                        <span>Правосторонняя (M2 &#62; M1)</span>\n                                    </label>\n                                    <label class="radio-line">\n                                        <input class="main-radio form-change-trigger form-change-trigger_${this.#n}" type="radio"\n                                            name="hyp-check" value="left"\n                                            form="module-option-form_${this.#n}">\n                                        <span>Левосторонняя (M2 &#60; M1)</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__student option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Среднее арифметическое 1-й выборки ( x&#772; ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="x" value="1" step="0.1" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Среднее арифметическое 2-й выборки ( y&#772; ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="y" value="1" step="0.1" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Дисперсия 1-й выборки ( <i>Var(x)</i> )</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="varX" value="1" step="0.1" min="0" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Дисперсия 2-й выборки ( <i>Var(y)</i> )</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="varY" value="1" step="0.1" min="0" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__fisher option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Вероятность успеха в 1-й выборке ( &#961;<sub>1</sub> ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="p1" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#n}">\n                            </label>\n                            <label class="input-line">\n                                <span>Вероятность успеха во 2-й выборке ( &#961;<sub>2</sub> ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="p2" value="0.5" step="0.01" min="0" max="1" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n                    <div class="option-block__sub option-block__manual-input option-block__mann option-block_hidden">\n                        Введите параметры:\n                        <div class="option-block__list">\n                            <label class="input-line">\n                                <span>Величина эффекта ( p ):</span>\n                                <input type="number" class="main-input main-input_number form-change-trigger form-change-trigger_${this.#n}" name="p" value="0.01" step="0.01" form="module-option-form_${this.#n}">\n                            </label>\n                        </div>\n                    </div>\n                    \n                    <div class="option-block__tables two-column-var">\n                        <div class="var-table">\n                            <div class="var-table__header">\n                                <form class="sheet-form" data-type="two-column-var">\n                                    <div class="main-select">\n                                       <select class="main-input two-column-var__sheet-select sheet-select" name="sheet-select"></select>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class="var-table__body two-column-var__table-body"></div>\n                        </div>\n                        <div class="two-column-var__switch-container">\n                            <div class="switch-button switch-button_right">\n                                <div class="switch-button__symbol"></div>\n                            </div>\n                        </div>\n                        <div class="var-table">\n                            <div class="var-table__header">Сравниваемые переменные</div>\n                            <div class="var-table__body two-column-var__table-body">\n                                <div class="two-column-var__item target-table-data">\n                                </div>\n                                <div class="two-column-var__delimiter"></div>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <div class="option-block__tables grouping-var option-block_hidden">\n                        <div class="var-table">\n                            <div class="var-table__header">\n                                <form class="sheet-form" data-type="grouping-var">\n                                    <div class="main-select">\n                                        <select class="main-input grouping-var__sheet-select sheet-select"\n                                            name="sheet-select"></select>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class="var-table__body grouping-var__table-body">\n                            </div>\n                        </div>\n                        <div class="grouping-var__tables-and-switches">\n                            <div class="grouping-var__container">\n                                <div class="grouping-var__switch-container">\n                                    <div class="switch-button switch-button_right">\n                                        <div class="switch-button__symbol"></div>\n                                    </div>\n                                </div>\n                                <div class="var-table">\n                                    <div class="var-table__header">Зависимая переменная</div>\n                                    <div class="var-table__body grouping-var__dependent-table-body">\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="grouping-var__container">\n                                <div class="grouping-var__switch-container">\n                                    <div class="switch-button switch-button_right">\n                                        <div class="switch-button__symbol"></div>\n                                    </div>\n                                </div>\n                                <div class="var-table">\n                                    <div class="var-table__header">Группировка по переменной</div>\n                                    <div class="var-table__body grouping-var__independent-table-body">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                </div>\n            </div>\n        </div>`;n.innerHTML=i,this.#k(n,a),this.#d=t,e.appendChild(n),s.appendChild(a)}#k(t,e){this.#c=t,this.#p=t.querySelector(".module-option-form"),this.#m=[...t.querySelectorAll(".sheet-form")],this.#b=[...t.querySelectorAll(".sheet-select")],this.#v.pair=t.querySelector(".target-table-data"),this.#v.indepTable=t.querySelector(".grouping-var__independent-table-body"),this.#v.depTable=t.querySelector(".grouping-var__dependent-table-body"),this.#g=t.querySelector(".two-column-var"),this.#_=t.querySelector(".grouping-var"),this.#f=e}setSettings(){const t=new FormData(this.#p);switch(this.#l=t.get("test-type"),this.#h=t.get("hyp-check"),this.#o=t.get("input-type"),this.#l){case"student":"manual"===this.#o?(this.#r.student.x=Number(t.get("x")),this.#r.student.y=Number(t.get("y")),this.#r.student.varX=Number(t.get("varX")),this.#r.student.varY=Number(t.get("varY"))):(this.#r.student.x=null,this.#r.student.y=null,this.#r.student.varX=null,this.#r.student.varY=null);break;case"fisher":"manual"===this.#o?(this.#r.fisher.p1=Number(t.get("p1")),this.#r.fisher.p2=Number(t.get("p2"))):(this.#r.fisher.p1=null,this.#r.fisher.p2=null),this.#r.fisher.p0=null;break;case"mann":"manual"===this.#o?this.#r.mann.p=Number(t.get("p")):this.#r.mann.p=null}this.#r.z=null;const e=[];this.#a.first=null,this.#a.second=null;const s=[];if(this.#u.first=null,this.#u.second=null,"manual"!==this.#o){const t=this.#v,n=t.depTable.firstElementChild,a=t.indepTable.firstElementChild;let r,l;"data-input-two"===this.#o?(r=[...t.pair.children],l=2===r.length):(r=[n,a],l=n&&a),l&&(r.forEach((t=>{const n=t.dataset.varId.split("_");e.push(i.Z.getDataBySheetAndVarId(n[1],n[2])),s.push(i.Z.getVarBySheetIdAndVarId(n[1],n[2]))})),this.#a.first=e[0],this.#a.second=e[1],this.#u.first=s[0],this.#u.second=s[1])}}getN(t,e){return!t||Number.isNaN(t)||"number"!=typeof t?null:e&&!Number.isNaN(e)&&"number"==typeof e?this.#S(!1,t,e):void 0}setStatPower(t,e){if(!t||Number.isNaN(t)||"number"!=typeof t)return null;e&&!Number.isNaN(e)&&"number"==typeof e&&(this.#i=this.#S(!0,t,e))}#S(t,e,s){let n,a,i,r,o=[],h=[];if("manual"!==this.#o){if(!this.#a.first||!this.#a.second)return;if(n=this.#u.first.getTypeName(),a=this.#u.second.getTypeName(),"data-input-two"===this.#o){if(i=this.#v.pair,n!==a)return void uiControls.showError(i,"Нельзя сравнить данные разного типа");const t=(t,e)=>t.forEach((t=>""!==t?e.push(t):null));t(this.#a.first,o),t(this.#a.second,h)}else{if(i=this.#v.indepTable,a!==l.Z.Binary.name)return void uiControls.showError(i,"Переменная для группировки должна быть дихотомического типа");const t=this.#u.second,e=Math.min(this.#a.first.length,this.#a.second.length);for(let s=0;s<e;s++){const e=this.#a.first[s];if(""===e)continue;const n=this.#a.second[s];if(""===n)continue;const a=t.isValInZeroGroup(n);if(0===a)o.push(e);else{if(1!==a)return void uiControls.showError(i,"Ошибка вычисления");h.push(e)}}}if(0===o.length||0===h.length)return void uiControls.showError(i,"Присутствует пустая выборка, невозможно провести вычисления")}else i=this.#c;try{switch(this.#l){case"student":if("manual"!==this.#o&&n!==l.Z.Continues.name)throw new Error(u([l.Z.Continues.ruName]));r=t?this.#$(e,s,o,h):this.#E(e,s,o,h);break;case"fisher":if("manual"!==this.#o&&n!==l.Z.Binary.name)throw new Error(u([l.Z.Binary.ruName]));r=t?this.#N(e,s,o,h):this.#M(e,s,o,h);break;case"mann":if("manual"!==this.#o&&n!==l.Z.Continues.name&&n!==l.Z.Rang.name)throw new Error(u([l.Z.Continues.ruName,l.Z.Rang.ruName]));if("data-input-two"===this.#o&&n===l.Z.Rang.name&&!this.#u.first.isUnitedWith(this.#u.second))throw new Error("Для данного теста и способа ввода данных необходимо сперва объеденить значения выборок в окне настроек столбца");r=t?this.#C(e,s,o,h):this.#q(e,s,o,h)}}catch(t){return void uiControls.showError(i,t.message)}return r;function u(t){return`Выбранный тест поддерживает следующий тип данных: ${t.join(", ")}`}}#E(t,e,s,n){let a,i,r,l;const o=Math.getZAlpha(this.#h,t),h=Math.getZ(o,e);"manual"===this.#o?(a=this.#r.student.x,i=this.#r.student.y,r=this.#r.student.varX,l=this.#r.student.varY):(a=Math.mean(s),i=Math.mean(n),r=Math.var.s(s),l=Math.var.s(n),this.#r.student.x=a,this.#r.student.y=i,this.#r.student.varX=r,this.#r.student.varY=l),this.#r.z=h;const u=(h*Math.sqrt(r+l)/(i-a))**2+o**2/2,d=2*Math.ceil(u);if(void 0===d||"number"!=typeof d)throw new Error("Ошибка расчета данных");return d}#$(t,e,s,n){let a,i,r,l;const o=Math.getZAlpha(this.#h,t);"manual"===this.#o?(a=this.#r.student.x,i=this.#r.student.y,r=this.#r.student.varX,l=this.#r.student.varY):(a=Math.mean(s),i=Math.mean(n),r=Math.var.s(s),l=Math.var.s(n),this.#r.student.x=a,this.#r.student.y=i,this.#r.student.varX=r,this.#r.student.varY=l);let h=Math.sqrt((e-o**2)/2)*(i-a)/Math.sqrt(r+l);h>0&&(h*=-1),this.#r.z=h;const u=h-o,d=100-Math.normdist(u);if(void 0===d||"number"!=typeof d)throw new Error("Ошибка расчета данных");return d}#M(t,e,s,n){let a,i,r;const l=Math.getZAlpha(this.#h,t),o=Math.getZ(l,e);if("manual"===this.#o)i=this.#r.fisher.p1,r=this.#r.fisher.p2;else{const t=this.#u.first,e="data-input-two"===this.#o?this.#u.second:t,a=this.#I(s,n,t,e);i=a[0]/s.length,r=a[1]/n.length,this.#r.fisher.p1=i,this.#r.fisher.p2=r}a=(i+r)/2,this.#r.z=o,this.#r.fisher.p0=a;const h=o**2*a*(1-a)/(2*(i-a)**2),u=2*Math.ceil(h);if(void 0===h||"number"!=typeof h)throw new Error("Ошибка расчета данных");return u}#N(t,e,s,n){let a,i,r;const l=Math.getZAlpha(this.#h,t);if("manual"===this.#o)i=this.#r.fisher.p1,r=this.#r.fisher.p2;else{const t=this.#u.first,e="data-input-two"===this.#o?this.#u.second:t,a=this.#I(s,n,t,e);i=a[0]/s.length,r=a[1]/n.length,this.#r.fisher.p1=i,this.#r.fisher.p2=r}a=(i+r)/2,this.#r.fisher.p0=a;let o=Math.sqrt(e*(i-a)**2/(a*(1-a)));o>0&&(o*=-1),this.#r.z=o;const h=o-l,u=100-Math.normdist(h);if(void 0===u||"number"!=typeof u)throw new Error("Ошибка расчета данных");return u}#I(t,e,s,n){const a=[0,0];let i,r;return i=o(t,s),r=o(e,n),l(i,0),l(r,1),a;function l(t,e){t.forEach((t=>{1===t&&a[e]++}))}function o(t,e){return t.map((t=>{const s=e.isValInZeroGroup(t);if(-1===s)throw new Error("Ошибка вычислений");return s}))}}#q(t,e,s,n){let a;const i=Math.getZAlpha(this.#h,t),r=Math.getZ(i,e);if("manual"===this.#o)a=this.#r.mann.p;else{let t;const e=Math.getU(s,n,l.Z.prototype.getOrderOfValUnited.bind(this.#u.first)),i=s.length,r=n.length,o=i*r-e;t="left"==this.#h?o:"right"==this.#h?e:Math.min(e,o),a=t/(r*i),this.#r.mann.p=a}this.#r.z=r;const o=r**2/(6*(a-.5)**2),h=2*Math.ceil(o);if(void 0===h||"number"!=typeof h)throw new Error("Ошибка расчета данных");return h}#C(t,e,s,n){let a;const i=Math.getZAlpha(this.#h,t);if("manual"===this.#o)a=this.#r.mann.p;else{let t;const e=Math.getU(s,n,l.Z.prototype.getOrderOfValUnited.bind(this.#u.first)),i=s.length,r=n.length,o=i*r-e;t="left"==this.#h?o:"right"==this.#h?e:Math.min(e,o),a=t/(r*i),this.#r.mann.p=a}const r=e/2;let o=r**2*(a-.5)/Math.sqrt(r**3/6);o>0&&(o*=-1),this.#r.z=o;const h=o-i,u=100-Math.normdist(h);if(void 0===u||"number"!=typeof u)throw new Error("Ошибка расчета данных");return u}updateResultsHtml(t){const e=this.#d,s=t?"<p><b>Основная гипотеза</b></p>":`<p>Статистическая мощность: ${Number.resultForm(this.#i)}%</p>`;let n,a;a="manual"===this.#o?"\n            <th>\n            </th>\n            <th>\n            </th>":"data-input-two"===this.#o?"\n            <th>\n                Выборка 1\n            </th>\n            <th>\n                Выборка 2\n            </th>":"\n            <th>\n                Зависимая переменная\n            </th>\n            <th>\n                Переменная для группировки\n            </th>","student"===this.#l?n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                x&#772;\n                            </th>\n                            <th>\n                                y&#772;\n                            </th>\n                            <th>\n                                <i>Var(x)</i>\n                            </th>\n                            <th>\n                                <i>Var(y)</i>\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.student.x)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.student.y)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.student.varX)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.student.varY)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.z)}\n                            </td>\n                        </tr >\n                    </tbody >`:"fisher"===this.#l?n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                &#961;<sub>0</sub>\n                            </th>\n                            <th>\n                                &#961;<sub>1</sub>\n                            </th>\n                            <th>\n                                &#961;<sub>2</sub>\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.fisher.p0)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.fisher.p1)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.fisher.p2)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.z)}\n                            </td>\n                        </tr >\n                    </tbody >`:"mann"===this.#l&&(n=`<thead>\n                        <tr>\n                            ${a}\n                            <th>\n                                p\n                            </th>\n                            <th>\n                                z\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>\n                                ${String.resultForm(this.#u.first?.getName())}\n                            </td>\n                            <td>\n                                ${String.resultForm(this.#u.second?.getName())}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.mann.p)}\n                            </td>\n                            <td>\n                                ${Number.resultForm(this.#r.z)}\n                            </td>\n                        </tr >\n                    </tbody >`);const i=`\n        <h2 class="results__header">${e}</h2>\n        <div class="results__block-inner">\n            ${s}\n            <p>Сравнение независимых выборок</p>\n            <p>${o.testText[this.#l]}</p>\n            ${o.altHypText[this.#h]}\n            <table class="results__table">\n                <caption><small>${"manual"===this.#o?"Данные введены вручную":""}</small>\n                </caption>\n                ${n}\n            </table >\n        </div > `;this.#f.innerHTML=i}changeVisibilityResultsHtml(t){this.#f.style.display=t?"none":""}}}}]);