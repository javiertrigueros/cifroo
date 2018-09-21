/**
 * Arquematics Utils. Utilidades varias
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2017
 * Licensed under the MIT license.
 * 
 * dependencias:
 */
var arquematics = (function (arquematics, $, Tautologistics) {

arquematics.htmlParser = {
   toHtml: function (jsonString)
   {
      // "license": "BSD-3-Clause",
      // htmlparser-to-html
      // https://github.com/mixu/htmlparser-to-html.git
       
       var emptyTags = {
        "area": 1,
        "base": 1,
        "basefont": 1,
        "br": 1,
        "col": 1,
        "frame": 1,
        "hr": 1,
        "img": 1,
        "input": 1,
        "isindex": 1,
        "link": 1,
        "meta": 1,
        "param": 1,
        "embed": 1,
        "?xml": 1
        };

        var ampRe = /&/g,
            looseAmpRe = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,
            ltRe = /</g,
            gtRe = />/g,
            quotRe = /\"/g,
            eqRe = /\=/g;

        var config = {
            disableAttribEscape: false
        };

function escapeAttrib(s) {
  if (config.disableAttribEscape === true)
    return s.toString();

  // null or undefined
  if(s == null) { return ''; }
  if(s.toString && typeof s.toString == 'function') {
    // Escaping '=' defangs many UTF-7 and SGML short-tag attacks.
    return s.toString().replace(ampRe, '&amp;').replace(ltRe, '&lt;').replace(gtRe, '&gt;')
            .replace(quotRe, '&#34;').replace(eqRe, '&#61;');
  } else {
    return '';
  }
}

var html = function(item, parent, eachFn) {
  // apply recursively to arrays
  if(Array.isArray(item)) {
    return item.map(function(subitem) {
      // parent, not item: the parent of an array item is not the array,
      // but rather the element that contained the array
      return html(subitem, parent, eachFn);
    }).join('');
  }
  var orig = item;
  if(eachFn) {
    item = eachFn(item, parent);
  }
  if(typeof item != 'undefined' && typeof item.type != 'undefined') {
    switch(item.type) {
      case 'text':
        return item.data;
      case 'directive':
        return '<'+item.data+'>';
      case 'comment':
        return '<!--'+item.data+'-->';
      case 'style':
      case 'script':
      case 'tag':
        var result = '<'+item.name;
        if(item.attribs && Object.keys(item.attribs).length > 0) {
          result += ' '+Object.keys(item.attribs).map(function(key){
                  return key + '="'+escapeAttrib(item.attribs[key])+'"';
                }).join(' ');
        }
        if(item.children) {
          // parent becomes the current element
          // check if the current item (before any eachFns are run) - is a renderable
          if(!orig.render) {
            orig = parent;
          }
          result += '>'+html(item.children, orig, eachFn)+(emptyTags[item.name] ? '' : '</'+item.name+'>');
        } else {
          if(emptyTags[item.name]) {
            result += '>';
          } else {
            result += '></'+item.name+'>';
          }
        }
        return result;
      case 'cdata':
        return '<!CDATA['+item.data+']]>';
    }
  }
  return item;
};

    html.configure = function (userConfig) {
        if(userConfig !== undefined) {
            for (k in config) {
                if (userConfig[k] !== undefined){
                    config[k] = userConfig[k];
                }
            }
        }
    };

     return  html(jsonString);
   },

   parse: function(html)
   {
        function inherits (ctor, superCtor)
        {
            var tempCtor = function(){};
            tempCtor.prototype = superCtor.prototype;
            ctor.super_ = superCtor;
            ctor.prototype = new tempCtor();
            ctor.prototype.constructor = ctor;
        }
        
        var cleanText=function(txt,nlO)
        {
            //MS Office generated
            txt = txt.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, '');
        
            txt = $.trim(txt);
       
            var out ='';
            //clean classes
            var sS=/(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
            out=txt.replace(sS,' ');
            //cosas de word
            out = out.replace(/<a\s*name=\s*["'].*DdeLink.*["']>([\S\s]*)<\/a>/g, '');
            
            out = out.replace(/\>[\s]+\</g, '><');
            //out = out.replace( new RegExp( "\>[\s]+\<" , "g" ) , "><" );
            
            var nL=/(\n)+/g;
            out=out.replace(nL,'<br>');
            
            var cS=new RegExp('<!--(.*?)-->','gi');
            out=out.replace(cS,'');
            var tS=new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
            out=out.replace(tS,'');
            
            // end 
            //ban tags MS Office generated
            var bT=  ['img','iframe','style', 'script','applet','embed','noframes','noscript'];
            for(var i=0;i<bT.length;i++)
            {
                tS=new RegExp('<'+bT[i]+'.*?'+bT[i]+'(.*?)>','gi');
                out=out.replace(tS,'');
            }
          
            //keep tags
            var allowedTags = ['<p>', '<br>', '<ul>', '<li>', '<b>', '<strong>','<i>', '<a>'];
            if(allowedTags.length > 0)
            {
                allowedTags = (((allowedTags || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
                out = out.replace(tags, function ($0, $1) {
                    return allowedTags.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
            }
            
            
            
            //ban attributes
            var bA = ['style', 'start'];
            for(var ii=0;ii<bA.length;ii++)
            {
                //var aS=new RegExp(' ('+bA[ii]+'="(.*?)")|('+bA[ii]+'=\'(.*?)\')','gi');
                var aS=new RegExp(' '+bA[ii]+'=[\'|"](.*?)[\'|"]','gi');
                out=out.replace(aS,'');
            }
            
            return out;
      };
      
        console.log('html');
        console.log(html);
        html = cleanText(html);
        console.log('html');
        console.log(html);
        
        var Mode = Tautologistics.NodeHtmlParser.ElementType;
        
        function ClipBoardPasteBuilder (callback) {
            ClipBoardPasteBuilder.super_.call(this, callback, 
                                {removeAttr: true,
                                ignoreWhitespace: true,
                                verbose: false,
                                enforceEmptyTags: false,
                                caseSensitiveTags: true });
        }
        inherits(ClipBoardPasteBuilder, Tautologistics.NodeHtmlParser.HtmlBuilder);


        ClipBoardPasteBuilder.prototype.write = function (element)
        {
            // this._raw.push(element);
            if (this._done) {
                this.handleCallback(new Error("Writing to the builder after done() called is not allowed without a reset()"));
            }
            if (this._options.includeLocation) {
                if (element.type !== Mode.Attr) {
                    element.location = this._getLocation();
                    this._updateLocation(element);
                }
            }
        if (element.type === Mode.Text && this._options.ignoreWhitespace) {
            if (ClipBoardPasteBuilder.super_.reWhitespace.test(element.data)) {
                return;
            }
        }
        var parent;
        var node;
        if (!this._tagStack.last()) { //There are no parent elements
            //If the element can be a container, add it to the tag stack and the top level list
            if (element.type === Mode.Tag)
            {
                //Ignore closing tags that obviously don't have an opening tag
                if (element.name.charAt(0) != "/") { 
                    node = this._copyElement(element);
                    this.dom.push(node);
                    if (!this.isEmptyTag(node)) { //Don't add tags to the tag stack that can't have children
                        this._tagStack.push(node);
                    }
                    this._lastTag = node;
                }
            } 
            else if (element.type === Mode.Attr && this._lastTag)
            {
                if (!this._options.removeAttr)
                {
                   if (!this._lastTag.attributes) 
                   {
                    this._lastTag.attributes = {};
                   }
                   this._lastTag.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = element.data;         
                }
            } else { //Otherwise just add to the top level list
                this.dom.push(this._copyElement(element));
            }
        } else { //There are parent elements
            //If the element can be a container, add it as a child of the element
            //on top of the tag stack and then add it to the tag stack
            if (element.type === Mode.Tag) {
                if (element.name.charAt(0) == "/") {
                    //This is a closing tag, scan the tagStack to find the matching opening tag
                    //and pop the stack up to the opening tag's parent
                    var baseName = this._options.caseSensitiveTags ?
                        element.name.substring(1)
                        :
                        element.name.substring(1).toLowerCase()
                        ;
                    if (!this.isEmptyTag(element)) {
                        var pos = this._tagStack.length - 1;
                        while (pos > -1 && this._tagStack[pos--].name != baseName) { }
                        if (pos > -1 || this._tagStack[0].name == baseName) {
                            while (pos < this._tagStack.length - 1) {
                                this._tagStack.pop();
                            }
                        }
                    }
                }
                else { //This is not a closing tag
                    parent = this._tagStack.last();
                    if (element.type === Mode.Attr) 
                    {
                        if (!this._options.removeAttr)
                        {
                           if (!parent.attributes) {
                            parent.attributes = {};
                           }
                           parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = element.data; 
                        }
                    } else {
                        node = this._copyElement(element);
                        if (!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(node);
                        if (!this.isEmptyTag(node)) { //Don't add tags to the tag stack that can't have children
                            this._tagStack.push(node);
                        }
                        if (element.type === Mode.Tag) {
                            this._lastTag = node;
                        }
                    }
                }
            }
            else { //This is not a container element
                parent = this._tagStack.last();
                if (element.type === Mode.Attr)
                {
                    if (!this._options.removeAttr)
                    {
                      if (!parent.attributes) {
                        parent.attributes = {};
                      }
                      parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = element.data;      
                    }
                } else {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(this._copyElement(element));
                }
            }
            }
        };

        ClipBoardPasteBuilder.prototype.done = function () {

            var html = Tautologistics.NodeHtmlParser.DomUtils.getElementsByTagName(function (value) { 
                return (value == "html"); 
            }, this.dom, false);
            
            //puede ser contenido pegado
            // de word, openoffice ...
            if ((html.length > 0)
                && (html[0].children.length > 0)
                && (html[0].children[1].children.length > 0)) {
             
              // var head = html[0].children[0];
              // var body = html[0].children[1];
               //contenido de body
               this.dom = html[0].children[1].children;
               
            }
            else
            {
                this._done = false;
            }
            
            ClipBoardPasteBuilder.super_.prototype.done.call(this);
           
        };
       
       
        var handler = new ClipBoardPasteBuilder(function(err, dom) 
        {
            if (err) {
                console.log('err');
		console.log(err);
            }
            else {
                console.log('dom');
		//console.log($(dom).html());
            }
        });
       
        var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
        parser.parseComplete(html);
        
        //return JSON.stringify(handler.dom, null, 2);
        return arquematics.htmlParser.toHtml(handler.dom);
   }
};

return arquematics;
    
}( arquematics || {}, jQuery, Tautologistics));