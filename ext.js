var extmain = null;
var tohtmltmp = null;

function extmain(){
    extmain = tohtml('<div class="extmain"></div>', false, true);
    var extrajs = tohtml('<script class="extmain"></script>', true);
    var extracss = tohtml('<style class="extmain"></style>', true);
    tohtml('<div class="minimized"></div>', true);
    
    function xchange(e, i){ console.log('xchange', arguments, e, i); }
    
    toinput({type:'number', max:100, min:0, step:0.1, label: 'x', onChange: xchange}, true);
    toinput({type:'number', max:100, min:0, step:0.1, label: 'y', onChange: ychange}, true);
    toinput({type:'textarea', label: 'all pages js', onChange: alljschange}, true);
    toinput({type:'textarea', label: 'all pages css', onChange: allcsschange}, true);
    toinput({type:'textarea', label: location.host + ' js', onChange: pagejschange}, true);
    toinput({type:'textarea', label: location.host + ' css', onChange: pagecsschange}, true);
    let reqjq = get('jq');
    let reqjqui = get('jqui');
    let req = { jq:!!get('jq'), jqui:!!get('jqui')};
    function checkallreqloaded(){
        for( let key in req) { if(!req) return false; }
        // true;
        // load user scripts
        
        return true;
    }
    if (req.jq) injectjs('//code.jquery.com/jquery-3.6.1.min.js', () => { req.jq=false; checkallreqloaded()});
    if (req.jqui) injectjs('https://code.jquery.com/ui/1.13.2/jquery-ui.min.js');
    
    
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
    tohtmltmp || document.createElement('div');
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
    return tohtml("<label class="inputlabel"><" + obj.tag + " " + Object.entries(obj).map(pair => pair[0] + '="' + pair[0] + '"').join(" ") + ">" + obj.value + "</" + obj.tag+'><span>' + obj.label + '</span></label>');
}

// DOMContentLoaded = dom is ready
// load = dom is ready & css js img... are loaded

document.addEventListener("DOMContentLoaded", extmain);
