import { reactiveData, reactiveEvent } from "packages/jwc-reactively/src/call-reactive";
import { COMPONENT_PROP_METADATA_KEY, COMPONENT_STATE_METADATA_KEY } from "./constants/metas.constant";
import { JwcElement, PropOptions } from "./types/jwc-element.interface";
import { WatcherOptions } from "./types/watcher.interface";

export class JwcComponent extends HTMLElement implements JwcElement {
  public override tagName: string;
  public rootNode = null;

  public $data = null;
  public $options = null;
  public $deps = null;

  public $lastRender = null;
  public customStyles = null;
  public shouldUpdate = false;
  public props = {};
  public previousProps = {};
  public state = {};
  public previousState = {};
  public previousVNode = null;

  public host: HTMLElement;
  public css: CSSStyleSheet;

  public override shadowRoot: ShadowRoot;

  private watchersMap = new Map<string, WatcherOptions[]>();

  public getMetaList<K, V>(key: string): Map<K, V> {
    return Reflect.getMetadata(key, this) || new Map();
  }

  private init() {
    this.props = this.getMetaList(COMPONENT_PROP_METADATA_KEY) || [];
    this.state = this.getMetaList(COMPONENT_STATE_METADATA_KEY) || [];
    const propsList: PropOptions[] = Object.values(this.props);
    reactiveData.call(this, propsList.concat(Object.values(this.state)));
    reactiveEvent.call(this);
  }

  constructor() {
    super();
    this.host = this;
    this.$options = (this.constructor as any).$options;
    this.init();
  }

  get inlineStyles() {
    return super.getAttribute('style');
  }

  public customEvent(name: string, detail: any) {
    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }
}