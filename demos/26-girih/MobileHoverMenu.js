/**
 * A menu for demos that's only available/visible on mobile devices.
 *
 * @date 2026-01-12
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | Constructor.
  // +-------------------------------
  var MobileHoverMenu = function (orientation) {
    this.container = document.createElement("div");
    this.container.classList.add("mobile-hover-menu");

    // this.container.innerHTML = "TEST";
    // Add global style node for media query
    var styleNode = document.createElement("style");
    styleNode.setAttribute("name", "styles-mobile-hover-menu");
    styleNode.textContent += `
.mobile-hover-menu { 
    display: none; 
    position: absolute;
    background-color: white;
    width: 64px;
    height: 64px;
    border-radius: 25%;
    justify-content: center;
    align-items: center;
}

.mobile-hover-menu button {
    height: 50px;
    width: 50px;
    font-size: 32px;
}

/* Positions */
.mobile-hover-menu.left {
    left: 0px;
}

.mobile-hover-menu.center-h {
    left: 50%;
    transform: translateX(-50%);
}

.mobile-hover-menu.right {
    right: 0px;
}

.mobile-hover-menu.top {
    top: 0px;
}

.mobile-hover-menu.center-v {
    top: 50%;
    transform: translateY(-50%);
}

.mobile-hover-menu.bottom {
    bottom: 0px;
}

.mobile-hover-menu.hidden {
    display: none !important;
}

/* Phone */
@media screen and (max-width:320px) {
    .mobile-hover-menu { display: flex; }
}

/* Tablet */
@media screen and (min-width:321px) and (max-width:768px) {
    .mobile-hover-menu { display: flex; }
}

/* Manual override */
body.mobile .mobile-hover-menu { 
    display: flex; 
}
`;
    document.head && document.head.appendChild(styleNode);
    addClasses(this.container, orientation);
    document.body && document.body.appendChild(this.container);
  };

  MobileHoverMenu.prototype.show = function () {
    this.container.classList.remove("hidden");
  };

  MobileHoverMenu.prototype.hide = function () {
    this.container.classList.add("hidden");
  };

  MobileHoverMenu.prototype.addButton = function (labelStr, onClickFn) {
    var btn = document.createElement("button");
    btn.innerHTML = labelStr;
    btn.addEventListener("click", onClickFn);
    this.container.appendChild(btn);
  };

  // +---------------------------------------------------------------------------------
  // | A helper function to add classes from a whitespace separated string, eg. `top left hidden`
  // +-------------------------------
  var addClasses = function (node, classlistStr) {
    if (!node || !classlistStr) {
      return;
    }
    var classlist = classlistStr.split(/\s+/);
    classlist.forEach(element => {
      node.classList.add(element);
    });
  };

  _context.MobileHoverMenu = MobileHoverMenu;
})(globalThis);
