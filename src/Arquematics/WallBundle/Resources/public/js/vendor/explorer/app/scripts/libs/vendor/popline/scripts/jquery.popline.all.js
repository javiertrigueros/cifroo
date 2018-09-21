/*
  jquery.popline.js 1.0.0

  Version: 1.0.0

  jquery.popline.js is an open source project, contribute at GitHub:
  https://github.com/kenshin54/popline.js

  (c) 2014 by kenshin54
*/

;(function($) {

  var LEFT = -2, UP = -1, RIGHT = 2, DOWN = 1, NONE = 0, ENTER = 13;

  var isIMEMode = false;
  $(document).on('compositionstart', function(event) {
    isIMEMode = true;
  });
  $(document).on('compositionend', function(event) {
    isIMEMode = false;
  });

  var toggleBox = function(event) {
    if ($.popline.utils.isNull($.popline.current)) {
      return;
    }
    // var isTargetOrChild = $.contains($.popline.current.target.get(0), event.target) || $.popline.current.target.get(0) === event.target;
    // var isBarOrChild = $.contains($.popline.current.bar.get(0), event.target) || $.popline.current.bar.get(0) === event.target;
    // TODO disable check multiple popline check
    if ($.popline.utils.selection().text().length > 0 && !$.popline.current.keepSilentWhenBlankSelected()) {
      var target= $.popline.current.target, bar = $.popline.current.bar;
      if (bar.is(":hidden") || bar.is(":animated")) {
        bar.stop(true, true);
        var pos = Position().mouseup(event);
        $.popline.current.show(pos);
      }
    }else {
      $.popline.hideAllBar();
    }
  };

  var targetEvent = {
    mousedown: function(event) {
      $.popline.current = $(this).data("popline");
      $.popline.hideAllBar();
    },
    keyup: function(event) {
      var popline = $(this).data("popline"), bar = popline.bar;
      if (!isIMEMode && $.popline.utils.selection().text().length > 0 && !popline.keepSilentWhenBlankSelected()) {
        var pos = Position().keyup(event);
        $.popline.current.show(pos);
      }else {
        $.popline.current.hide();
      }
    },
    keydown: function(event) {
      $.popline.current = $(this).data("popline");
      var text = $.popline.utils.selection().text();
      if (!$.popline.utils.isNull(text) && $.trim(text) !== "") {
        var rects = $.popline.utils.selection().range().getClientRects();
        if (rects.length > 0) {
          $(this).data('lastKeyPos', $.popline.boundingRect());
        }
      }
    }
  }

  var Position = function() {
    var target= $.popline.current.target, bar = $.popline.current.bar, positionType = $.popline.current.settings.position;

    var positions = {
      "fixed": {
        mouseup: function(event) {
          var rect = $.popline.utils.selection().range().getBoundingClientRect();
          var left = event.pageX - bar.width() / 2;
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          if (left < 0) left = 10;
          var top = scrollTop + rect.top - bar.outerHeight() - 10;
          return {left: left, top: top};
        },
        keyup: function(event) {
          var left = null, top = null;
          var rect = $.popline.getRect(), keyMoved = $.popline.current.isKeyMove();
          if (keyMoved === DOWN || keyMoved === RIGHT) {
            left = rect.right - bar.width() / 2;
          }else if (keyMoved === UP || keyMoved === LEFT) {
            left = rect.left - bar.width() / 2;
          }
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          top = scrollTop + rect.top - bar.outerHeight() - 10;
          return {left: left, top: top};
        }
      },
      "relative": {
        mouseup: function(event) {
          var left = event.pageX - bar.width() / 2;
          if (left < 0) left = 10;
          var top = event.pageY - bar.outerHeight() - parseInt(target.css('font-size')) / 2;
          return {left: left, top: top};
        },
        keyup: function(event) {
          var left = null, top = null;
          var rect = $.popline.getRect(), keyMoved = $.popline.current.isKeyMove();
          if (keyMoved === DOWN || keyMoved === RIGHT) {
            left = rect.right - bar.width() / 2;
            top = $(document).scrollTop() + rect.bottom - bar.outerHeight() - parseInt(target.css("font-size"));
          }else if (keyMoved === UP || keyMoved === LEFT) {
            left = rect.left - bar.width() / 2;
            top = $(document).scrollTop() + rect.top - bar.outerHeight();
          }
          return {left: left, top: top};
        }
      }
    };

    return positions[positionType];
  };

  $.fn.popline = function(options) {

    if ($.popline.utils.browser.ieLtIE8()) {
      return;
    }

    _arguments = arguments;
    this.each(function() {
      if (_arguments.length >= 1 && typeof(_arguments[0]) === "string" && $(this).data("popline")) {
        var func = $(this).data("popline")[_arguments[0]];
        if (typeof(func) === "function") {
          func.apply($(this).data("popline"), Array.prototype.slice.call(_arguments, 1));
        }
      }else if (!$(this).data("popline")) {
        var popline = new $.popline(options, this);
      }
    });

    if (!$(document).data("popline-global-binded")) {
      $(document).mouseup(function(event){
        var _this = this;
        setTimeout((function(){
          toggleBox.call(_this, event);
        }), 1);
      });
      $(document).data("popline-global-binded", true);
    }
  };

  $.popline = function(options, target) {
    this.settings = $.extend(true, {}, $.popline.defaults, options);
    this.setPosition(this.settings.position);
    this.target = $(target);
    this.init();
    
    console.log('$.popline');
    
    $.popline.addInstance(this);
  };

  $.extend($.popline, {

    defaults: {
      zIndex: 9999,
      mode: "edit",
      enable: null,
      disable: null,
      position: "fixed",
      keepSilentWhenBlankSelected: true
    },

    instances: [],

    current: null,

    prototype: {
      init: function() {
        this.bar = $("<ul class='popline' style='z-index:" + this.settings.zIndex + "'></ul>").appendTo("body");
        this.bar.data("popline", this);
        this.target.data("popline", this);
        var me = this;

        var isEnable = function(array, name) {
          if (array === null) {
            return true;
          }
          for (var i = 0, l = array.length; i < l; i++) {
            var v = array[i];
            if (typeof(v) === "string" && name === v) {
              return true;
            }else if ($.isArray(v)) {
              if (isEnable(v, name)) {
                return true;
              }
            }
          }
          return false;
        }


        var isDisable = function(array, name) {
          if (array === null) {
            return false;
          }
          for (var i = 0, l = array.length; i < l; i++) {
            var v = array[i];
            if (typeof(v) === "string" && name === v) {
              return true;
            }else if ($.isArray(v)) {
              if ((v.length === 1 || !$.isArray(v[1])) && isDisable(v, name)) {
                return true;
              }else if (isDisable(v.slice(1), name)) {
                return true;
              }
            }
          }
          return false;
        }

        var makeButtons = function(parent, buttons) {
          for (var name in buttons) {
            var button = buttons[name];
            var mode = $.popline.utils.isNull(button.mode) ? $.popline.defaults.mode : button.mode;

            if (mode !== me.settings.mode
                || !isEnable(this.settings.enable, name)
                || isDisable(this.settings.disable, name)) {
              continue;
            }
            var $button = $("<li><span class='popline-btn'></span></li>");

            $button.addClass("popline-button popline-" + name + "-button")

            if (button.iconClass) {
               $button.children(".popline-btn").append("<a class='" + button.iconClass + "' href='javascript:void(0);'></a>");
            }

            if (button.text) {
              $button.children(".popline-btn").append("<a href='javascript:void(0);'><span class='popline-text popline-background-fix'>" + button.text + "</span></a>");
            }

            if (button.bgColor) {
              $button.css({'background-color': button.bgColor});
              $button.find("span.popline-text").removeClass('popline-background-fix');
            }

            if ($.isFunction(button.beforeShow)) {
              this.beforeShowCallbacks.push({name: name, callback: button.beforeShow});
            }

            if ($.isFunction(button.afterHide)) {
              this.afterHideCallbacks.push({name: name, callback: button.afterHide});
            }

            $button.appendTo(parent);

            if (button.buttons) {
              $subbar = $("<ul class='popline-subbar'></ul>");
              $button.append($subbar);
              makeButtons.call(this, $subbar, button.buttons);
              $button.click(function(event) {
                var _this = this;
                if (!$(this).hasClass("popline-boxed")) {
                  me.switchBar($(this), function() {
                    $(_this).siblings("li").hide().end()
                         .children(".popline-btn").hide().end()
                         .children("ul").show().end()
                  });
                  event.stopPropagation();
                }
              });
            }else if($.isFunction(button.action)) {
              $button.click((function(button) {
                  return function(event) {
                    button.action.call(this, event, me);
                  }
                })(button)
              );
            }
            $button.mousedown(function(event) {
              if (!$(event.target).is("input")) {
                event.preventDefault();
              }
            });
            $button.mouseup(function(event) {
              event.stopPropagation();
            });
          }
        }

        makeButtons.call(this, this.bar, $.popline.buttons);

        this.target.bind(targetEvent);

        this.bar.on("mouseenter", "li", function(event) {
          if (!($(this).hasClass("popline-boxed"))) {
            $(this).addClass("popline-hover");
          }
          event.stopPropagation();
        });
        this.bar.on("mouseleave", "li", function(event) {
          if (!($(this).hasClass("popline-boxed"))) {
            $(this).removeClass("popline-hover");
          }
          event.stopPropagation();
        });
      },

      show: function(options) {
        for (var i = 0, l = this.beforeShowCallbacks.length; i < l; i++) {
          var obj = this.beforeShowCallbacks[i];
          var $button = this.bar.find("li.popline-" + obj.name + "-button");
          obj.callback.call($button, this);
        }
        this.bar.css('top', options.top + "px").css('left', options.left + "px").stop(true, true).fadeIn();
        if ($.popline.utils.browser.ieLtIE9()) {
          $.popline.utils.fixIE8();
        }
      },

      hide: function() {
        var _this = this;
        if (this.bar.is(":visible") && !this.bar.is(":animated")) {
          this.bar.fadeOut(function(){
            _this.bar.find("li").removeClass("popline-boxed").show();
            _this.bar.find(".popline-subbar").hide();
            _this.bar.find(".popline-textfield").hide();
            _this.bar.find(".popline-btn").show();
            for (var i = 0, l = _this.afterHideCallbacks.length; i < l; i++) {
              var obj = _this.afterHideCallbacks[i];
              var $button = _this.bar.find("li.popline-" + obj.name + "-button");
              obj.callback.call($button, _this);
            }
          });
        }
      },

      destroy: function() {
        this.target.unbind(targetEvent);
        this.target.removeData("popline");
        this.target.removeData("lastKeyPos");
        this.bar.remove();
      },

      switchBar: function(button, hideFunc, showFunc) {
        if (typeof(hideFunc) === "function") {
          var _this = this;
          var position = parseInt(_this.bar.css('left')) + _this.bar.width() / 2;
          _this.bar.animate({ opacity: 0, marginTop: -_this.bar.height() + 'px' }, function() {
            hideFunc.call(this);
            button.removeClass('popline-hover').addClass('popline-boxed').show();
            _this.bar.css("margin-top", _this.bar.height() + "px")
            _this.bar.css("left", position - _this.bar.width() / 2 + "px");
            if (typeof(showFunc) === "function") {
              _this.bar.animate({ opacity: 1, marginTop: 0 }, showFunc);
            }else {
              _this.bar.animate({ opacity: 1, marginTop: 0 });
            }
          });
        }
      },

      keepSilentWhenBlankSelected: function() {
        if (this.settings.keepSilentWhenBlankSelected && $.trim($.popline.utils.selection().text()) === ""){
          return true;
        }else {
          return false;
        }
      },

      isKeyMove: function() {
        var lastKeyPos = this.target.data('lastKeyPos');
        currentRect = $.popline.boundingRect();
        if ($.popline.utils.isNull(lastKeyPos)) {
          return null;
        }
        if (currentRect.top === lastKeyPos.top && currentRect.bottom !== lastKeyPos.bottom) {
          return DOWN;
        }
        if (currentRect.bottom === lastKeyPos.bottom && currentRect.top !== lastKeyPos.top) {
          return UP;
        }
        if (currentRect.right !== lastKeyPos.right) {
          return RIGHT;
        }
        if (currentRect.left !== lastKeyPos.left) {
          return LEFT;
        }
        return NONE;
      },

      setPosition: function(position) {
        this.settings.position = position === "relative" ? "relative" : "fixed";
      },

      beforeShowCallbacks: [],

      afterHideCallbacks: []

    },

    hideAllBar: function() {
      for (var i = 0, l = $.popline.instances.length; i < l; i++) {
        $.popline.instances[i].hide();
      }
    },

    addInstance: function(popline){
      $.popline.instances.push(popline);
    },

    boundingRect: function(rects) {
      if ($.popline.utils.isNull(rects)) {
        rects = $.popline.utils.selection().range().getClientRects();
      }
      return {
        top: parseInt(rects[0].top),
        left: parseInt(rects[0].left),
        right: parseInt(rects[rects.length -1].right),
        bottom: parseInt(rects[rects.length - 1].bottom)
      }
    },

    webkitBoundingRect: function() {
      var rects = $.popline.utils.selection().range().getClientRects();
      var wbRects = [];
      for (var i = 0, l = rects.length; i < l; i++) {
        var rect = rects[i];
        if (rect.width === 0) {
          continue;
        }else if ((i === 0 || i === rects.length - 1) && rect.width === 1) {
          continue;
        }else {
          wbRects.push(rect);
        }
      }
      return $.popline.boundingRect(wbRects);
    },

    getRect: function() {
      if ($.popline.utils.browser.firefox || $.popline.utils.browser.opera || $.popline.utils.browser.ie) {
        return $.popline.boundingRect();
      }else if ($.popline.utils.browser.chrome || $.popline.utils.browser.safari) {
        return $.popline.webkitBoundingRect();
      }
    },

    utils: {
      isNull: function(data) {
        if (typeof(data) === "undefined" || data === null) {
          return true;
        }
        return false;
      },
      randomNumber: function() {
        return Math.floor((Math.random() * 10000000) + 1);
      },
      trim: function(string) {
        return string.replace(/^\s+|\s+$/g, '');
      },
      browser: {
        chrome: navigator.userAgent.match(/chrome/i) ? true : false,
        safari: navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) ? true : false,
        firefox: navigator.userAgent.match(/firefox/i) ? true : false,
        opera: navigator.userAgent.match(/opera/i) ? true : false,
        ie: navigator.userAgent.match(/msie|trident\/.*rv:/i) ? true : false,
        webkit: navigator.userAgent.match(/webkit/i) ? true : false,
        ieVersion: function() {
          var rv = -1; // Return value assumes failure.
          var ua = navigator.userAgent;
          var re  = new RegExp("(MSIE |rv:)([0-9]{1,}[\.0-9]{0,})");
          if (re.exec(ua) !== null) {
            rv = parseFloat(RegExp.$2);
          }
          return rv;
        },
        ieLtIE8: function() {
          return $.popline.utils.browser.ie && $.popline.utils.browser.ieVersion() < 8;
        },
        ieLtIE9: function() {
          return $.popline.utils.browser.ie && $.popline.utils.browser.ieVersion() < 9;
        }
      },
      findNodeWithTags: function(node, tags) {
        if (!$.isArray(tags)) {
          tags = [tags];
        }
        while (node) {
          if (node.nodeType !== 3) {
            var index = $.inArray(node.tagName, tags);
            if (index !== -1) {
              return node;
            }
          }
          node = node.parentNode;
        }
        return null;
      },
      selection: function() {
        if ($.popline.utils.browser.ieLtIE9()) {
          return {
            obj: function() {
              return document.selection;
            },
            range: function() {
              return document.selection.createRange();
            },
            text: function() {
               return document.selection.createRange().text;
            },
            focusNode: function() {
              return document.selection.createRange().parentElement();
            },
            select: function(range) {
              range.select();
            },
            empty: function() {
              document.selection.empty();
            }
          }
        } else {
          return {
            obj: function() {
              return window.getSelection();
            },
            range: function() {
              return window.getSelection().getRangeAt(0);
            },
            text: function() {
               return window.getSelection().toString();
            },
            focusNode: function() {
              return window.getSelection().focusNode;
            },
            select: function(range) {
              window.getSelection().addRange(range);
            },
            empty: function() {
              window.getSelection().removeAllRanges();
            }
          }
        }
      },
      fixIE8: function() {
        var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        style.styleSheet.cssText = ':before,:after{content:none !important';
        head.appendChild(style);
        setTimeout(function(){
            head.removeChild(style);
        }, 0);
      }
    },

    addButton: function(button) {
      $.extend($.popline.buttons, button);
    },

    buttons: {}

  });
})(jQuery);
/*
  jquery.popline.backcolor.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
  */
  ;(function($) {

    var colors = [
    '#FF0000',
    '#FFFF00',
    '#9CBE5A',
    '#00AE52',
    '#07A8EC',
    '#002463',
    '#7349A5',
    '#000000'
    ];

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function colorToHex(color) {
      if (color.substr(0, 1) === '#') {
        return color;
      }
      var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

      var red = parseInt(digits[2]);
      var green = parseInt(digits[3]);
      var blue = parseInt(digits[4]);

      return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    };

    var getColorButtons = function (){
      var buttons = {};

      $(colors).each(function (index, color) {
        buttons['color' + index] = {
          bgColor: color,
          text: '&nbsp;',
          action: function (event) {
            document.execCommand('ForeColor', false, colorToHex($(this).css('background-color')));
          }
        }
      });

      return buttons;
    }

    $.popline.addButton({
      color: {
        iconClass: "fa fa-font",
        mode: "edit",
        buttons: getColorButtons()
      }
    });
  })(jQuery);
/*
  jquery.popline.blockformat.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  var tags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "VOID"];

  var voidClass = "popline-el-void";

  // in order to support `undo format` feature
  // we don't use document.execCommand('formatblock', false, "<H1>") directly
  // instead, use some trick to do this

  var commonWrap = function(tag) {
    var range = window.getSelection().getRangeAt(0);
    var focusNode = window.getSelection().focusNode;
    var matchedNode = $.popline.utils.findNodeWithTags(focusNode, tags);
    tag = matchedNode && matchedNode.tagName === tag ? "VOID" : tag;
    var node = document.createElement(tag);
    var fragment = range.extractContents();

    removeEmptyTag(matchedNode);

    var textNode = document.createTextNode($(fragment).text());
    node.appendChild(textNode);

    range.insertNode(node);
    window.getSelection().selectAllChildren(node);
  }

  var ieWrap = function(tag) {
    var text = $.popline.utils.selection().text();
    var range = $.popline.utils.selection().range();
    var matchedNode = $.popline.utils.findNodeWithTags(range.parentElement(), tags);
    tag = matchedNode && matchedNode.tagName === tag ? "SPAN" : tag;
    var id = "popline-el-" + $.popline.utils.randomNumber();
    var clazz = "";
    // if brower lt IE9, we can not use a pseudo tag(VOID) to mark dom
    // so we use span tag and a special class to mark it
    if (tag === "SPAN") {
      clazz = " class='" + voidClass + "'";
    }
    if ($.popline.utils.isNull(matchedNode) && $(range.parentElement()).hasClass(voidClass)) {
      matchedNode = range.parentElement();
    }
    if (matchedNode && $(matchedNode).text() === text) {
      $(matchedNode).remove();
    }
    range.pasteHTML("<" + tag + " id='" + id + "'" + clazz + ">" + text + "</" + tag + ">");
    var $node = $("#" + id);
    range.moveToElementText($node[0]);
    range.select();
    $node.removeAttr("id")
  }

  var wrap = function(tag) {
    if ($.popline.utils.browser.ieLtIE9()) {
      ieWrap(tag);
    } else {
      commonWrap(tag);
    }

  }

  var removeEmptyTag = function(node) {
    if ($.popline.utils.trim($(node).text()) === "") {
      $(node).remove();
    }
  }

  $.popline.addButton({
    blockFormat: {
      text: "H",
      mode: "edit",
      buttons: {
        normal: {
          text: "P",
          textClass: "lighter",
          action: function(event) {
            wrap("P");
          }
        },
        h1: {
          text: "H1",
          action: function(event) {
            wrap("H1");
          }
        },
        h2: {
          text: "H2",
          action: function(event) {
            wrap("H2");
          }
        },
        h3: {
          text: "H3",
          action: function(event) {
            wrap("H3");
          }
        },
        h4: {
          text: "H4",
          action: function(event) {
            wrap("H4");
          }
        },
        h5: {
          text: "H5",
          action: function(event) {
            wrap("H5");
          }
        },
        h6: {
          text: "H6",
          action: function(event) {
            wrap("H6");
          }
        }
      },
      afterHide: function(popline){
        popline.target.find("void, ." + voidClass).contents().unwrap();
      }
    }
  });

})(jQuery);
/*
  jquery.popline.decoration.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  $.popline.addButton({
    bold: {
      iconClass: "fa fa-bold",
      mode: "edit",
      action: function(event) {
        document.execCommand("bold");
      }
    },

    italic: {
      iconClass: "fa fa-italic",
      mode: "edit",
      action: function(event) {
        document.execCommand("italic");
      }
    },

    strikethrough: {
      iconClass: "fa fa-strikethrough",
      mode: "edit",
      action: function(event) {
        document.execCommand("strikethrough");
      }
    },

    underline: {
      iconClass: "fa fa-underline",
      mode: "edit",
      action: function(event) {
        document.execCommand("underline");
      }
    }

  });
})(jQuery);
/*
  jquery.popline.email.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

  var selectionIsEmail = function() {
    var result = false;
    var text = $.popline.utils.selection().text();
    if (pattern.test(text)) {
      result = true;
    }
    return result;
  }

  $.popline.addButton({
    email: {
      text: "@",
      mode: "view",
      beforeShow: function(popline) {
        if (!selectionIsEmail()) {
          this.hide();
        }
      },
      action: function(event) {
        var $emailLink = $("<a></a>").attr("id", "popline-email-link").attr("href", "mailto:" + $.popline.utils.selection().text());
        $emailLink.click(function(event){
          event.stopPropagation();
        });
        $(this).find(".btn").after($emailLink);
        $emailLink[0].click();
        $emailLink.remove();
      }
    }
  });
})(jQuery);
/*
  jquery.popline.justify.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  var removeRedundantParagraphTag = function(popline, align) {
    if ($.popline.utils.browser.ie) {
      $paragraphs = popline.target.find("p[align=" + align + "]");
      $paragraphs.each(function(i, obj){
        if (obj.childNodes.length === 1 && obj.childNodes[0].nodeType === 3 && !/\S/.test(obj.childNodes[0].nodeValue)) {
          $(obj).remove();
        }
      })
    }
  }

  $.popline.addButton({
    justify: {
      iconClass: "fa fa-align-justify",
      mode: "edit",
      buttons: {
        justifyLeft: {
          iconClass: "fa fa-align-left",
          action: function(event, popline) {
            document.execCommand("JustifyLeft");
            removeRedundantParagraphTag(popline, "left");
          }
        },

        justifyCenter: {
          iconClass: "fa fa-align-center",
          action: function(event, popline) {
            document.execCommand("JustifyCenter");
            removeRedundantParagraphTag(popline, "center");
          }
        },

        justifyRight: {
          iconClass: "fa fa-align-right",
          action: function(event, popline) {
            document.execCommand("JustifyRight");
            removeRedundantParagraphTag(popline, "right");
          }
        },

        indent: {
          iconClass: "fa fa-indent",
          action: function(event) {
            document.execCommand("indent");
          }
        },

        outdent: {
          iconClass: "fa fa-dedent",
          action: function(event) {
            document.execCommand("outdent");
          }
        }
      }
    }
  });
})(jQuery);
/*
  jquery.popline.link.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
  */
  ;(function($) {

    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var protocolPattern = /.+:\/\//;

    var selectionIsLink = function() {
      var result = false;
      var focusNode = $.popline.utils.selection().focusNode();
      if ($.popline.utils.browser.webkit || $.popline.utils.browser.ie) {
        result = $.popline.utils.findNodeWithTags(focusNode, 'A');
      }else if ($.popline.utils.browser.firefox) {
        result = firefoxSelectionIsLink();
      }
      return result;
    }

    var firefoxSelectionIsLink = function() {
    //firefox has diffrerent behavior between double click selection and mouse move selection
    //when double click to select link, we need lookup from descendants
    var selection = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    var fragment = range.cloneContents();
    if (fragment.childNodes.length === 1 && fragment.firstChild.tagName === "A") {
      return true;
    }
    //if not found, lookup from ancestries
    return $.popline.utils.findNodeWithTags(selection.focusNode, 'A');
  }

  var buildTextField = function(popline, button) {
    if (button.find(":text").length === 0) {
      var $textField = $("<input type='text' />");
      $textField.addClass("popline-textfield");
      $textField.attr("placeholder", "http://");

      $textField.keyup(function(event) {
        if (event.which === 13) {
          $(this).blur();
          text = $(this).val();
          if (!protocolPattern.test(text)) {
            text = "http://" + text;
          }
          if (pattern.test(text)) {
            $.popline.utils.selection().empty();
            $.popline.utils.selection().select(button.data('selection'));
            document.execCommand("createlink", false, text);
          } else {
            $.popline.utils.selection().select(button.data('selection'));
          }
          popline.hide();
        }
      });

      $textField.mouseup(function(event) {
        event.stopPropagation();
      });
      button.append($textField);
    }
  }

  $.popline.addButton({
    link: {
      iconClass: "fa fa-link",
      mode: "edit",
      beforeShow: function(popline) {
        var $a = this.find("a");
        if (selectionIsLink()) {
          $a.removeClass("fa fa-link").addClass("fa fa-unlink");
        }else {
          $a.removeClass("fa fa-unlink").addClass("fa fa-link");
        }

        if (!this.data("click-event-binded")) {

          this.click(function(event) {
            var $_this = $(this);

            if (selectionIsLink()) {

              document.execCommand("unlink");
              $_this.find("a").removeClass("fa fa-unlink").addClass("fa fa-link");

            }else {

              if (!$_this.hasClass("popline-boxed")) {
                buildTextField(popline, $_this);
                $_this.data('selection', $.popline.utils.selection().range());
                $.popline.utils.selection().empty();
                popline.switchBar($_this, function() {
                  $_this.siblings("li").hide().end()
                  .children(":text").show().end();
                }, function() {
                  $_this.children(":text").focus();
                });
                event.stopPropagation();
              }
            }
          });

          this.data("click-event-binded", true);
        }

      },
      afterHide: function() {
        this.find(":text").val('');
      }
    }
  });
})(jQuery);
/*
  jquery.popline.list.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  var firefoxCleanupCheck = function(tag) {
    var focusNode = $.popline.utils.selection().focusNode();
    var node = $.popline.utils.findNodeWithTags(focusNode, tag);
    return node ? true : false;
  }

  var firefoxCleanup = function(addPTag) {
    $.popline.current.target.find("br[type=_moz]").parent().remove();
    if (addPTag) {
      document.execCommand("formatblock", false, "P");
      var selection = $.popline.utils.selection().obj();
      if (selection.anchorNode && (node = selection.anchorNode.parentNode.previousSibling) && node.tagName === "BR") {
        node.remove();
      }
      if (selection.focusNode && (node = selection.focusNode.parentNode.nextSibling) && node.tagName === "BR") {
        node.remove();
      }
      addPTag = null;
    }
  }

  $.popline.addButton({
    orderedList: {
      iconClass: "fa fa-list-ol",
      mode: "edit",
      action: function(event) {
        if ($.popline.utils.browser.firefox) {
          var addPTag = firefoxCleanupCheck('OL');
        }
        document.execCommand("InsertOrderedList");
        if ($.popline.utils.browser.firefox) {
          firefoxCleanup(addPTag);
        }
      }
    },

    unOrderedList: {
      iconClass: "fa fa-list-ul",
      mode: "edit",
      action: function(event) {
        if ($.popline.utils.browser.firefox) {
          var addPTag = firefoxCleanupCheck('UL');
        }
        document.execCommand("InsertUnorderedList");
        if ($.popline.utils.browser.firefox) {
          firefoxCleanup(addPTag);
        }
      }
    }
  });
})(jQuery);
/*
  jquery.popline.social.js 1.0.0

  Version: 1.0.0
  Updated: Sep 10th, 2014

  (c) 2014 by kenshin54
*/
;(function($) {

  var openWindow = function(url, openWithWindow){
    if (openWithWindow) {
      var width = 600, height = 480;
      var left = (screen.width - width)  / 2;
      var top = (screen.height - height) / 2;
      window.open(url, null, "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
    }else {
      window.open(url);
    }
  }

  $.popline.addButton({
    search: {
      iconClass: "fa fa-search",
      mode: "view",
      action: function(event) {
        var url = "https://www.google.com/search?q=" + encodeURIComponent($.popline.utils.selection().text());
        openWindow(url, false);
      }
    },
    twitter: {
      iconClass: "fa fa-twitter",
      mode: "view",
      action: function(event) {
        var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent($.popline.utils.selection().text() + " - " + location.href);
        openWindow(url, true);
      }
    },
    facebook: {
      iconClass: "fa fa-facebook",
      mode: "view",
      action: function(event) {
        var url = "http://www.facebook.com/sharer.php";
        params = [];
        params.push("s=100");
        params.push("p[summary]=" + encodeURIComponent($.popline.utils.selection().text()));
        params.push("p[url]=" + encodeURIComponent(location.href));
        openWindow(url + "?" + params.join("&"), true);
      }
    },
    pinterest: {
      iconClass: "fa fa-pinterest",
      mode: "view",
      action: function(event) {
        var url = "http://pinterest.com/pin/create/button/";
        var range = $.popline.utils.selection().range();
        var fragment = null;
        if ($.popline.utils.browser.ieLtIE9()) {
          fragment = range.htmlText;
        } else {
          fragment = range.cloneContents();
        }

        var $p = $("<p />");
        $p.append(fragment);
        var $img = $p.find("img:first");
        params = [];
        params.push("url=" + encodeURIComponent(location.href));
        if ($img.length > 0) {
          params.push("media=" + encodeURIComponent($img.attr("src")));
        }
        openWindow(url + "?" + params.join("&"), true);
      }
    }
  });
})(jQuery);
