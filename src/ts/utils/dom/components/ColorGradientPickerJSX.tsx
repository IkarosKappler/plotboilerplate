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
  private sliderElements: Array<HTMLInputElement>;
  private colorInput: HTMLInputElement;
  private indicatorContainer: HTMLDivElement;
  private colorIndicatorButton: HTMLButtonElement;
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
    // this.__updateBackgroundGradient();
    this.container.append(this.render("test"));
  } // END constructor

  /**
   * Init the container contents.
   *
   * @private
   */
  public render(name: string): HTMLElement {
    const click1 = () => {
      console.log("First clicked");
    };

    const click2 = () => {
      console.log("Second clicked");
    };

    const mouseEnter = (event: Event) => {
      (event.target as HTMLDivElement).style["background-color"] = "grey";
    };

    const mouseOut = (event: Event) => {
      (event.target as HTMLDivElement).style["background-color"] = "DeepSkyBlue";
    };
    console.log("Rendering ...", NoReact);
    return (
      <div className="NoReact-main">
        Hello {name}
        <div className="NoReact-child-1" onClick={click1}>
          Hello Nested
        </div>
        <div
          className="NoReact-child-2"
          onClick={click2}
          onMouseEnter={mouseEnter}
          onMouseOut={mouseOut}
          style={{ backgroundColor: "yellow" }}
        >
          Hello Nested 2
        </div>
      </div>
    );
  }
}

const Test = (name: string): JsxElement => {
  const click1 = () => {
    console.log("First clicked");
  };

  const click2 = () => {
    console.log("Second clicked");
  };

  const mouseEnter = (event: Event) => {
    (event.target as HTMLDivElement).style["background-color"] = "grey";
  };

  const mouseOut = (event: Event) => {
    (event.target as HTMLDivElement).style["background-color"] = "DeepSkyBlue";
  };

  return (
    <div className="NoReact-main">
      Hello {name}
      <div className="NoReact-child-1" onClick={click1}>
        Hello Nested
      </div>
      <div
        className="NoReact-child-2"
        onClick={click2}
        onMouseEnter={mouseEnter}
        onMouseOut={mouseOut}
        style={{ backgroundColor: "yellow" }}
      >
        Hello Nested 2
      </div>
    </div>
  );
};
