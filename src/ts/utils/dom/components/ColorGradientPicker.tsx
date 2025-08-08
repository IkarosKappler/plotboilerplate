/**
 * Approach for a 'simple' color gradient picker for my PlotBoilerplate library.
 *
 * As it turned out a bit more complex in the end – due to the fact that color gradient
 * picking is not a super simple task – so I used JSX here. Thus a JSX library is required
 * to get this running: NoReact.
 *
 *
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

import { Color } from "../../datastructures/Color";
import { ColorGradient, ColorGradientItem } from "../../datastructures/ColorGradient";

export type ColorGradientChangeListener = (colorGradient: ColorGradient, source: ColorGradientPicker) => void;

export class ColorGradientPicker {
  private readonly baseID: number;

  private container: HTMLElement;
  private containerRef: NoReact.Ref<HTMLDivElement>;
  private _sliderElementRefs: Array<NoReact.Ref<HTMLInputElement>> = [];
  private colorInputRef: NoReact.Ref<HTMLInputElement>;
  private colorIndicatorColorButtonRef: NoReact.Ref<HTMLButtonElement>;
  private colorIndicatorRemoveButtonRef: NoReact.Ref<HTMLButtonElement>;
  private colorInputContainerRef: NoReact.Ref<HTMLDivElement>;
  private sliderMin: number = 0;
  private sliderMax: number = 100;
  private indicatorWidth_num = 1.0;
  private indicatorWidth = "1em";
  // private indicatorWidth_half = "0.5em";
  private indicatorHeight = "1em";

  private DEFAULT_COLORSET: Array<ColorGradientItem> = [
    { color: Color.RED, ratio: 0.0 },
    { color: Color.GOLD, ratio: 0.2 },
    { color: Color.YELLOW, ratio: 0.4 },
    { color: Color.LIME_GREEN, ratio: 0.6 },
    { color: Color.MEDIUM_BLUE, ratio: 0.8 },
    { color: Color.PURPLE, ratio: 1.0 }
  ];

  private colorGradient: ColorGradient;

  private installedChangeListeners: Array<ColorGradientChangeListener> = [];

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
    this.colorGradient = new ColorGradient(this.DEFAULT_COLORSET, Math.PI / 2.0);

    this.container.append(this._render());
    this.__updateColorIndicator(0);
    this.__updateBackgroundGradient();
  } // END constructor

  /**
   * Adds a new color gradient change listener to this ColorGradientPicker.
   *
   * @param {ColorGradientChangeListener} listener - The listener to add.
   * @returns {boolean} True, if the listener was added and did not exist before.
   */
  addChangeListener(listener: ColorGradientChangeListener): boolean {
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
  removeChangeListener(listener: ColorGradientChangeListener): boolean {
    for (var i = 0; i < this.installedChangeListeners.length; i++) {
      if (this.installedChangeListeners[i] === listener) {
        this.installedChangeListeners.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  private __fireChangeEvent() {
    const newColorGradient = this.getColorGradient();
    for (var i = 0; i < this.installedChangeListeners.length; i++) {
      this.installedChangeListeners[i](newColorGradient, this);
    }
  }

  /**
   * Creates a new color range input element.
   *
   * @private
   * @param {number} baseID
   * @param index
   * @param sliderMin
   * @param sliderMax
   * @param initialValue
   * @param initialColor
   * @returns
   */
  private __createColorRangeInput(
    index: number,
    sliderMin: number,
    sliderMax: number,
    initialValue: number,
    initialColor: Color
  ): JsxElement {
    const sliderHandler = this.__createSliderChangeHandler();
    const ref: NoReact.Ref<HTMLInputElement> = NoReact.useRef<HTMLInputElement>();
    // this._sliderElementRefs.push(ref);
    this._sliderElementRefs.splice(index, 0, ref);
    console.log("new _sliderElementRefs", this._sliderElementRefs);

    // Update all elements to the right of the new elelemt
    // for (var i = index + 1; i < this._sliderElementRefs.length; i++) {
    //   this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
    //   this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
    // }
    this.__updateSliderDataSetIndices(index + 1);

    return (
      <input
        id={`rage-slider-${this.baseID}-${index}`}
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={initialValue}
        style={{ position: "absolute", left: "0px", top: "0px", width: "100%" }}
        data-range-slider-index={index}
        data-color-value={initialColor.cssRGB()}
        onChange={sliderHandler}
        onClick={sliderHandler}
        // onMouseDown={mouseDownHandler}
        // onMouseUp={mouseUpHandler}
        ref={ref}
      />
    );
  }

  getRangeLength(): number {
    return this.sliderMax - this.sliderMin;
  }

  /**
   * Creates a callback function for range slider.
   *
   * @returns
   */
  __createSliderChangeHandler = (): ((e: Event) => boolean) => {
    const _self = this;
    return (e: Event): boolean => {
      const targetSlider: HTMLInputElement = e.target as HTMLInputElement;
      console.log("Clicked", targetSlider ? targetSlider.getAttribute("id") : null);
      if (!targetSlider) {
        return false;
      }
      const currentSliderValue: number = Number.parseFloat(targetSlider.value);
      const rangeSliderIndexRaw: string | undefined = targetSlider.dataset["rangeSliderIndex"];
      console.log("rangeSliderIndexRaw", rangeSliderIndexRaw);
      if (!rangeSliderIndexRaw) {
        return false;
      }
      const rangeSliderIndex: number = Number.parseInt(rangeSliderIndexRaw);
      var leftSliderValue = this.__getSliderValue(rangeSliderIndex - 1, _self.sliderMin);
      var rightSliderValue = this.__getSliderValue(rangeSliderIndex + 1, _self.sliderMax);
      if (leftSliderValue >= currentSliderValue) {
        targetSlider.value = `${leftSliderValue}`;
        _self.__updateBackgroundGradient();
        _self.__updateColorIndicator(rangeSliderIndex);
        return false;
      } else if (rightSliderValue <= currentSliderValue) {
        targetSlider.value = `${rightSliderValue}`;
        _self.__updateBackgroundGradient();
        _self.__updateColorIndicator(rangeSliderIndex);

        return false;
      } else {
        _self.__updateBackgroundGradient();
        _self.__updateColorIndicator(rangeSliderIndex);
        return true;
      }
    };
  };

  __colorChangeHandler(): (_evt: Event) => boolean {
    const _self = this;
    return (_evt: Event): boolean => {
      // const colorInput : HTMLInputElement | null = evt.target;
      console.log("__colorChangeHandler");
      const activeSliderIndex_raw = this.colorInputRef.current.dataset["activeSliderIndex"];
      if (!activeSliderIndex_raw) {
        console.warn("Cannot update color indicator; no active range slider set.");
        return false;
      }
      const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
      if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= _self._sliderElementRefs.length) {
        console.warn("Cannot update color indicator; active index invalid or out of bounds.", activeSliderIndex);
        return false;
      }

      const newColor: string = _self.colorInputRef.current.value;
      const rangeSlider: HTMLInputElement = _self._sliderElementRefs[activeSliderIndex].current;
      rangeSlider.dataset["colorValue"] = newColor;
      // rangeSlider.dataset["colorValue"] = newColor;
      this.colorIndicatorColorButtonRef.current.style["background-color"] = newColor;
      _self.__updateBackgroundGradient();
      _self.__fireChangeEvent();

      return true;
    };
  }

  /**
   * Removed the current color slider from the DOM and highlights the left neighbour.
   * @returns
   */
  __handleRemoveColor(): boolean {
    // const colorInput : HTMLInputElement | null = evt.target;
    console.log("__colorChangeHandler");
    const activeSliderIndex_raw = this.colorInputRef.current.dataset["activeSliderIndex"];
    if (!activeSliderIndex_raw) {
      console.warn("Cannot remove color indicator; no active range slider set.");
      return false;
    }
    const activeSliderIndex = Number.parseInt(activeSliderIndex_raw);
    if (Number.isNaN(activeSliderIndex) || activeSliderIndex < 0 || activeSliderIndex >= this._sliderElementRefs.length) {
      console.warn("Cannot remove color indicator; active index invalid or out of bounds.", activeSliderIndex);
      return false;
    }

    if (activeSliderIndex === 0 || activeSliderIndex + 1 === this.getRangeLength()) {
      console.warn("Cannot remove color indicator; leftmost and rightmost slider must not be removed.", activeSliderIndex);
      return false;
    }

    const sliderElementRef = this._sliderElementRefs[activeSliderIndex];
    sliderElementRef.current.remove();
    this._sliderElementRefs.splice(activeSliderIndex, 1);

    // Update all elements to the right of the removed elelemt
    this.__updateSliderDataSetIndices(activeSliderIndex);

    // Set left element active
    this.__updateColorIndicator(activeSliderIndex - 1);
    this.__updateBackgroundGradient();
    this.__fireChangeEvent();
    return true;
  }

  __updateSliderDataSetIndices(startIndex: number) {
    // Update all elements to the right of the new elelemt
    for (var i = startIndex; i < this._sliderElementRefs.length; i++) {
      this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
      this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${this.baseID}-${i}`);
    }
  }

  __containerClickHandler(): (evt: MouseEvent) => void {
    const _self = this;
    const maxDifference = _self.getRangeLength() * 0.03;
    return (evt: MouseEvent): void => {
      const relativeValue: number = this.__clickEventToRelativeValue(evt);
      if (relativeValue < 0 || relativeValue > 1.0) {
        // Clicked somewhere outside the range
        return;
      }
      const absoluteValue: number = this.__relativeToAbsolute(relativeValue);
      console.log("click", "relativeValue", relativeValue, "absoluteValue", absoluteValue);
      // Check if click position (ratio) is far enough away from any slider
      const [leftSliderIndex, closestSliderValue] = _self.__locateClosestSliderValue(absoluteValue);
      const diff: number = Math.abs(closestSliderValue - absoluteValue);
      // console.log(
      //   "[__containerClickHandler] closestSliderValue",
      //   closestSliderValue,
      //   "leftSliderIndex",
      //   leftSliderIndex,
      //   "relativeValue",
      //   relativeValue,
      //   "difference",
      //   diff
      // );
      if (diff >= maxDifference) {
        console.log("Add slider here");
        _self.__addSliderAt(absoluteValue, leftSliderIndex);
      } else {
        // console.debug("Don't add slider here.");
      }
    };
  }

  private __locateClosestSliderValue(absoluteValue: number): [number, number] {
    const allSliderValues: number[] = this.__getAllSliderValues();
    console.log("allSliderValues", allSliderValues);
    if (allSliderValues.length === 0) {
      console.warn("[Warn] All slider values array is empty. This should not happen, cannot proceed.");
      return [NaN, NaN]; // This should not happen: at least two values must be present in a gradient
    }
    console.log("__locateClosestSliderValue", "allSliderValues", allSliderValues);
    // Todo: Find closest ratio value
    // let closestSliderValue = Number.MAX_VALUE;
    let leftSliderIndex: number = 0;
    let closestSliderValue: number = allSliderValues[leftSliderIndex];
    for (var i = 1; i < allSliderValues.length; i++) {
      const curVal: number = allSliderValues[i];
      if (Math.abs(curVal - absoluteValue) < Math.abs(closestSliderValue - absoluteValue)) {
        closestSliderValue = curVal;
        if (curVal > absoluteValue) {
          leftSliderIndex = i - 1;
        } else {
          leftSliderIndex = i;
        }
      }
    }
    return [leftSliderIndex, closestSliderValue];
  }

  /**
   * Convert the click event to the relative x value in [0..1].
   *
   * @param {MouseEvent} evt - The mouse event.
   * @returns {number} The relative x value.
   */
  private __clickEventToRelativeValue(evt: MouseEvent): number {
    const target: HTMLDivElement = evt.target as HTMLDivElement;
    const rect: DOMRect = target.getBoundingClientRect();
    const x: number = evt.clientX - rect.left; //x position within the element.
    const width: number = rect.width; // target.clientWidth;
    const relativeValue: number = x / width;
    console.log("width", width, "x", x, "relativeValue", relativeValue);
    return relativeValue;
  }

  /**
   * Adds a slider at the given interval index.
   *
   * @param {number} absoluteValue - The absolute new slider value.
   * @param {number} leftSliderIndex - The new slider's position (interval index).
   */
  private __addSliderAt(absoluteValue: number, leftSliderIndex: number) {
    console.log("__addSliderAt", "absoluteValue", absoluteValue, "leftSliderIndex", leftSliderIndex);
    const leftSlider: HTMLInputElement = this._sliderElementRefs[leftSliderIndex].current;
    // const colorAtPosition = this.__getSliderColorAt(relativeValue);
    const newColor: Color = this.__getSliderColorAt(absoluteValue);
    const newSliderIndex: number = leftSliderIndex + 1;
    const _newSlider: JsxElement = this.__createColorRangeInput(
      newSliderIndex,
      this.sliderMin,
      this.sliderMax,
      absoluteValue,
      newColor // initialColor: string
    );
    const sliderRef = this._sliderElementRefs[newSliderIndex];
    leftSlider.after(sliderRef.current);
    // No visible change, but let's reflect this in the output gradient anyway
    this.__updateBackgroundGradient();
    // Highlight the newly added range slider
    this.__updateColorIndicator(newSliderIndex);
    this.__fireChangeEvent();
  }

  /**
   * Get the slider color at the given absolute value. That value must be inside the [MIN_VALUE, MAX_VALUE] interval.
   * @param absoluteValue
   * @returns
   */
  private __getSliderColorAt(absoluteValue: number): Color {
    console.log("__getSliderColorAt", "absoluteValue", absoluteValue);
    // Locate interval
    const leftIndex: number = this.__locateIntervalAt(absoluteValue);
    const leftSliderValue: number = this.__getSliderValue(leftIndex, NaN);
    const rightSliderValue: number = this.__getSliderValue(leftIndex + 1, NaN);
    if (Number.isNaN(leftSliderValue) || Number.isNaN(rightSliderValue)) {
      console.warn(
        `[Warn] Failed to determine left/right slider values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`
      );
      return null;
    }
    const leftColorString: string = this.__getSliderColorString(leftIndex, null);
    const rightColorString: string = this.__getSliderColorString(leftIndex + 1, null);
    if (!leftColorString || !rightColorString) {
      console.warn(
        `[Warn] Failed to determine left/right color string values at indices ${leftIndex} or ${rightSliderValue}. Cannot proceed for absolute value ${absoluteValue}.`
      );
      return null;
    }
    const positionInsideInterval: number = (absoluteValue - leftSliderValue) / (rightSliderValue - leftSliderValue);
    console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
    const leftColorObject: Color = Color.parse(leftColorString);
    const rightColorObject: Color = Color.parse(rightColorString);
    const newColor: Color = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
    // console.log(
    //   "absoluteValue",
    //   absoluteValue,
    //   "leftIndex",
    //   leftIndex,
    //   "leftSliderValue",
    //   leftSliderValue,
    //   "leftColorObject",
    //   leftColorObject.cssRGB(),
    //   "rightSliderValue",
    //   rightSliderValue,
    //   "rightColorObject",
    //   rightColorObject.cssRGB(),
    //   "positionInsideInterval",
    //   positionInsideInterval,
    //   "newColor",
    //   newColor.cssRGB()
    // );
    return newColor;
  }

  /**
   * Locate the slider interval that contains the given (absolute) slider value. The given value must be
   * somewhere between MIN_VALUE and MAX_VALUE (usually between 0 and 100 in the default configuraion.).
   *
   * @param {number} absoluteValue - The absolute value to search for.
   * @returns {number} The left slider inder the containing interval is starting with – or -1 if out of bounds.
   */
  private __locateIntervalAt(absoluteValue: number): number {
    for (var i = 0; i + 1 < this._sliderElementRefs.length; i++) {
      if (
        this.__getSliderValue(i, this.sliderMin) <= absoluteValue &&
        absoluteValue < this.__getSliderValue(i + 1, this.sliderMax)
      ) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Converts a relative value in [0..1] to [min..max].
   * @param relativeValue
   */
  private __relativeToAbsolute(relativeValue: number): number {
    return this.sliderMin + (this.sliderMax - this.sliderMin) * relativeValue;
  }

  /**
   * Converts a relative value in [0..1] to [min..max].
   * @param relativeValue
   */
  private __absoluteToRelative(absolute: number): number {
    return (absolute - this.sliderMin) / (this.sliderMax - this.sliderMin);
  }

  /**
   * Get the value of the n-th rangel slider.
   *
   * @param {number} sliderIndex
   * @param {number} fallback
   * @returns
   */
  private __getSliderValue(sliderIndex: number, fallback: number): number {
    if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
      return fallback;
    }
    return Number.parseFloat(this._sliderElementRefs[sliderIndex].current.value);
  }

  /**
   * Get all current slider values as an array.
   * @returns
   */
  private __getAllSliderValues(): Array<number> {
    return this._sliderElementRefs.map((ref, index: number) => this.__getSliderValue(index, NaN));
  }

  /**
   * Updates the container's background to display the configured color gradient.
   *
   * @private
   */
  private __updateBackgroundGradient() {
    // const colorGradient = this.getColorGradient();
    this.colorGradient = new ColorGradient(
      this.__getAllSliderValues().map((sliderValue: number, sliderIndex: number) => ({
        color: this.__getSliderColor(sliderIndex, null),
        ratio: this.__absoluteToRelative(sliderValue)
      })),
      this.colorGradient.angle
    );
    this.containerRef.current.style["background"] = this.colorGradient.toColorGradientString();
  }

  /**
   * After changes this function updates the color indicator button.
   *
   * @param {number} rangeSliderIndex - The new active slider index.
   */
  private __updateColorIndicator(rangeSliderIndex: number) {
    const colorValue = this.__getSliderColorString(rangeSliderIndex, "grey");
    const ratio = this.__getSliderPercentage(rangeSliderIndex);

    this.colorInputContainerRef.current.style["left"] = `calc( ${ratio * 100}% + ${
      (1.0 - ratio) * this.indicatorWidth_num * 0.5
    }em - ${ratio * this.indicatorWidth_num * 0.5}em)`;

    this.colorIndicatorColorButtonRef.current.style["background-color"] = colorValue;
    this.colorInputRef.current.value = colorValue;
    this.colorInputRef.current.dataset["activeSliderIndex"] = `${rangeSliderIndex}`;

    if (rangeSliderIndex <= 0 || rangeSliderIndex + 1 >= this.getRangeLength()) {
      this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "hidden";
    } else {
      this.colorIndicatorRemoveButtonRef.current.style["visibility"] = "visible";
    }
  }

  /**
   * Get a color gradient CSS value string from the current editor settings.
   *
   * @instance
   * @memberof ColorGradientPicker
   * @returns {ColorGradient}
   */
  public getColorGradient(): ColorGradient {
    // const values: Array<ColorGradientItem> = this._sliderElementRefs.map((_ref: NoReact.Ref<HTMLInputElement>, index: number) => {
    //   return { color: this.__getSliderColor(index, null), ratio: this.__getSliderPercentage(index) };
    // });
    // return new ColorGradient(values); //.toColorGradientString();
    return this.colorGradient;
  }

  /**
   * Get the configured color value of the n-th rangel slider.
   *
   * @param {number} sliderIndex
   * @param {string} fallback
   * @returns
   */
  private __getSliderColorString(sliderIndex: number, fallback: string): string {
    if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
      return fallback;
    }
    const colorValue = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
    return colorValue ? colorValue : fallback;
  }

  /**
   * Get get color of this gradient picker at the given slider index.
   *
   * @param {number} sliderIndex - The index to get the slider color from. Something between 0 and _sliderElementRefs.length.
   * @param {Color} fallback
   * @returns
   */
  private __getSliderColor(sliderIndex: number, fallback: Color): Color {
    if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
      return fallback;
    }
    const colorValueString = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
    const colorValue = Color.parse(colorValueString);
    return colorValue ? colorValue : fallback;
  }

  /**
   * Get the slider's value in a mapped range of 0.0 ... 1.0.
   *
   * @param sliderIndex
   * @returns
   */
  private __getSliderPercentage(sliderIndex): number {
    const sliderValue: number = this.__getSliderValue(sliderIndex, 0.0);
    const percentage: number = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
    return percentage;
  }

  /**
   * Init the container contents.
   *
   * @private
   */
  private _render(): HTMLElement {
    const _self = this;
    console.log("Rendering ...", NoReact);
    this.colorIndicatorColorButtonRef = NoReact.useRef<HTMLButtonElement>();
    this.colorIndicatorRemoveButtonRef = NoReact.useRef<HTMLButtonElement>();
    this.colorInputRef = NoReact.useRef<HTMLInputElement>();
    this.colorInputContainerRef = NoReact.useRef<HTMLInputElement>();
    this.containerRef = NoReact.useRef<HTMLDivElement>();

    const handleIndicatorButtonClick = (evt: Event) => {
      evt.preventDefault(); // Prevent other inputs to react to this event.
      evt.stopPropagation();
      // But fake a click on the input element
      _self.colorInputRef.current.click();
    };

    const handleRemoveColorButtonClick = (evt: Event) => {
      evt.preventDefault(); // Prevent other inputs to react to this event.
      evt.stopPropagation();
      console.log("Todo: remove color");
      // TODO
      _self.__handleRemoveColor();
    };

    // const currentColors = [0, 1, 2, 3, 4, 5];
    // const stepCount = this.colorGradient.values.length;
    const elementId = `color-gradient-container-${this.baseID}`;
    return (
      <div
        id={elementId}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "32px",
          position: "relative",
          marginBottom: "3em"
        }}
        ref={this.containerRef}
        onClick={this.__containerClickHandler()}
      >
        {createCustomStylesElement(elementId)}
        {this.colorGradient.values.map((colorGradientItem: ColorGradientItem, index: number) => {
          // const initialColor: string = this.DEFAULT_COLORSET[index % this.DEFAULT_COLORSET.length];
          // const initialValue: number = (100 / (stepCount - 1)) * index;
          const initialValue: number = _self.__relativeToAbsolute(colorGradientItem.ratio);
          // return this.__createColorRangeInput(index, this.sliderMin, this.sliderMax, initialValue, initialColor);
          return this.__createColorRangeInput(index, this.sliderMin, this.sliderMax, initialValue, colorGradientItem.color);
        })}
        <div style={{ width: "100%" }}>
          <input
            id={`color-indicator-input-${this.baseID}`}
            type="color"
            style={{ visibility: "hidden" }}
            data-active-slider-index=""
            ref={this.colorInputRef}
            onInput={this.__colorChangeHandler()}
          />
          <div
            ref={this.colorInputContainerRef}
            style={{
              position: "absolute",
              bottom: "0px",
              left: "0%",
              display: "flex",
              flexDirection: "column",
              transform: "translate(0%, 100%)"
            }}
          >
            <button
              id={`color-indicator-button-${this.baseID}`}
              style={{
                backgroundColor: "grey",
                borderRadius: "3px",
                border: "1px solid grey",
                width: this.indicatorWidth, // "1em",
                height: this.indicatorHeight, // "1em",
                transform: "translate(-50%, 0%)"
              }}
              onClick={handleIndicatorButtonClick}
              ref={this.colorIndicatorColorButtonRef}
            ></button>
            <button
              id={`color-remove-button-${this.baseID}`}
              className="color-remove-button"
              style={{
                backgroundColor: "grey",
                borderRadius: "3px",
                border: "1px solid grey",
                width: this.indicatorWidth, // "1em",
                height: this.indicatorHeight, // "1em",
                transform: "translate(-50%, 50%)",
                lineHeight: "0.5em",
                padding: 0
              }}
              onClick={handleRemoveColorButtonClick}
              ref={this.colorIndicatorRemoveButtonRef}
            >
              <span style={{ fontSize: "0.5em" }}>🗑</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Adds custom styles (global STYLE tag).
 *
 * @private
 */
const createCustomStylesElement = (elementId: string) => {
  const thumbWidth = "0.5em";
  const thumbHeight = "1.333em";
  // Thanks to Ana Tudor
  //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
  return (
    <style>{`
    #${elementId} input[type='range'] {

      -webkit-appearance: none;

      grid-column: 1;
      grid-row: 2;
      
      /* same as before */
      background: none; /* get rid of white Chrome background */
      color: #000;
      font: inherit; /* fix too small font-size in both Chrome & Firefox */
      margin: 0;
      pointer-events: none; /* let clicks pass through */
    }

    #${elementId} input[type='range']::-webkit-slider-runnable-track {
      -webkit-appearance: none;

      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;

      pointer-events: none;
    }

    #${elementId} input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${thumbWidth}; 
      height: ${thumbHeight};
    }

    #${elementId} input[type='range']:focus::-webkit-slider-thumb {
      border: 2px solid white;
    }

    #${elementId} input[type='range']::-moz-range-track {
      -webkit-appearance: none;
      background: none; /* get rid of Firefox track background */
      height: 100%;
      width: 100%;
      pointer-events: none;
    }

    #${elementId} input[type='range']::-moz-range-thumb {
      /* -webkit-appearance: none; */
      background: currentcolor;
      border: none; /* get rid of Firefox thumb border */
      border-radius: 6px; /* get rid of Firefox corner rounding */
      pointer-events: auto; /* catch clicks */
      width: ${thumbWidth}; 
      height: ${thumbHeight};
    }

    #${elementId} input[type='range']:focus::-moz-range-thumb {
      border: 2px solid white;
    }

    #${elementId} input[type='range'] {
      /* same as before */
      z-index: 1;
    }
    
    #${elementId} input[type='range']:focus {
        z-index: 2;
        /* outline: dotted 1px orange; */
        color: darkorange;
    }
    `}</style>
  );
};
