function extract_css_selector(target){
  var nodes, classList, c, d, cs, i;
  var base, elem;
  var selectors = '';

  base = document.body;
  elem = target;

  function css_ident(str){
    return str.replace(/[^a-zA-Z0-9\xa0-\uffff]/g, '\\$&');
  }

  GAP: while( base !== target ){
    if( elem.id ){
      nodes = base.querySelectorAll('#' + css_ident(elem.id));
      if( nodes.length===1 ){
        selectors += ' #' + css_ident(elem.id);
        base = elem;
        elem = target;
        continue GAP;
      }
    }

    if( elem.name ){
      nodes = base.querySelectorAll('[name="' + elem.name.replace(/(["\\])/g, '\\$1') + '"]');
      if( nodes.length===1 ){
        selectors += ' [name="' + elem.name.replace(/(["\\])/g, '\\$1') + '"]';
        base = elem;
        elem = target;
        continue GAP;
      }
    }

    cs = elem.classList;
    for(i=0; i<cs.length; ++i){
      c = css_ident(cs[i]);
      nodes = base.querySelectorAll('.' + c);
      if( nodes.length===1 ){
        selectors += ' .' + c;
        base = elem;
        elem = target;
        continue GAP;
      }
    }
    for(i=0; i<cs.length; ++i){
      c = css_ident(cs[i]);
      nodes = base.querySelectorAll(elem.nodeName + '.' + c);
      if( nodes.length===1 ){
        selectors += ' ' + elem.nodeName + '.' + c;
        base = elem;
        elem = target;
        continue GAP;
      }
    }

    if( elem.parentNode === base ){
      cs = elem.parentNode.children;
      c = 1; d = 0;
      for(i=0; i<cs.length; ++i){
        if( cs[i] === elem ){
          for(++i; i<cs.length; ++i){
            if( cs[i].nodeName === elem.nodeName )
              ++d;
          }
          break;
        }
        if( cs[i].nodeName === elem.nodeName )
          ++c;
      }
      if( c===1 && d===0 )
        selectors += '>' + elem.nodeName;
      else if( c===1 )
        selectors += '>' + elem.nodeName + ':first-of-type';
      else if( d===0 )
        selectors += '>' + elem.nodeName + ':last-of-type';
      else
        selectors += '>' + elem.nodeName + ':nth-of-type(' + c + ')';
      base = elem;
      elem = target;
      continue GAP;
    }

    elem = elem.parentNode;
  }

  return selectors.substr(1);
}
