/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

import { Color } from "../../datastructures/Color";

export class ColorGradientPicker {
  private baseID: number;

  private container: HTMLElement;
  private containerRef: NoReact.Ref<HTMLDivElement>;
  private _sliderElementRefs: Array<NoReact.Ref<HTMLInputElement>> = [];
  private colorInputRef: NoReact.Ref<HTMLInputElement>;
  private colorIndicatorButtonRef: NoReact.Ref<HTMLButtonElement>;
  private sliderMin: number = 0;
  private sliderMax: number = 100;
  private indicatorWidth_num = 1.0;
  private indicatorWidth = "1em";
  private indicatorWidth_half = "0.5em";
  private indicatorHeight = "1em";

  private COLORSET: Array<string> = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0000ff", "#8800ff"];

  /**
   * The constructor.
   *
   * Pass a container ID or nothing – in the latter case the constructor will create
   * a new DIV element.
   *
   * @param {string?} containerID
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

    this.container.append(this._render("test"));
    this.__updateColorIndicator(0);
    this.__updateBackgroundGradient();
  } // END constructor

  createColorRangeInput(
    baseID: number,
    index: number,
    sliderMin: number,
    sliderMax: number,
    initialValue: number,
    initialColor: string
  ): JsxElement {
    const sliderHandler = this.__createSliderChangeHandler();
    const ref: NoReact.Ref<HTMLInputElement> = NoReact.useRef<HTMLInputElement>();
    // this._sliderElementRefs.push(ref);
    this._sliderElementRefs.splice(index, 0, ref);

    for (var i = index + 1; i < this._sliderElementRefs.length; i++) {
      this._sliderElementRefs[i].current.setAttribute("data-range-slider-index", `${i}`);
      this._sliderElementRefs[i].current.setAttribute("id", `rage-slider-${baseID}-${i}`);
    }

    return (
      <input
        id={`rage-slider-${baseID}-${index}`}
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={initialValue}
        style={{ position: "absolute", left: "0px", top: "0px", width: "100%" }}
        data-range-slider-index={index}
        data-color-value={initialColor}
        onChange={sliderHandler}
        onClick={sliderHandler}
        ref={ref}
      />
    );
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
      this.colorIndicatorButtonRef.current.style["background-color"] = newColor;
      _self.__updateBackgroundGradient();

      return true;
    };
  }

  __containerClickHandler(): (evt: MouseEvent) => void {
    const _self = this;
    const maxDifference = 0.01;
    return (evt: MouseEvent): void => {
      console.log("click");
      // e = Mouse click event.
      const target = evt.target as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      const x = evt.clientX - rect.left; //x position within the element.
      const width = rect.width; // target.clientWidth;
      const relativeValue: number = x / width;
      // TODO: check if ratio is far enough away from any slider
      const allSliderValues = _self.__getAllSliderValues();
      if (allSliderValues.length === 0) {
        return; // This should not happen: at least two values must be present in a gradient
      }
      console.log("width", width, "x", x, "relativeValue", relativeValue, "allSliderValues", allSliderValues);
      // Todo: Find closest ratio value
      // let closestSliderValue = Number.MAX_VALUE;
      let leftSliderIndex: number = 0;
      let closestSliderValue: number = allSliderValues[leftSliderIndex];
      for (var i = 1; i < allSliderValues.length; i++) {
        const curVal: number = allSliderValues[i];
        if (Math.abs(closestSliderValue - relativeValue) > Math.abs(curVal - relativeValue)) {
          closestSliderValue = curVal;
          leftSliderIndex = i - 1;
        }
      }
      const diff: number = Math.abs(closestSliderValue - relativeValue);
      console.log("closestSliderValue", closestSliderValue, "relativeValue", relativeValue, "difference", diff);
      if (diff >= maxDifference) {
        console.log("Add slider here");
        _self._addSliderAt(relativeValue, leftSliderIndex);
      } else {
        console.log("Don't add slider here.");
      }
    };
  }

  private _addSliderAt(relativeValue: number, leftSliderIndex: number) {
    const leftSlider: HTMLInputElement = this._sliderElementRefs[leftSliderIndex].current;
    // const colorAtPosition = this.__getSliderColorAt(relativeValue);
    const newColor: Color = this.__getSliderColorAt(relativeValue);
    const newSlider: JsxElement = this.createColorRangeInput(
      this.baseID,
      leftSliderIndex + 1,
      this.sliderMin,
      this.sliderMax,
      relativeValue, //  initialValue
      newColor.cssRGB() // initialColor: string
    );
    const sliderRef = this._sliderElementRefs[leftSliderIndex + 1];
    leftSlider.after(sliderRef.current);
  }

  __getSliderColorAt(relativePosition: number): Color {
    // Locate interval
    const leftIndex: number = this.__locateIntervalAt(relativePosition);
    const leftSliderValue: number = this.__getSliderValue(leftIndex, 0.5);
    const rightSliderValue: number = this.__getSliderValue(leftIndex + 1, 0.5);
    const positionInsideInterval: number = (relativePosition - leftSliderValue) / (rightSliderValue - leftSliderValue);
    const leftColorString: string = this.__getSliderColor(leftIndex, "#000000");
    const rightColorString: string = this.__getSliderColor(leftIndex + 1, "#000000");
    console.log("leftColorString", leftColorString, "rightColorString", rightColorString);
    const leftColorObject: Color = Color.parse(leftColorString);
    const rightColorObject: Color = Color.parse(rightColorString);
    const newColor: Color = leftColorObject.interpolate(rightColorObject, positionInsideInterval);
    return newColor;
  }

  __locateIntervalAt(relativePosition: number): number {
    for (var i = 0; i < this._sliderElementRefs.length; i++) {
      if (this.__getSliderValue(i, 1.0) <= relativePosition) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get the value of the n-th rangel slider.
   *
   * @param {number} sliderIndex
   * @param {number} fallback
   * @returns
   */
  __getSliderValue(sliderIndex: number, fallback: number): number {
    if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
      return fallback;
    }
    return Number.parseFloat(this._sliderElementRefs[sliderIndex].current.value);
  }

  __getAllSliderValues(): Array<number> {
    return this._sliderElementRefs.map((ref, index: number) => this.__getSliderPercentage(index));
  }

  /**
   * Updates the container's background to display the configured color gradient.
   *
   * @private
   */
  __updateBackgroundGradient() {
    const colorGradient = this.getColorGradient();
    this.containerRef.current.style["background"] = colorGradient;
  }

  __updateColorIndicator(rangeSliderIndex: number) {
    const colorValue = this.__getSliderColor(rangeSliderIndex, "grey");
    const ratio = this.__getSliderPercentage(rangeSliderIndex);
    // console.log("__updateColorIndicator", colorValue, ratio);
    this.colorIndicatorButtonRef.current.style["left"] = `calc( ${ratio * 100}% + ${
      (1.0 - ratio) * this.indicatorWidth_num * 0.5
    }em - ${ratio * this.indicatorWidth_num * 0.5}em)`;
    this.colorIndicatorButtonRef.current.style["background-color"] = colorValue;
    this.colorInputRef.current.value = colorValue;
    this.colorInputRef.current.dataset["activeSliderIndex"] = `${rangeSliderIndex}`;
  }

  /**
   * Get a color gradient CSS value string from the current editor settings.
   *
   * @instance
   * @memberof ColorGradientPicker
   * @returns {string}
   */
  public getColorGradient(): string {
    // Example:
    //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
    const buffer: Array<string | undefined> = ["linear-gradient( 90deg, "];
    for (var i = 0; i < this._sliderElementRefs.length; i++) {
      if (i > 0) {
        buffer.push(",");
      }
      const colorValue: string = this.__getSliderColor(i, "black");
      buffer.push(colorValue);
      // const sliderValue: number = this.__getSliderValue(i, 0.0);
      // const percentage: number = (this.sliderMin + sliderValue) / (this.sliderMax - this.sliderMin);
      const percentage = this.__getSliderPercentage(i);
      buffer.push(`${percentage * 100}%`);
    }
    buffer.push(")");

    return buffer.join(" ");
  }

  /**
   * Get the configured color value of the n-th rangel slider.
   *
   * @param {number} sliderIndex
   * @param {string} fallback
   * @returns
   */
  private __getSliderColor(sliderIndex: number, fallback: string): string {
    if (sliderIndex < 0 || sliderIndex >= this._sliderElementRefs.length) {
      return fallback;
    }
    const colorValue = this._sliderElementRefs[sliderIndex].current.dataset["colorValue"];
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
  private _render(name: string): HTMLElement {
    const _self = this;
    console.log("Rendering ...", NoReact);
    this.colorIndicatorButtonRef = NoReact.useRef<HTMLButtonElement>();
    this.colorInputRef = NoReact.useRef<HTMLInputElement>();
    this.containerRef = NoReact.useRef<HTMLDivElement>();

    const handleIndicatorButtonClick = () => {
      _self.colorInputRef.current.click();
    };

    const currentColors = [0, 1, 2, 3, 4, 5];
    const stepCount = currentColors.length;
    const elementId = `color-gradient-container-${this.baseID}`;
    return (
      <div
        id={elementId}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "32px",
          position: "relative"
        }}
        ref={this.containerRef}
        onClick={this.__containerClickHandler()}
      >
        {createCustomStylesElement(elementId)}
        {currentColors.map((index: number) => {
          const initialColor: string = this.COLORSET[index % this.COLORSET.length];
          const initialValue: number = (100 / (stepCount - 1)) * index;
          return this.createColorRangeInput(this.baseID, index, this.sliderMin, this.sliderMax, initialValue, initialColor);
        })}
        <div style={{ width: "100%" }}>
          <button
            id="color-indicator-button-1234"
            style={{
              position: "absolute",
              bottom: "0px",
              left: "0%",
              backgroundColor: "grey",
              borderRadius: "3px",
              border: "1px solid grey",
              width: this.indicatorWidth, // "1em",
              height: this.indicatorHeight, // "1em",
              transform: "translate(-50%, 100%)"
            }}
            onClick={handleIndicatorButtonClick}
            ref={this.colorIndicatorButtonRef}
          ></button>
        </div>
        <input
          type="color"
          style={{ visibility: "hidden" }}
          data-active-slider-index=""
          ref={this.colorInputRef}
          onInput={this.__colorChangeHandler()}
        />
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
