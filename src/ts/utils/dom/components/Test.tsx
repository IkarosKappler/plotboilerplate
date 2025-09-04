/**
 * @author  Ikaros Kappler
 * @date    2025-06-25
 * @version 1.0.0
 */

import * as NoReact from "noreact";
import { JsxElement } from "typescript";

export const Test = (name: string): JsxElement => {
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
