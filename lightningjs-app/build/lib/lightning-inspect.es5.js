/*
 * Lightning v2.15.0
 *
 * https://github.com/rdkcentral/Lightning
 */
(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";
  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }
  window.attachInspector = function(_ref) {
    var Application = _ref.Application, Element = _ref.Element, ElementCore = _ref.ElementCore, Stage = _ref.Stage, Component = _ref.Component, ElementTexturizer = _ref.ElementTexturizer, Texture = _ref.Texture;
    var isAlreadyAttached = window.hasOwnProperty("mutationCounter");
    if (isAlreadyAttached) {
      return;
    }
    window.mutationCounter = 0;
    window.mutatingChildren = false;
    var observer = new MutationObserver(function(mutations) {
      var fa = ["x", "y", "w", "h", "alpha", "mountX", "mountY", "pivotX", "pivotY", "scaleX", "scaleY", "rotation", "visible", "clipping", "rect", "colorUl", "colorUr", "colorBl", "colorBr", "color", "borderWidthLeft", "borderWidthRight", "borderWidthTop", "borderWidthBottom", "borderWidth", "borderColorLeft", "borderColorRight", "borderColorTop", "borderColorBottom", "borderColor", "zIndex", "forceZIndexContext", "renderToTexture", "renderToTextureLazy", "renderOffscreen", "colorizeResultTexture", "texture"];
      var fac = fa.map(function(v) {
        return v.toLowerCase();
      });
      mutations.forEach(function(mutation) {
        var _this = this;
        if (mutation.type == "childList") {
          mutation.target;
          var c = mutation.target.element;
        }
        if (mutation.type == "attributes" && mutation.attributeName !== "style" && mutation.attributeName !== "class") {
          var n = mutation.attributeName.toLowerCase();
          var c = mutation.target.element;
          if (c.__ignore_attrib_changes === window.mutationCounter) {
            return;
          }
          var v = mutation.target.getAttribute(mutation.attributeName);
          if (n.startsWith("texture-")) {
            if (c.displayedTexture) {
              var att = n.substr(8).split("_");
              var camelCaseAtt = att[0] + att.slice(1).map(function(a) {
                _newArrowCheck(this, _this);
                return a.substr(0, 1).toUpperCase() + a.substr(1).toLowerCase();
              }.bind(this)).join();
              c.displayedTexture[camelCaseAtt] = v;
            }
            return;
          }
          var index = fac.indexOf(n);
          if (index !== -1) {
            var rn = fa[index];
            var pv;
            try {
              if (v === null) {
                switch (rn) {
                  case "pivotX":
                  case "pivotY":
                    pv = 0.5;
                    break;
                  case "alpha":
                  case "scaleX":
                  case "scaleY":
                    pv = 1;
                    break;
                  case "visible":
                    pv = true;
                    break;
                  case "clipping":
                    pv = false;
                    break;
                  case "rect":
                    pv = false;
                    break;
                  case "zIndex":
                    pv = 0;
                    break;
                  case "forceZIndexContext":
                    pv = false;
                    break;
                  case "color":
                    pv = 4294967295;
                    break;
                  case "colorUl":
                  case "colorUr":
                  case "colorBl":
                  case "colorBr":
                    if (mutation.target.hasAttribute("color")) {
                      return;
                    }
                    pv = 4294967295;
                    break;
                  case "renderToTexture":
                    pv = false;
                    break;
                  case "renderToTextureLazy":
                    pv = false;
                    break;
                  case "renderOffscreen":
                    pv = false;
                    break;
                  case "colorizeResultTexture":
                    pv = false;
                    break;
                  default:
                    pv = 0;
                }
              } else {
                switch (rn) {
                  case "color":
                  case "colorUl":
                  case "colorUr":
                  case "colorBl":
                  case "colorBr":
                    pv = parseInt(v, 16);
                    break;
                  case "visible":
                  case "clipping":
                  case "rect":
                  case "forceZIndexContext":
                  case "renderToTexture":
                  case "renderToTextureLazy":
                  case "renderOffscreen":
                  case "colorizeResultTexture":
                    pv = v === "true";
                    break;
                  case "texture":
                    pv = JSON.parse(v);
                    break;
                  default:
                    pv = parseFloat(v);
                    if (isNaN(pv))
                      throw "e";
                }
              }
              var fv;
              switch (rn) {
                case "color":
                  var f = ["colorUl", "colorUr", "colorBl", "colorBr"].map(function(q) {
                    return mutation.target.hasAttribute(q);
                  });
                  if (!f[0])
                    c["colorUl"] = pv;
                  if (!f[1])
                    c["colorUr"] = pv;
                  if (!f[2])
                    c["colorBl"] = pv;
                  if (!f[3])
                    c["colorBr"] = pv;
                  break;
                default:
                  c[rn] = pv;
              }
            } catch (e) {
              console.error("Bad (ignored) attribute value", rn);
            }
          }
        }
      });
      window.mutationCounter++;
    });
    ElementCore.prototype.dhtml = function() {
      return this._element.dhtml();
    };
    Element.prototype.dhtml = function() {
      if (!this.debugElement) {
        this.debugElement = document.createElement("DIV");
        this.debugElement.setAttribute("type", this.constructor.name);
        this.debugElement.element = this;
        this.debugElement.style.position = "absolute";
        this.debugElement.id = "" + this.id;
        observer.observe(this.debugElement, {
          attributes: true
        });
      }
      if (this.stage.root === this && !this.dhtml_root) {
        var root = document.createElement("DIV");
        document.body.appendChild(root);
        var self = this;
        var updateRootStyleFromCanvas = function updateRootStyleFromCanvas2(bcr) {
          var p = self.stage.getRenderPrecision() / self.stage.getOption("devicePixelRatio");
          root.style.left = bcr.left + "px";
          root.style.top = bcr.top + "px";
          root.style.width = Math.ceil(bcr.width / p) + "px";
          root.style.height = Math.ceil(bcr.height / p) + "px";
          root.style.transformOrigin = "0 0 0";
          root.style.transform = "scale(" + p + "," + p + ")";
        };
        if (window.ResizeObserver != null) {
          var resize_ob = new ResizeObserver(function(entries) {
            updateRootStyleFromCanvas(entries[0].target.getBoundingClientRect());
          });
          resize_ob.observe(this.stage.getCanvas());
        } else {
          setTimeout(function() {
            updateRootStyleFromCanvas(self.stage.getCanvas().getBoundingClientRect());
          }, 1e3);
        }
        root.style.position = "absolute";
        root.style.overflow = "hidden";
        root.style.zIndex = "65535";
        root.appendChild(this.debugElement);
        this.dhtml_root = root;
      }
      return this.debugElement;
    };
    var oElement = Element;
    var oSetParent = oElement.prototype._setParent;
    Element.prototype._setParent = function(parent) {
      var prevParent = this.parent;
      oSetParent.apply(this, arguments);
      if (!window.mutatingChildren) {
        if (parent && parent.dhtml) {
          var index = parent._children.getIndex(this);
          if (index == parent._children.get().length - 1) {
            parent.dhtml().appendChild(this.dhtml());
          } else {
            parent.dhtml().insertBefore(this.dhtml(), parent.dhtml().children[index]);
          }
        } else {
          if (prevParent && prevParent.dhtml) {
            prevParent.dhtml().removeChild(this.dhtml());
          }
        }
      }
    };
    var oInit = Stage.prototype.init;
    Stage.prototype.init = function() {
      oInit.apply(this, arguments);
      this.root.core.updateDebugTransforms();
    };
    var oAddTag = oElement.prototype.addTag;
    Element.prototype.addTag = function(tag) {
      oAddTag.apply(this, arguments);
      if (tag) {
        this.dhtml().classList.add(tag);
      }
    };
    var oRemoveTag = oElement.prototype.removeTag;
    Element.prototype.removeTag = function(tag) {
      oRemoveTag.apply(this, arguments);
      if (tag) {
        this.dhtml().classList.remove(tag);
      }
    };
    var val = function val2(c, n, v, dv) {
      if (c._element) {
        c = c._element;
      }
      if (v == dv) {
        if (c.dhtmlRemoveAttribute) {
          c.dhtmlRemoveAttribute(n);
        }
      } else {
        if (c.dhtmlSetAttribute) {
          c.dhtmlSetAttribute(n, v);
        }
      }
    };
    var valStrict = function valStrict2(c, n, v, dv) {
      if (c._element) {
        c = c._element;
      }
      if (v === dv) {
        if (c.dhtmlRemoveAttribute) {
          c.dhtmlRemoveAttribute(n);
        }
      } else {
        if (c.dhtmlSetAttribute) {
          c.dhtmlSetAttribute(n, v);
        }
      }
    };
    Element.prototype.dhtmlRemoveAttribute = function() {
      this.__ignore_attrib_changes = window.mutationCounter;
      this.dhtml().removeAttribute.apply(this.dhtml(), arguments);
    };
    Element.prototype.dhtmlSetAttribute = function() {
      this.__ignore_attrib_changes = window.mutationCounter;
      this.dhtml().setAttribute.apply(this.dhtml(), arguments);
    };
    if (typeof Component !== "undefined") {
      Object.defineProperty(Component.prototype, "_state", {
        get: function get() {
          return this.__state;
        },
        set: function set(v) {
          if (this.__state !== v) {
            if (this.__state !== null) {
              val(this, "state", v ? v.__path : "", "");
            }
            this.__state = v;
          }
        }
      });
    }
    Element.prototype.$ref = Element.prototype.__ref;
    Object.defineProperty(Element.prototype, "__ref", {
      get: function get() {
        return this.$ref;
      },
      set: function set(v) {
        if (this.$ref !== v) {
          val(this, "ref", v, null);
          this.$ref = v;
        }
      }
    });
    ElementCore.prototype.$x = ElementCore.prototype._x;
    Object.defineProperty(ElementCore.prototype, "_x", {
      get: function get() {
        return this.$x;
      },
      set: function set(v) {
        if (this.$x !== v) {
          val(this, "x", v, 0);
          this.$x = v;
          this.updateLeft();
        }
      }
    });
    ElementCore.prototype.$y = ElementCore.prototype._y;
    Object.defineProperty(ElementCore.prototype, "_y", {
      get: function get() {
        return this.$y;
      },
      set: function set(v) {
        if (this.$y !== v) {
          val(this, "y", v, 0);
          this.$y = v;
          this.updateTop();
        }
      }
    });
    Element.prototype.$w = Element.prototype._w;
    Object.defineProperty(Element.prototype, "_w", {
      get: function get() {
        return this.$w;
      },
      set: function set(v) {
        if (this.$w !== v) {
          val(this, "w", v, 0);
          this.$w = v;
        }
      }
    });
    Element.prototype.$h = Element.prototype._h;
    Object.defineProperty(Element.prototype, "_h", {
      get: function get() {
        return this.$h;
      },
      set: function set(v) {
        if (this.$h !== v) {
          val(this, "h", v, 0);
          this.$h = v;
        }
      }
    });
    ElementCore.prototype.updateLeft = function() {
      var mx = this._mountX * this._w;
      var x = this._x - mx;
      this.dhtml().style.left = x + "px";
    };
    ElementCore.prototype.updateTop = function() {
      var my = this._mountY * this._h;
      var y = this._y - my;
      this.dhtml().style.top = y + "px";
    };
    ElementCore.prototype.__w = 0;
    Object.defineProperty(ElementCore.prototype, "_w", {
      get: function get() {
        return this.__w;
      },
      set: function set(v) {
        this.__w = v;
        this.dhtml().style.width = v + "px";
        this.updateLeft();
      }
    });
    ElementCore.prototype.__h = 0;
    Object.defineProperty(ElementCore.prototype, "_h", {
      get: function get() {
        return this.__h;
      },
      set: function set(v) {
        this.__h = v;
        this.dhtml().style.height = v + "px";
        this.updateTop();
      }
    });
    ElementCore.prototype.$alpha = 1;
    Object.defineProperty(ElementCore.prototype, "_alpha", {
      get: function get() {
        return this.$alpha;
      },
      set: function set(v) {
        if (this.$alpha !== v) {
          val(this, "alpha", v, 1);
          this.$alpha = v;
          this.dhtml().style.opacity = v;
          this.dhtml().style.display = this.$visible && this.$alpha ? "block" : "none";
        }
      }
    });
    ElementCore.prototype.$visible = true;
    Object.defineProperty(ElementCore.prototype, "_visible", {
      get: function get() {
        return this.$visible;
      },
      set: function set(v) {
        if (this.$visible !== v) {
          val(this, "visible", v, true);
          this.$visible = v;
          this.dhtml().style.visibility = v ? "visible" : "hidden";
          this.dhtml().style.display = this.$visible && this.$alpha ? "block" : "none";
        }
      }
    });
    ElementCore.prototype.$rotation = 0;
    Object.defineProperty(ElementCore.prototype, "_rotation", {
      get: function get() {
        return this.$rotation;
      },
      set: function set(v) {
        if (this.$rotation !== v) {
          val(this, "rotation", v, 0);
          this.$rotation = v;
          this.updateDebugTransforms();
        }
      }
    });
    ElementCore.prototype.$scaleX = 1;
    Object.defineProperty(ElementCore.prototype, "_scaleX", {
      get: function get() {
        return this.$scaleX;
      },
      set: function set(v) {
        if (this.$scaleX !== v) {
          val(this, "scaleX", v, 1);
          this.$scaleX = v;
          this.updateDebugTransforms();
        }
      }
    });
    ElementCore.prototype.$scaleY = 1;
    Object.defineProperty(ElementCore.prototype, "_scaleY", {
      get: function get() {
        return this.$scaleY;
      },
      set: function set(v) {
        if (this.$scaleY !== v) {
          val(this, "scaleY", v, 1);
          this.$scaleY = v;
          this.updateDebugTransforms();
        }
      }
    });
    ElementCore.prototype.$pivotX = 0.5;
    Object.defineProperty(ElementCore.prototype, "_pivotX", {
      get: function get() {
        return this.$pivotX;
      },
      set: function set(v) {
        if (this.$pivotX !== v) {
          val(this, "pivotX", v, 0.5);
          this.$pivotX = v;
          this.updateDebugTransforms();
        }
      }
    });
    ElementCore.prototype.$pivotY = 0.5;
    Object.defineProperty(ElementCore.prototype, "_pivotY", {
      get: function get() {
        return this.$pivotY;
      },
      set: function set(v) {
        if (this.$pivotY !== v) {
          val(this, "pivotY", v, 0.5);
          this.$pivotY = v;
          this.updateDebugTransforms();
        }
      }
    });
    ElementCore.prototype.$mountX = 0;
    Object.defineProperty(ElementCore.prototype, "_mountX", {
      get: function get() {
        return this.$mountX;
      },
      set: function set(v) {
        if (this.$mountX !== v) {
          val(this, "mountX", v, 0);
          this.$mountX = v;
          this.updateLeft();
        }
      }
    });
    ElementCore.prototype.$mountY = 0;
    Object.defineProperty(ElementCore.prototype, "_mountY", {
      get: function get() {
        return this.$mountY;
      },
      set: function set(v) {
        if (this.$mountY !== v) {
          val(this, "mountY", v, 0);
          this.$mountY = v;
          this.updateTop();
        }
      }
    });
    ElementCore.prototype.__zIndex = 0;
    Object.defineProperty(ElementCore.prototype, "_zIndex", {
      get: function get() {
        return this.__zIndex;
      },
      set: function set(v) {
        if (this.__zIndex !== v) {
          val(this, "zIndex", v, 0);
          this.__zIndex = v;
          if (this.__zIndex || v) {
            this.dhtml().style.zIndex = v;
          }
        }
      }
    });
    ElementCore.prototype.__forceZIndexContext = false;
    Object.defineProperty(ElementCore.prototype, "_forceZIndexContext", {
      get: function get() {
        return this.__forceZIndexContext;
      },
      set: function set(v) {
        if (this.__forceZIndexContext !== v) {
          val(this, "forceZIndexContext", v, false);
          this.__forceZIndexContext = v;
        }
      }
    });
    ElementCore.prototype.__clipping = false;
    Object.defineProperty(ElementCore.prototype, "_clipping", {
      get: function get() {
        return this.__clipping;
      },
      set: function set(v) {
        if (this.__clipping !== v) {
          val(this, "clipping", v, false);
          this.__clipping = v;
          var nv = v ? "hidden" : "visible";
          if (v || !v && this.dhtml().style.overflow == "hidden") {
            this.dhtml().style.overflow = nv;
          }
        }
      }
    });
    ElementCore.prototype.__withinBoundsMargin = false;
    Object.defineProperty(ElementCore.prototype, "_withinBoundsMargin", {
      get: function get() {
        return this.__withinBoundsMargin;
      },
      set: function set(v) {
        if (this.__withinBoundsMargin !== v) {
          val(this, "withinBoundsMargin", v, false);
          this.__withinBoundsMargin = v;
        }
      }
    });
    ElementCore.prototype.__colorUl = 4294967295;
    Object.defineProperty(ElementCore.prototype, "_colorUl", {
      get: function get() {
        return this.__colorUl;
      },
      set: function set(v) {
        if (this.__colorUl !== v) {
          val(this, "colorUl", v.toString(16), "ffffffff");
          this.__colorUl = v;
          checkColors(this);
        }
      }
    });
    ElementCore.prototype.__colorUr = 4294967295;
    Object.defineProperty(ElementCore.prototype, "_colorUr", {
      get: function get() {
        return this.__colorUr;
      },
      set: function set(v) {
        if (this.__colorUr !== v) {
          val(this, "colorUr", v.toString(16), "ffffffff");
          this.__colorUr = v;
          checkColors(this);
        }
      }
    });
    ElementCore.prototype.__colorBl = 4294967295;
    Object.defineProperty(ElementCore.prototype, "_colorBl", {
      get: function get() {
        return this.__colorBl;
      },
      set: function set(v) {
        if (this.__colorBl !== v) {
          val(this, "colorBl", v.toString(16), "ffffffff");
          this.__colorBl = v;
          checkColors(this);
        }
      }
    });
    ElementCore.prototype.__colorBr = 4294967295;
    Object.defineProperty(ElementCore.prototype, "_colorBr", {
      get: function get() {
        return this.__colorBr;
      },
      set: function set(v) {
        if (this.__colorBr !== v) {
          val(this, "colorBr", v.toString(16), "ffffffff");
          this.__colorBr = v;
          checkColors(this);
        }
      }
    });
    Element.prototype.$texture = null;
    Object.defineProperty(Element.prototype, "__texture", {
      get: function get() {
        return this.$texture;
      },
      set: function set(v) {
        this.$texture = v;
        val(this, "rect", this.rect, false);
        val(this, "src", this.src, null);
      }
    });
    Element.prototype.$testId = null;
    Object.defineProperty(Element.prototype, "testId", {
      get: function get() {
        return this.$testId;
      },
      set: function set(v) {
        if (this.$testId !== v) {
          this.$testId = v;
          val(this, "data-testid", v, null);
        }
      }
    });
    var checkColors = function checkColors2(elementRenderer) {
      var element = elementRenderer._element;
      if (elementRenderer._colorBr === void 0) {
        return;
      }
      if (elementRenderer._colorUl === elementRenderer._colorUr && elementRenderer._colorUl === elementRenderer._colorBl && elementRenderer._colorUl === elementRenderer._colorBr) {
        if (elementRenderer._colorUl !== 4294967295) {
          element.dhtmlSetAttribute("color", elementRenderer._colorUl.toString(16));
        } else {
          element.dhtmlRemoveAttribute("color");
        }
        element.dhtmlRemoveAttribute("colorul");
        element.dhtmlRemoveAttribute("colorur");
        element.dhtmlRemoveAttribute("colorbl");
        element.dhtmlRemoveAttribute("colorbr");
      } else {
        val(element, "colorUr", elementRenderer.colorUr.toString(16), "ffffffff");
        val(element, "colorUl", elementRenderer.colorUl.toString(16), "ffffffff");
        val(element, "colorBr", elementRenderer.colorBr.toString(16), "ffffffff");
        val(element, "colorBl", elementRenderer.colorBl.toString(16), "ffffffff");
        element.dhtmlRemoveAttribute("color");
      }
    };
    ElementTexturizer.prototype.__enabled = false;
    Object.defineProperty(ElementTexturizer.prototype, "_enabled", {
      get: function get() {
        return this.__enabled;
      },
      set: function set(v) {
        if (this.__enabled !== v) {
          val(this, "renderToTexture", v, false);
          this.__enabled = v;
        }
      }
    });
    ElementTexturizer.prototype.__lazy = false;
    Object.defineProperty(ElementTexturizer.prototype, "_lazy", {
      get: function get() {
        return this.__lazy;
      },
      set: function set(v) {
        if (this.__lazy !== v) {
          val(this, "renderToTextureLazy", v, false);
          this.__lazy = v;
        }
      }
    });
    ElementTexturizer.prototype.__colorize = false;
    Object.defineProperty(ElementTexturizer.prototype, "_colorize", {
      get: function get() {
        return this.__colorize;
      },
      set: function set(v) {
        if (this.__colorize !== v) {
          val(this, "colorizeResultTexture", v, false);
          this.__colorize = v;
        }
      }
    });
    ElementTexturizer.prototype.__renderOffscreen = false;
    Object.defineProperty(ElementTexturizer.prototype, "_renderOffscreen", {
      get: function get() {
        return this.__renderOffscreen;
      },
      set: function set(v) {
        if (this.__renderOffscreen !== v) {
          val(this, "renderOffscreen", v, false);
          this.__renderOffscreen = v;
        }
      }
    });
    ElementCore.prototype.updateDebugTransforms = function() {
      var stage = this._element.stage;
      if (this._pivotX !== 0.5 || this._pivotY !== 0.5) {
        this.dhtml().style.transformOrigin = this._pivotX * 100 + "% " + this._pivotY * 100 + "%";
      } else if (this.dhtml().style.transformOrigin) {
        this.dhtml().style.transformOrigin = "50% 50%";
      }
      var r = this._rotation;
      var sx = this._scaleX;
      var sy = this._scaleY;
      if (sx !== void 0 && sy !== void 0 && this._element.id === 0) {
        if (stage.options.w !== stage.options.renderWidth || stage.options.h !== stage.options.renderHeight) {
          sx *= stage.options.w / stage.options.renderWidth;
          sy *= stage.options.h / stage.options.renderHeight;
        }
      }
      var parts = [];
      if (r)
        parts.push("rotate(" + r + "rad)");
      if (sx !== void 0 && sy !== void 0 && (sx !== 1 || sy !== 1))
        parts.push("scale(" + sx + ", " + sy + ")");
      this.dhtml().style.transform = parts.join(" ");
    };
    var updateTextureAttribs = function updateTextureAttribs2(element) {
      var _this2 = this;
      if (element.texture) {
        var nonDefaults = element.texture.getNonDefaults();
        var keys = Object.keys(nonDefaults);
        keys.forEach(function(key) {
          _newArrowCheck(this, _this2);
          var f = "";
          for (var i = 0, n = key.length; i < n; i++) {
            var c = key.charAt(i);
            if (c !== c.toLowerCase()) {
              f += "_" + c.toLowerCase();
            } else {
              f += c;
            }
          }
          valStrict(element, "texture-".concat(f), nonDefaults[key], false);
        }.bind(this));
      }
    };
    var _performUpdateSource = Texture.prototype._performUpdateSource;
    Texture.prototype._performUpdateSource = function() {
      var _this3 = this;
      _performUpdateSource.apply(this, arguments);
      this.elements.forEach(function(v) {
        _newArrowCheck(this, _this3);
        updateTextureAttribs(v);
      }.bind(this));
    };
    var _setDisplayedTexture = Element.prototype._setDisplayedTexture;
    Element.prototype._setDisplayedTexture = function() {
      _setDisplayedTexture.apply(this, arguments);
      updateTextureAttribs(this);
    };
    if (typeof Application !== "undefined") {
      var _updateFocus = Application.prototype.__updateFocus;
      Application.prototype.__updateFocus = function() {
        var prev = this._focusPath && this._focusPath.length ? this._focusPath[this._focusPath.length - 1] : null;
        _updateFocus.apply(this, arguments);
        var focused = this._focusPath && this._focusPath.length ? this._focusPath[this._focusPath.length - 1] : null;
        if (prev != focused) {
          if (prev) {
            val(prev, "focused", false, false);
          }
          if (focused) {
            val(focused, "focused", true, false);
          }
        }
      };
    }
  };
  if (window.lng) {
    attachInspector(lng);
  }
});
