import { JsRendererVariableCollection } from './JsRendererVariableCollection';

export interface JsRendererVariable {
  name: string;
  value: any;
  childs?: JsRendererVariableCollection[];
  visible?: boolean;
}
