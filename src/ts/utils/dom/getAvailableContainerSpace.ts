import { XYDimension } from "../../interfaces/core";
import { getFProp } from "./getFProp";


export const getAvailableContainerSpace = (element:HTMLElement | SVGElement): XYDimension => {
    // const _self: PlotBoilerplate = this;
    const container: HTMLElement = element.parentNode as unknown as HTMLElement; // Element | Document | DocumentFragment;
    // var canvas : HTMLCanvasElement = _self.canvas;
    // _self.canvas.style.display = "none";
    /* var
	padding : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding') ) || 0,
	border : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-width') ) || 0,
	pl : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-left') ) || padding,
	pr : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-right') ) || padding,
	pt : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-top') ) || padding,
	pb : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-bottom') ) || padding,
	bl : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-left-width') ) || border,
	br : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-right-width') ) || border,
	bt : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-top-width') ) || border,
	bb : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-bottom-width') ) || border;
	*/
    var padding: number = getFProp(container, "padding") || 0,
      border: number = getFProp(element, "border-width") || 0,
      pl: number = getFProp(container, "padding-left") || padding,
      pr: number = getFProp(container, "padding-right") || padding,
      pt: number = getFProp(container, "padding-top") || padding,
      pb: number = getFProp(container, "padding-bottom") || padding,
      bl: number = getFProp(element, "border-left-width") || border,
      br: number = getFProp(element, "border-right-width") || border,
      bt: number = getFProp(element, "border-top-width") || border,
      bb: number = getFProp(element, "border-bottom-width") || border;
    var w: number = container.clientWidth;
    var h: number = container.clientHeight;
    // _self.canvas.style.display = "block";
    return { width: w - pl - pr - bl - br, height: h - pt - pb - bt - bb };
  }