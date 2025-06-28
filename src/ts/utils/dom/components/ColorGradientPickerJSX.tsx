/**
 * @author  Ikaros Kappler
 * @date    2025-06-27
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

export class ColorGradientPicker {
  private baseID: number;

  private container: HTMLElement;
  private containerRef: NoReact.Ref<HTMLDivElement>;
  // private sliderElements: Array<HTMLInputElement>;
  private _sliderElementRefs: Array<NoReact.Ref<HTMLInputElement>> = [];
  // private colorInput: HTMLInputElement;
  private colorInputRef: NoReact.Ref<HTMLInputElement>;
  private indicatorContainer: HTMLDivElement;
  // private colorIndicatorButton: HTMLButtonElement;
  private colorIndicatorButtonRef: NoReact.Ref<HTMLButtonElement>;
  private sliderMin: number = 0;
  private sliderMax: number = 100;
  private indicatorWidth_num = 1.0;
  private indicatorWidth = "1em";
  private indicatorWidth_half = "0.5em";
  private indicatorHeight = "1em";

  private COLORSET: Array<string> = ["red", "orange", "yellow", "green", "blue", "purple"];

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
    // console.log("created", this.container);
    this.baseID = Math.floor(Math.random() * 65535);

    // this.__init();
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
    this._sliderElementRefs.push(ref);

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

  /**
   * Updates the container's background to display the configured color gradient.
   *
   * @private
   */
  __updateBackgroundGradient() {
    const colorGradient = this.getColorGradient();
    // console.log("__updateBackgroundGradient", colorGradient);
    // this.container.style["background"] = colorGradient;
    // console.log("this.containerRef.current", this.containerRef.current);
    this.containerRef.current.style["background"] = colorGradient;
    // console.log(this.container);
    // document.body.style["background"] = colorGradient;
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
      console.log("clicked");
      // _self.colorInput.dispatchEvent(new Event("input"));
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
          position: "relative",
          background: "linear-gradient(90deg, red 0%, orange 20%, yellow 40%, green 60%, blue 80%, purple 100%)"
        }}
        ref={this.containerRef}
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
