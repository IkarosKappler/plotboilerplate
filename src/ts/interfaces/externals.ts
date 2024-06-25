/**
 * @author  Ikaros Kappler
 * @date    2021-07-00
 * @version 1.0.0
 */

// https://www.npmjs.com/package/@types/dat.gui
// @DEPRECATED Dat.GUI is replaced by lil-gui.
export interface DatGuiProps {
  name?: string;
  load?: object;
  parent?: dat.GUI;
  autoPlace?: boolean;
  hideable?: boolean;
  closed?: boolean;
  closeOnTop?: boolean;
}

// Compatible with dat.gui and lil-gui.
export interface GUI {
  domElement: HTMLElement;
}

export interface LilGuiProps {
  name?: string;
  load?: object;
  parent?: dat.GUI;
  autoPlace?: boolean;
  hideable?: boolean;
  closed?: boolean;
  closeOnTop?: boolean;
}
