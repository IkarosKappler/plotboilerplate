/**
 * @author  Ikaros Kappler
 * @date    2025-06-07
 * @version 1.0.0
 */

export class ColorGradientPicker {
  private container: HTMLElement;
  private sliderElements: Array<HTMLInputElement>;

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
    console.log("created", this.container);

    this.__init();
  }

  private __init() {
    this.__addCustomStyles();
    this.__setContainerLayout();
    console.log("Init");
    const stepCount: number = 5;
    this.sliderElements = [];
    for (var i = 0; i < stepCount; i++) {
      this.__createRangeSlider((100 / (stepCount - 1)) * i, i);
    }
  }

  private __setContainerLayout() {
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.width = "100%";
    this.container.style.height = "32px";
    this.container.style.position = "relative";
  }

  private __createRangeSlider(value: number, index: number) {
    const rangeSlider = document.createElement("input");
    rangeSlider.setAttribute("id", `rage-slider-${index}`);
    rangeSlider.setAttribute("type", "range");
    rangeSlider.setAttribute("min", "0");
    rangeSlider.setAttribute("max", "100");
    rangeSlider.setAttribute("value", `${value}`);
    this.container.appendChild(rangeSlider);
    this.sliderElements.push(rangeSlider);

    rangeSlider.style.position = "absolute";
    rangeSlider.style.left = "0";
    rangeSlider.style.top = "0";
    rangeSlider.style.width = "100%";

    rangeSlider.addEventListener("change", e => {
      console.log("Clicked", e.target ? (e.target as HTMLInputElement).getAttribute("id") : null);
    });
  }

  private __addCustomStyles() {
    const headElements = document.querySelector("head");
    if (headElements) {
      const styleElement = document.createElement("style");
      // Thanks to Ana Tudor
      //    https://css-tricks.com/multi-thumb-sliders-particular-two-thumb-case/
      styleElement.innerHTML = `
      input[type='range'] {

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

      input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;

        background: none; /* get rid of Firefox track background */
        height: 100%;
        width: 100%;

        pointer-events: none;
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: currentcolor;
        border: none; /* get rid of Firefox thumb border */
        border-radius: 0; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: 1em; 
        height: 1em;
      }

      input[type='range']::-moz-range-track {
        -webkit-appearance: none;

        background: none; /* get rid of Firefox track background */
        height: 100%;
        width: 100%;

        pointer-events: none;

      }

      input[type='range']::-moz-range-thumb {
        /* -webkit-appearance: none; */
        background: currentcolor;
        border: none; /* get rid of Firefox thumb border */
        border-radius: 0; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: 1em; 
        height: 1em;
      }
      `;
      headElements.appendChild(styleElement);
    }
  }
}
