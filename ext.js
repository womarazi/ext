var extmain = null;
var tohtmltmp = null;
console.warn('extmain load 3');
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
    extmain = tohtml('<div class="extmain"></div>', false, true);
    var extrajs = tohtml('<script class="extmain"></script>', true);
    var extracss = tohtml('<style class="extmain"></style>', true);
    tohtml('<div class="minimized"></div>', true);
    
    
    let xval = get('x');
    let yval = get('y');
    if (isNaN(xval)) xval = 5;
    if (isNaN(yval)) yval = 5;

    tohtml('<div class="extrow">' +
        toinput({type:'number', max:100, min:0, step:0.1, label: 'x', key: "ext_x", defaultvalue: xval}).outerHTML +
        toinput({type:'number', max:100, min:0, step:0.1, label: 'y', key: "ext_y", defaultvalue: yval}).outerHTML + "</div>", true);

    tohtml('<div class="extrow">'
           + toinput({type:'checkbox', label: 'jquery', onChange: jquerycheck}).outerHTML +
           toinput({type:'checkbox', label: 'jqueryui', onChange: jqueryuicheck}).outerHTML + "</div>", true);
    
    
    tohtml('<div class="extrow">' +
        toinput({type:'textarea', label: 'all pages js', onChange: 'universaljs'}).outerHTML +
        toinput({type:'textarea', label: 'all pages css', onChange: 'universalcss'}).outerHTML + "</div>", true);

    tohtml('<div class="extrow">' +
        toinput({type:'textarea', label: location.host + ' js', key: 'pagejs'}).outerHTML +
        toinput({type:'textarea', label: location.host + ' css', key: 'pagecss'}).outerHTML + "</div>", true);

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
    
    
}

function injectjs(src, callback = () => {}) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = src; //"//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
  script.onload = function() {
    if(callback) callback();
    // $("p").css("border", "3px solid red");
  };
  head.appendChild(script);
}

function tohtml(str, appendextmain=false, appendbody = false){
    tohtmltmp = tohtmltmp || document.createElement('div');
    tohtmltmp.innerHTML = str;
    let ret= tohtmltmp.childNodes[0];
    if(appendbody) document.body.append(ret);
    if(appendextmain) extmain.append(ret);
    return ret;
}
function toinput(obj/*{min, max, step, type, tag, label...}*/){
    if (!obj) obj = {}
    obj.tag = obj.tag || 'input';
    obj.type = obj.type || 'string';
    obj.label = obj.label || '';
    console.log( Object.entries(obj));
    
    if (obj.value === undefined){
        if (obj.key) obj.value = get(obj.key);
        if (!obj.value) obj.value = obj.defaultvalue; }
    try { obj.value = JSON.stringify(obj.value) } catch(e){}
    if (!obj.value) obj.value = '';

    obj.onchange = function inputchange(e){ let input = e.target; set(input.getAttribute("key"), input.value); }

    return tohtml("<label class='inputlabel'><" + obj.tag + " " + Object.entries(obj).map(pair => pair[0] + '="' + pair[1] + '"').join(" ") + ">"
                  + obj.value + "</" + obj.tag+'><span>' + obj.label + '</span></label>');
}

// DOMContentLoaded = dom is ready
// load = dom is ready & css js img... are loaded

document.addEventListener("DOMContentLoaded", extmainstart);
