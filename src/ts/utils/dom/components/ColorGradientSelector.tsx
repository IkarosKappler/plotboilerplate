/**
 * A simple class for rendering dropdowns
 *
 * @author  Ikaros Kappler
 * @date    2025-08-19
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

import { Color } from "../../datastructures/Color";
import { ColorGradient, ColorGradientItem } from "../../datastructures/ColorGradient";

export type ColorGradientSelectorChangeListener = (colorGradient: ColorGradient, source: ColorGradientSelector) => void;

export class ColorGradientSelector {
  private readonly baseID: number;
  private readonly elementID: string;

  private container: HTMLElement;
  private containerRef: NoReact.Ref<HTMLDivElement>;
  private mainButtonContainerRef: NoReact.Ref<HTMLButtonElement>;
  private positioningContainerRef: NoReact.Ref<HTMLDivElement>;

  private isDropdownOpen: boolean = false;

  /**
   * The constructor: creates a new color gradient picker in the given container.
   * If no container or ID is given then a new unbound `container` will be created (DIV).
   *
   * Pass a container ID or nothing – in the latter case the constructor will create
   * a new DIV element.
   *
   * @param {string?} containerID - (optional) If you want to use an existing container (should be a DIV).
   */
  constructor(containerID?: string) {
    if (containerID) {
      const cont = document.getElementById(containerID);
      if (!cont) {
        throw "Cannot create ColorGradientPicker. Component ID does not exist.";
      }
      this.container = cont;
    } else {
      this.container = document.createElement("div");
    }
    this.baseID = Math.floor(Math.random() * 65535);
    this.elementID = `color-gradient-selector-${this.baseID}`;

    document.head.appendChild(this.__createCustomStylesElement());
    this.container.append(this._render());
  } // END constructor

  /**
   * Adds a new color gradient change listener to this ColorGradientPicker.
   *
   * @param {ColorGradientChangeListener} listener - The listener to add.
   * @returns {boolean} True, if the listener was added and did not exist before.
   */
  addChangeListener(listener: ColorGradientSelectorChangeListener): boolean {
    // for (var i = 0; i < this.installedChangeListeners.length; i++) {
    //   if (this.installedChangeListeners[i] === listener) {
    //     return false;
    //   }
    // }
    // this.installedChangeListeners.push(listener);
    return true;
  }

  /**
   *
   * @param {ColorGradientChangeListener} listener The listener to remove.
   * @returns {boolean} True, if the listener existed and has been removed.
   */
  removeChangeListener(listener: ColorGradientSelectorChangeListener): boolean {
    // for (var i = 0; i < this.installedChangeListeners.length; i++) {
    //   if (this.installedChangeListeners[i] === listener) {
    //     this.installedChangeListeners.splice(i, 1);
    //     return true;
    //   }
    // }
    return false;
  }

  private __fireChangeEvent() {
    // const newColorGradient = this.getColorGradient();
    // for (var i = 0; i < this.installedChangeListeners.length; i++) {
    //   this.installedChangeListeners[i](newColorGradient, this);
    // }
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
   * Creates a handler for click events on the main button.
   *
   * @returns
   */
  private __optionButtonClickHandler(): (evt: MouseEvent) => void {
    const _self = this;
    return (_evt: MouseEvent): void => {
      // _self.mainButtonContainerRef.current.style.visibility = "visible";
      _self.positioningContainerRef.current.style.visibility = "hidden";
      _self.isDropdownOpen = false;
    };
  }

  /**
   * Renders a new option button for the dropdown menu.
   *
   * @param {ColorGradient} gradient
   * @returns {JsxElement}
   */
  private __renderOptionButton(gradient: ColorGradient, index: number): JsxElement {
    return (
      <button className="option-gradient" onClick={this.__optionButtonClickHandler()} style={{ d: "flex", w: "100%" }}>
        <div sx={{ w: "2em", flexShrink: 2 }}>{index == 0 ? "🞊" : "🞅"}</div>
        <div sx={{ w: "calc( 100% - 2em )", background: gradient.toColorGradientString() }}>&nbsp;</div>
      </button>
    );
  }

  /**
   * Init the container contents.
   *
   * @private
   */
  private _render(): HTMLElement {
    const _self = this;
    // console.log("Rendering ...", NoReact);
    // this.colorIndicatorColorButtonRef = NoReact.useRef<HTMLButtonElement>();
    // this.colorIndicatorRemoveButtonRef = NoReact.useRef<HTMLButtonElement>();
    // this.colorInputRef = NoReact.useRef<HTMLInputElement>();
    // this.colorInputContainerRef = NoReact.useRef<HTMLInputElement>();
    this.containerRef = NoReact.useRef<HTMLDivElement>();
    this.mainButtonContainerRef = NoReact.useRef<HTMLButtonElement>();
    this.positioningContainerRef = NoReact.useRef<HTMLDivElement>();

    const gradients: Array<ColorGradient> = [
      ColorGradient.createDefault(),
      ColorGradient.createFrom(Color.RED, Color.GREEN),
      ColorGradient.createFrom(Color.BLUE, Color.GOLD)
    ];
    const selectedGradient: ColorGradient = gradients[0];

    return (
      <div
        id={this.elementID}
        className="color-gradient-selector"
        style={{ minWidth: "100px", pos: "relative" }}
        ref={this.containerRef}
        // onMouseDown={this.__containerMouseDownHandler()}
        // onClick={this.__containerClickHandler()}
      >
        <button
          className="main-button"
          ref={this.mainButtonContainerRef}
          style={{ /* pos: "absolute", l: 0, t: 0, */ d: "flex", minWidth: "100px" }}
          onClick={this.__mainButtonClickHandler()}
        >
          <div sx={{ w: "calc( 100% - 2em )", background: selectedGradient.toColorGradientString() }}>&nbsp;</div>
          <div sx={{ w: "2em", flexShrink: 2 }}>▾</div>
        </button>
        <div
          className="positioning-container"
          ref={this.positioningContainerRef}
          style={{
            minWidth: "100px",
            maxHeight: "25vh",
            overflowY: "scroll",
            v: "hidden",
            d: "flex",
            fd: "column",
            pos: "absolute",
            l: 0
            // t: 0
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num: number, index: number) => {
            // console.log("num", num, index);
            return this.__renderOptionButton(gradients[index % gradients.length], index);
          })}
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
    `}</style>
    );
  };
}
