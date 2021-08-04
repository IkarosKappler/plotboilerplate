/**
 * @author  Ikaros Kappler
 * @date    2021-07-00
 * @version 1.0.0
 */

// https://www.npmjs.com/package/@types/dat.gui
export interface DatGuiProps {
  name?: string;
  load?: object;
  parent?: dat.GUI;
  autoPlace?: boolean;
  hideable?: boolean;
  closed?: boolean;
  closeOnTop?: boolean;
}
