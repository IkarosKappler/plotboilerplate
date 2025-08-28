/**
 * A simple class for rendering color gradient dropdowns.
 *
 * As native dropdown do not support custom stylings in the way we need, we will implement
 * our own dropdown class.
 *
 * @author  Ikaros Kappler
 * @date    2025-08-19
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

import { Color } from "../../datastructures/Color";
import { ColorGradient } from "../../datastructures/ColorGradient";

export type ColorGradientSelectorChangeListener = (
  colorGradient: ColorGradient,
  gradientIndex: number,
  source: ColorGradientSelector
) => void;

/**
 * The initial properties to use.
 */
export interface ColorGradientSelectorProps {
  containerID?: string;
  initialGradients?: Array<ColorGradient>;
  selectedGradientIndex?: number;
  isMobileMode?: boolean;
}

export class ColorGradientSelector {
  private readonly baseID: number;
  private readonly elementID: string;

  private container: HTMLElement;
  private containerRef: NoReact.Ref<HTMLDivElement>;
  private mainButtonContainerRef: NoReact.Ref<HTMLButtonElement>;
  private positioningContainerRef: NoReact.Ref<HTMLDivElement>;

  private isMobileMode: boolean;
  private isDropdownOpen: boolean = false;

  private css_buttonWidth = "100px";
  private css_buttonHeight = "1.8em";
  private css_buttonFontSize = "0.725em";

  private colorGradients: Array<ColorGradient> = [];
  // TODO: this does not really need to be a pair, does it?
  private colorGradientOptionRefs: Array<{
    mainButton: NoReact.Ref<HTMLButtonElement>;
    deleteButton: NoReact.Ref<HTMLButtonElement>;
  }> = [];
  private selectedGradientIndex: number = -1;

  private readonly installedChangeListeners: Array<ColorGradientSelectorChangeListener> = [];

  public static readonly DEFAULT_COLOR_GRADIENTS: Array<ColorGradient> = [
    ColorGradient.createDefault(),
    ColorGradient.createFrom(Color.RED, Color.GREEN),
    ColorGradient.createFrom(Color.BLUE, Color.GOLD)
  ];

  /**
   * The constructor: creates a new color gradient picker in the given container.
   * If no container or ID is given then a new unbound `container` will be created (DIV).
   *
   * Pass a container ID or nothing – in the latter case the constructor will create
   * a new DIV element.
   *
   * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
   */
  constructor(options?: ColorGradientSelectorProps) {
    options = options || {};
    if (options.containerID) {
      const cont = document.getElementById(options.containerID);
      if (!cont) {
        throw "Cannot create ColorGradientPicker. Component ID does not exist.";
      }
      this.container = cont;
    } else {
      this.container = document.createElement("div");
    }
    this.isMobileMode = Boolean(options.isMobileMode);
    if (this.isMobileMode) {
      this.css_buttonWidth = "200px";
      this.css_buttonHeight = "2.5em";
      this.css_buttonFontSize = "1.25em";
    }
    this.baseID = Math.floor(Math.random() * 65535);
    this.elementID = `color-gradient-selector-${this.baseID}`;

    this.colorGradients =
      typeof options.initialGradients === "undefined" ? ColorGradientSelector.DEFAULT_COLOR_GRADIENTS : options.initialGradients;
    this.selectedGradientIndex = typeof options.selectedGradientIndex === "undefined" ? 0 : options.selectedGradientIndex;

    document.head.appendChild(this.__createCustomStylesElement());
    this.container.append(this._render());
  } // END constructor

  // TODO: implement this?
  // public setGradients(gradients: Array<ColorGradient>, selectedIndex: number): void {
  //   // First empty the container
  //   this.__removeAllChildNodes(this.positioningContainerRef.current);
  //   // Clone the array
  //   this.colorGradients = gradients.map((gradient: ColorGradient) => gradient);
  //   // Re-render button array
  //   // const newChildNodes: Array<NoReact.Ref<HTMLButtonElement>> = this._renderAllOptionButtons();
  //   this._renderAllOptionButtons();
  //   // Re-fill container with new nodes
  //   this.colorGradientOptionRefs.forEach((nodeRef: NoReact.Ref<HTMLButtonElement>) => {
  //     this.positioningContainerRef.current.appendChild(nodeRef.current);
  //   });
  // }

  public addGradient(gradient: ColorGradient): void {
    console.log("addGradient");
    // Render a new button
    const index: number = this.colorGradients.length;
    const refMainContainer: NoReact.Ref<HTMLDivElement> = NoReact.useRef<HTMLDivElement>();
    const refActionButton: NoReact.Ref<HTMLButtonElement> = NoReact.useRef<HTMLButtonElement>();
    const refDeleteButton: NoReact.Ref<HTMLButtonElement> = NoReact.useRef<HTMLButtonElement>();

    this.__renderOptionButton(gradient, index, refMainContainer, refActionButton, refDeleteButton);
    this.colorGradients.push(gradient);
    this.colorGradientOptionRefs.push({ mainButton: refActionButton, deleteButton: refDeleteButton });
    // Add to container
    this.positioningContainerRef.current.appendChild(refMainContainer.current);
  }

  // public removeGradient

  // +---------------------------------------------------------------------------------
  // | A helper function to remove all child nodes.
  // +-------------------------------
  private __removeAllChildNodes(node: Node) {
    while (node.lastChild) {
      node.removeChild(node.lastChild);
    }
  }

  /**
   * Adds a new color gradient change listener to this ColorGradientPicker.
   *
   * @param {ColorGradientChangeListener} listener - The listener to add.
   * @returns {boolean} True, if the listener was added and did not exist before.
   */
  addChangeListener(listener: ColorGradientSelectorChangeListener): boolean {
    for (var i = 0; i < this.installedChangeListeners.length; i++) {
      if (this.installedChangeListeners[i] === listener) {
        return false;
      }
    }
    this.installedChangeListeners.push(listener);
    return true;
  }

  /**
   *
   * @param {ColorGradientChangeListener} listener The listener to remove.
   * @returns {boolean} True, if the listener existed and has been removed.
   */
  removeChangeListener(listener: ColorGradientSelectorChangeListener): boolean {
    for (var i = 0; i < this.installedChangeListeners.length; i++) {
      if (this.installedChangeListeners[i] === listener) {
        this.installedChangeListeners.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  public getSelectedColorGradient(): ColorGradient {
    return this.colorGradients[this.selectedGradientIndex];
  }

  private __fireChangeEvent() {
    const newColorGradient = this.getSelectedColorGradient();
    for (var i = 0; i < this.installedChangeListeners.length; i++) {
      this.installedChangeListeners[i](newColorGradient, this.selectedGradientIndex, this);
    }
  }

  /**
   * Creates a handler for click events on the main button.
   *
   * @returns
   */
  private __mainButtonClickHandler(): (evt: MouseEvent) => void {
    const _self = this;
    return (_evt: MouseEvent): void => {
      // _self.mainButtonContainerRef.current.style.visibility = "hidden";
      _self.positioningContainerRef.current.style.visibility = _self.isDropdownOpen ? "hidden" : "visible";
      _self.isDropdownOpen = !_self.isDropdownOpen;
    };
  }

  /**
   * Creates a handler for click events on one of the option button in the dropdown.
   *
   * @returns
   */
  private __optionButtonClickHandler(): (evt: MouseEvent) => void {
    const _self = this;
    return (evt: MouseEvent): void => {
      _self.positioningContainerRef.current.style.visibility = "hidden";
      _self.isDropdownOpen = false;
      const targetButton: HTMLButtonElement = evt.currentTarget as HTMLButtonElement;
      const clickedIndex_raw: string = targetButton.dataset["gradientIndex"];
      const clickedIndex: number = Number.parseInt(clickedIndex_raw);
      console.log("clickedIndex", clickedIndex, clickedIndex_raw, targetButton.dataset, targetButton);
      if (Number.isNaN(clickedIndex)) {
        // Stop here. This is not what we want.
        return;
      }
      // Find child: and set selected.
      _self.__setSelectedIndex(clickedIndex);
      _self.__fireChangeEvent();
    };
  }

  private __optionButtonDeleteHandler(): (evt: MouseEvent) => void {
    const _self = this;
    return (evt: MouseEvent): void => {
      const targetButton: HTMLButtonElement = evt.currentTarget as HTMLButtonElement;
      const clickedIndex_raw: string = targetButton.dataset["gradientIndex"];
      const clickedIndex: number = Number.parseInt(clickedIndex_raw);
      console.log("clickedIndex", clickedIndex, clickedIndex_raw, targetButton.dataset, targetButton);
      if (Number.isNaN(clickedIndex)) {
        // Stop here. This is not what we want.
        return;
      }
      // Find child: and remove from DOM
      console.log("this.colorGradientOptionRefs", this.colorGradientOptionRefs, "clickedIndex", clickedIndex);
      const refPair = this.colorGradientOptionRefs[clickedIndex];
      // TODO: find containing parent and remove that!
      // ...
      refPair.mainButton.current.parentElement.remove();
      // Remove from logic
      this.colorGradients.splice(clickedIndex, 1); // Remove 1 element at the given index
      this.colorGradientOptionRefs.splice(clickedIndex, 1);
      // Update all following elements in the list.
      this.__updateOptionDataSetIndices(clickedIndex);
      console.log("All refs", this.colorGradientOptionRefs);
    };
  }

  /**
   * Once a slider element was added or removed then the following indices must be updated.
   *
   * @param {number} startIndex - The slider index to start updating at.
   */
  __updateOptionDataSetIndices(startIndex: number) {
    // Update all elements to the right of the new elelemt
    for (var i = startIndex; i < this.colorGradientOptionRefs.length; i++) {
      // this.colorGradientOptionRefs[i].current.setAttribute("gradientIndex", `${i}`);
      this.colorGradientOptionRefs[i].mainButton.current.dataset["gradientIndex"] = `${i}`;
      this.colorGradientOptionRefs[i].mainButton.current.querySelector;
    }
  }

  private __setSelectedIndex(newSelectedIndex: number): void {
    for (var i = 0; i < this.colorGradientOptionRefs.length; i++) {
      const ref: NoReact.Ref<HTMLButtonElement> = this.colorGradientOptionRefs[i].mainButton;
      // Find child: and set selected.
      ref.current.querySelectorAll(".option-gradient-radio-circle")[0].innerHTML = newSelectedIndex === i ? "🞊" : "🞅";
    }
    this.selectedGradientIndex = newSelectedIndex;
    const selectedGradient = this.colorGradients[this.selectedGradientIndex];
    // Display new gradient in the main button
    this.__setMainButtonGradient(selectedGradient);
  }

  /**
   * Sets the backround color of the main button (of this dropdown) element.
   *
   * @param {ColorGradient} gradient - The gradient color to display. Must not be null.
   */
  private __setMainButtonGradient(gradient: ColorGradient): void {
    const colorDisplay = this.mainButtonContainerRef.current.querySelectorAll(
      ".main-button-gradient-display"
    )[0] as HTMLDivElement;
    colorDisplay.style["background"] = gradient.toColorGradientString();
  }

  /**
   * Renders a new option button for the dropdown menu.
   *
   * @param {ColorGradient} gradient
   * @returns {JsxElement}
   */
  private __renderOptionButton(
    gradient: ColorGradient,
    index: number,
    refMainContainer: NoReact.Ref<HTMLDivElement>,
    refActionButton: NoReact.Ref<HTMLButtonElement>,
    refDelButton: NoReact.Ref<HTMLButtonElement>
  ): JsxElement {
    return (
      <div sx={{ d: "flex", flexDirection: "row" }} ref={refMainContainer}>
        <button
          className="option-gradient-button"
          onClick={this.__optionButtonClickHandler()}
          style={{
            d: "flex",
            w: "100%",
            fontSize: this.css_buttonFontSize,
            minHeight: this.css_buttonHeight,
            maxHeight: this.css_buttonHeight
          }}
          ref={refActionButton}
          data-gradientIndex={`${index}`}
        >
          <div className="option-gradient-radio-circle" sx={{ w: "2em", flexShrink: 2, alignContent: "center" }}>
            {index === 0 ? "🞊" : "🞅"}
          </div>
          <div sx={{ w: "calc( 100% - 2em )", mr: "1em", background: gradient.toColorGradientString() }}>&nbsp;</div>
        </button>
        <button
          classname="option-delete-button"
          sx={{ fontSize: this.css_buttonFontSize, minHeight: this.css_buttonHeight, maxHeight: this.css_buttonHeight }}
          onClick={this.__optionButtonDeleteHandler()}
          data-gradientIndex={`${index}`}
          ref={refDelButton}
        >
          <div sx={{ w: "2em", flexShrink: 2, alignContent: "center" }}>🗑</div>
        </button>
      </div>
    );
  }

  /**
   * Creates a new array of option buttons (refs).
   * @returns
   */
  private _renderAllOptionButtons(): Array<JsxElement> {
    const _self = this;
    // First clear all references
    _self.colorGradientOptionRefs = [];
    return this.colorGradients.map((colorGradient: ColorGradient, index: number) => {
      // console.log("num", num, index);
      const refMainContainer: NoReact.Ref<HTMLDivElement> = NoReact.useRef<HTMLDivElement>();
      const refActionButton: NoReact.Ref<HTMLButtonElement> = NoReact.useRef<HTMLButtonElement>();
      const refDelButton: NoReact.Ref<HTMLButtonElement> = NoReact.useRef<HTMLButtonElement>();
      _self.colorGradientOptionRefs.push({ mainButton: refActionButton, deleteButton: refDelButton });
      return this.__renderOptionButton(colorGradient, index, refMainContainer, refActionButton, refDelButton);
    });
  }

  /**
   * Init the container contents.
   *
   * @private
   */
  private _render(): HTMLElement {
    const _self = this;
    // console.log("Rendering ...", NoReact);
    this.containerRef = NoReact.useRef<HTMLDivElement>();
    this.mainButtonContainerRef = NoReact.useRef<HTMLButtonElement>();
    this.positioningContainerRef = NoReact.useRef<HTMLDivElement>();

    const selectedGradient: ColorGradient = this.colorGradients[this.selectedGradientIndex];

    return (
      <div
        id={this.elementID}
        className="color-gradient-selector"
        style={{ minWidth: this.css_buttonWidth, maxWidth: this.css_buttonWidth, pos: "relative" }}
        ref={this.containerRef}
        // onMouseDown={this.__containerMouseDownHandler()}
        // onClick={this.__containerClickHandler()}
      >
        <button
          className="main-button"
          ref={this.mainButtonContainerRef}
          style={{
            d: "flex",
            minWidth: this.css_buttonWidth,
            maxWidth: this.css_buttonWidth,
            minHeight: this.css_buttonHeight,
            maxHeight: this.css_buttonHeight
          }}
          onClick={this.__mainButtonClickHandler()}
        >
          <div
            className="main-button-gradient-display"
            sx={{ w: `calc( 100% - ${this.css_buttonFontSize} )`, background: selectedGradient.toColorGradientString() }}
          >
            &nbsp;
          </div>
          <div sx={{ w: this.css_buttonHeight, flexShrink: 2, fontSize: this.css_buttonFontSize }}>▾</div>
        </button>
        <div
          className="positioning-container"
          ref={this.positioningContainerRef}
          style={{
            minWidth: this.css_buttonWidth,
            maxHeight: "25vh",
            overflowY: "scroll",
            v: "hidden",
            d: "flex",
            fd: "column",
            pos: "absolute",
            l: 0,
            zIndex: 999
          }}
        >
          {/* {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num: number, index: number) => { */}
          {/* {this.colorGradients.map((colorGradient: ColorGradient, index: number) => {
            // console.log("num", num, index);
            const ref: NoReact.Ref<HTMLButtonElement> = NoReact.useRef<HTMLButtonElement>();
            _self.colorGradientOptionRefs.push(ref);
            // return this.__renderOptionButton(this.colorGradients[index % this.colorGradients.length], index, ref);
            const optionButton: JsxElement = this.__renderOptionButton(colorGradient, index, ref);
            ref.current.dataset.gradientIndex = `${index}`;
            return optionButton;
          })} */}
          {_self._renderAllOptionButtons()}
        </div>
      </div>
    );
  } // END functionrender()

  /**
   * Adds custom styles (global STYLE tag).
   *
   * @private
   */
  private __createCustomStylesElement = () => {
    // Thanks to Ana Tudor
    //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
    return (
      <style>{`
    #${this.elementID} {

    }

    #${this.elementID} button {
      border: 1px solid lightgray;
      padding: 0.25em;
      background-color: rgba(255,255,255,0.9);
    }

    #${this.elementID} .main-button:hover {
      background-color: rgba(216,216,216,0.9);
    }

    #${this.elementID} .option-gradient-button:hover, #${this.elementID} .option-delete-button:hover {
      background-color: rgba(216,216,216,0.9);
    }

    `}</style>
    );
  };
}
