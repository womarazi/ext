var extmain = null;
var tohtmltmp = null;
console.warn('extmain load 5');
let _extjs_hasExecuted = false;
function jschanged(prefix, val){
    injectjscss({key: prefix, innerHTML: val, type:'script', type2:"text/javascript"}});
}
function csschanged(prefix, val){
    injectjscss({key: prefix, innerHTML: val, type:'link', type2:"text/css", rel='stylesheet'}});

}
function set(key, val){
    if (!key) return;
    try { val =JSON.stringify(val); } catch(e){}
    localStorage.setItem('_ext_' + key, val); }
function get(key){
    if (!key) return undefined;
    let ret = localStorage.getItem('_ext_' + key);             
    try { ret = JSON.parse(ret); } catch(e){}
    return ret; }

function extmainstart(){
    if (document.body && _extjs_hasExecuted) return;
    _extjs_hasExecuted = true;
    extmain = tohtml('<div class="extmain"></div>', false, true);
    var extrajs = tohtml('<script class="extmain"></script>', true);
    var extracss = tohtml('<style class="extmain"></style>', true);
    tohtml('<div class="minimized"></div>', true);
    
    
    let xval = get('x');
    let yval = get('y');
    if (xval === null || xval === undefined || isNaN(+xval)) xval = 5; else xval = +xval;
    if (yval === null || yval === undefined || isNaN(+yval)) yval = 5; else xval = +xval;

    tohtml('<div class="extrow">' +
        toinput({type:'number', max:100, min:0, step:0.1, label: 'x', key: "ext_x", defaultvalue: xval}).outerHTML +
        toinput({type:'number', max:100, min:0, step:0.1, label: 'y', key: "ext_y", defaultvalue: yval}).outerHTML + "</div>", true);

    tohtml('<div class="extrow">'
           + toinput({type:'checkbox', label: 'jquery', key: "jquerycheck", defaultvalue: true}).outerHTML +
           toinput({type:'checkbox', label: 'jqueryui', key: "jqueryuicheck", defaultvalue: false}).outerHTML + "</div>", true);
    


    tohtml('<div class="extrow fill">' +
        toinput({type:'textarea', label: location.host + ' js', key: 'pagejs', onchange2: (val)=>jschanged('pagejs', val)}).outerHTML +
        toinput({type:'textarea', label: location.host + ' css', key: 'pagecss', onchange2: (val)=>csschanged('pagecss', val)}).outerHTML + "</div>", true);
    tohtml('<div class="extrow fill">' +
        toinput({type:'textarea', label: 'all pages js', key: 'universaljs', onchange2: (val)=>jschanged('universaljs', val)}).outerHTML +
        toinput({type:'textarea', label: 'all pages css', key: 'universalcss', onchange2: (val)=>csschanged('universalcss', val)}).outerHTML + "</div>", true);

    let req = { jq:!!get('jq'), jqui:!!get('jqui')};
    function checkallreqloaded(){
        for( let key in req) { if(!req) return false; }
        // true;
        loaduserscripts();
        return true;
    }
    function loaduserscripts() {}
    if (req.jq) injectjs('//code.jquery.com/jquery-3.6.1.min.js', () => { req.jq=false; checkallreqloaded(); });
    if (req.jqui) injectjs('https://code.jquery.com/ui/1.13.2/jquery-ui.min.js',  () => { req.jqui=false; checkallreqloaded(); });
    
    
}/* cannot be used without key, or it would make duplicate scripts/css files. use the _0 version directly.

function injectcss_inline(code, callback = () => {}) { return injectjscss_0({innerHTML:code, type:'link', type2:"text/css", rel:'stylesheet'}, callback); }

function injectjs_inline(code, callback = () => {}) { return injectjscss_0({innerHTML:code, type:'script', type2:"text/javascript"}, callback); }*/

function injectjs(src, callback = () => {}) { return injectjscss_src(...arguments); }

function injectjs_src(src, callback = () => {}) { return injectjscss_0({src, type:'script', type2:"text/javascript"}, callback); }

function injectjscss_0(props, callback = () => {}) {
  var script;
  if (props.key) script = document.querySelector('#_ext_js_'+key);
  if (!script) {
      script = document.createElement(props.type);
      if (props.key) script.setAttribute('id', '#_ext_js_'+props.key);
      if (props.src) script.setAttribute('src', props.src); //"//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
      if (props.href) script.setAttribute('href', props.href);
      if (props.type2) script.setAttribute('type', props.type2);
      if (props.rel) script.setAttribute('rel', props.rel);
  }
  if (props.innerHTML) script.innerHTML = props.innerHTML;
  
  script.onload = function() { // todo: what if it's already loaded? should i recall the main? like when his code it's updated at runtime.
    if (callback) callback();
      main();
    // $("p").css("border", "3px solid red");
  };
  if (body) script.text = props.innerHTML;
  console.log("injected js script", {src, body, callback});
  document.head.appendChild(script);
}

function tohtml(str, appendextmain=false, appendbody = false){
    tohtmltmp = tohtmltmp || document.createElement('div');
    tohtmltmp.innerHTML = str;
    let ret = tohtmltmp.childNodes[0];
    if(appendbody) document.body.append(ret);
    if(appendextmain) extmain.append(ret);
    return ret;
}
function extjs_inputchange(thiss){
    console.warn("extjs_inputchange", {key:input.getAttribute("key"), val: input.value, thiss});
    let input = thiss;
    let key = input.getAttribute("key");
    let inputobj = inputdata[key];
    set(key, input.value);
    if (inputobj.onchange2) inputobj.onchange2(key, input.value);
}
function extjs_checkboxchange(thiss){
    console.warn("extjs_checkboxchange", thiss);
    let input = thiss;
    set(input.getAttribute("key"), input.checked); }
var inputdata = {}; // map input key, options
//let inputid = 0;


function toinput(obj/*{min, max, step, type, tag, label...}*/){
    if (!obj) obj = {}
    obj.tag = obj.tag || 'input';
    obj.type = obj.type || 'string';
    obj.label = obj.label || '';
    if (!obj.key) console.error('input key is mandatory');
    inputdata[obj.key] = obj;
    console.log(Object.entries(obj));
    
    if (obj.value === undefined){
        if (obj.key) obj.value = get(obj.key);
        if (!obj.value) obj.value = obj.defaultvalue; }
    try { obj.value = JSON.stringify(obj.value) } catch(e){}
    if (!obj.value) obj.value = '';


    let innertext = '';
    obj.onchangefake = "extjs_inputchange(this, " + obj.inputid + ")";
    obj.onchange = "extjs_inputchange(this" + obj.inputid + ")";
    switch(obj.type){
        default: break;
        case "checkbox":
            if (obj.checked === undefined) obj.checked = obj.value === 'true';
            // not use obj.defaultvalue?
            delete obj.value;

            obj.onchangefake = "extjs_checkboxchange(this)";
            obj.onchange = "extjs_checkboxchange(this)";
            break;
        case 'textarea':
        case 'div':
        case 'input': obj.tag = obj.type; delete obj.type; break; }
    switch(obj.tag){
        default:
        case 'div': innertext = obj.value; obj.contenteditable=true; break;
        case 'textarea': innertext = obj.value; break;
        case 'input': innertext = ''; break; }
    

    let htmlel = tohtml("<label class='inputlabel' class='" + (obj.tag === "input" ? "" : "fillheight") + "'>" +
                  "<" + obj.tag + " " + Object.entries(obj).map(pair => pair[0] + '="' + pair[1] + '"').join(" ") + ">" +
                  (innertext) +
                  "</" + obj.tag+'><span>' + obj.label + '</span>'+
                  '</label>');
    // htmlel.onchange=extjs_inputchange;
    return htmlel;
}

// DOMContentLoaded = dom is ready
// load = dom is ready & css js img...  are loaded
function ifpageloaded(callback, checktime = 300) {
    if (document.readyState === 'ready' || document.readyState === 'complete') {
    callback();
  } else setTimeout( () => ifpageloaded(callback, checktime), checktime);
}


// document.addEventListener("DOMContentLoaded", extmainstart); // won't unclude case if page is already loaded

ifpageloaded(extmainstart)
