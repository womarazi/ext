function extmain(){
    extmain = tohtml('<div class="extmain"></div>', false, true);
    tohtml('<div class="minimized"></div>', true);
    function xchange(e, i){ console.log('xchange', arguments, e, i); }
    
    toinput({type:'number', max:100, min:0, step:0.1, label: 'x', onChange: xchange}, true);
    toinput({type:'number', max:100, min:0, step:0.1, label: 'y', onChange: ychange}, true);
    toinput({type:'textarea', label: 'all pages js', onChange: alljschange}, true);
    toinput({type:'textarea', label: 'all pages css', onChange: allcsschange}, true);
    toinput({type:'textarea', label: location.host + ' js', onChange: pagejschange}, true);
    toinput({type:'textarea', label: location.host + ' css', onChange: pagecsschange}, true);
    
}

var extmain = null;
var tohtmltmp=null;
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
