/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

qx.Class.define("qx.test.bom.element.Style",
{
  extend : qx.dev.unit.TestCase,
  include : [ qx.dev.unit.MRequirements ],

  members :
  {
    __element : null,


    hasCssBoxshadow : function()
    {
      return qx.core.Environment.get("css.boxshadow") !== null;
    },


    setUp : function()
    {
      this.__element = document.createElement("div");
      document.body.appendChild(this.__element);
    },


    tearDown : function()
    {
      document.body.removeChild(this.__element);
      this.__element = null;
    },


    testSetStylesWithCss3 : function()
    {
      if (this.require(["cssBoxshadow"]))
      {
        var styles =
        {
          "MozBoxShadow" : "6px 6px 10px rgb(128, 128, 128)",
          "WebkitBoxShadow" : "6px 6px 10px rgb(128, 128, 128)",
          "boxShadow" : "6px 6px 10px rgb(128, 128, 128)"
        };

        qx.bom.element.Style.setStyles(this.__element, styles);

        var expected = qx.core.Environment.select("engine.name",
        {
          "webkit" : "rgb(128, 128, 128) 6px 6px 10px",
          "mshtml" : "6px 6px 10px rgb(128,128,128)",
          "default" : "6px 6px 10px rgb(128, 128, 128)"
        });

        this.assertEquals(expected, this.__element.style["boxShadow"]);
      }
    },


    testSetAndGetCss : function()
    {
      var css = "font-weight: bold;";
      qx.bom.element.Style.setCss(this.__element, css);
      this.assertMatch(qx.bom.element.Style.getCss(this.__element), /font-weight.*?bold/i);
    },


    testSet : function()
    {
      var name = "border";
      var style = ["1px", "solid", "red"];

      qx.bom.element.Style.set(this.__element, name, style.join(" "));

      if (qx.core.Environment.get("engine.name") == "mshtml" &&
          qx.core.Environment.get("browser.documentmode") < 9)
      {
        this.assertEquals("red 1px solid", this.__element.style.border);
      }
      else {
        this.assertEquals(style.join(" "), this.__element.style.border);
      }

      this.assertEquals(style[0], this.__element.style.borderWidth);
      this.assertEquals(style[1], this.__element.style.borderStyle);
      this.assertEquals(style[2], this.__element.style.borderColor);
    },


    testGet : function()
    {
      var name = "border";
      var style = "1px solid red";

      var engine = qx.core.Environment.get("engine.name");
      var expected = ["1px", "solid", "red"];
      var isOldSafari = (qx.core.Environment.get("browser.name") == "safari" &&
                         qx.core.Environment.get("browser.version") < 6);

      if (engine == "opera" || (engine == "webkit" && !isOldSafari)) {
        expected = ["1px", "solid", "rgb(255, 0, 0)"];
      }

      qx.bom.element.Style.set(this.__element, name, style);
      if (qx.core.Environment.get("engine.name") == "mshtml" &&
          qx.core.Environment.get("browser.documentmode") < 9)
      {
        this.assertEquals("red 1px solid", qx.bom.element.Style.get(this.__element, name));
      }
      else {
        this.assertEquals(expected.join(" "), qx.bom.element.Style.get(this.__element, name));
      }
      this.assertEquals(expected[0], qx.bom.element.Style.get(this.__element, "borderWidth"));
      this.assertEquals(expected[1], qx.bom.element.Style.get(this.__element, "borderStyle"));
      this.assertEquals(expected[2], qx.bom.element.Style.get(this.__element, "borderColor"));
    },

    testSetFloat : function()
    {
      qx.bom.element.Style.set(this.__element, "float", "left");
      this.assertEquals("left", this.__element.style.float);
    },

    testCompileFloat : function()
    {
      var css = qx.bom.element.Style.compile({"float" : "left"});
      this.assertEquals("float:left;", css);
    },

    testGetFloat : function() {
      // important to set this value as CSS class
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '.right { float: right; }';
      document.getElementsByTagName('head')[0].appendChild(style);
      this.__element.className = 'right';

      var floatValue = qx.bom.element.Style.get(this.__element, 'float');
      this.assertEquals('right', floatValue);

      document.getElementsByTagName('head')[0].removeChild(style);
      this.__element.className = '';
    },

    testCompileContent : function()
    {
      var css = qx.bom.element.Style.compile({"content" : ""});
      this.assertEquals("content:\"\";", css);
    },

    testSetOpacity : function()
    {
      if (!qx.core.Environment.get("css.opacity")) {
        throw new qx.dev.unit.RequirementError("css.opacity");
      }
      qx.bom.element.Style.set(this.__element, "opacity", 1);
      this.assertEquals("1", this.__element.style.opacity);
    },

    testCompileOpacity : function()
    {
      if (!qx.core.Environment.get("css.opacity")) {
        throw new qx.dev.unit.RequirementError("css.opacity");
      }
      var css = qx.bom.element.Style.compile({"opacity" : 1});
      this.assertEquals("opacity:1;", css);
    }
  }
});
