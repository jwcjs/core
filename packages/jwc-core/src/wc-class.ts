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

  private initWatcher() {
    const watchers = this.getMetaList(COMPONENT_STATE_METADATA_KEY) || [] as WatcherOptions[];
    watchers.forEach((watcher: WatcherOptions) => {
      const { callbackName } = watcher;
      const currentItem = this.watchersMap.get(callbackName)
       /**
         * if the callbackName is already exist,
         * add the watcher to the array.
         * 
         * if not, create a new array and add the watcher to it.
         */
      if (currentItem) {
        this.watchersMap.set(callbackName, [...currentItem, watcher]);
      } else {
        this.watchersMap.set(callbackName, [watcher]);
      }
    })
  }

  constructor() {
    super();
    this.host = this;
    this.$options = (this.constructor as any).$options;
    this.init();
  }

  /**
   * init the styleSheets. 
   * Put the styleSheets into the shadowRoot.
   */
  private initCSS(shadowRoot: ShadowRoot) {
    if(adoptedStyleSheetsMap.has(this.constructor)) {
      /**
       * if the adoptedStyleSheetsMap has the constructor,
       * it means that the styleSheets has been created.
       */
      shadowRoot.adoptedStyleSheets = adoptedStyleSheetsMap.get(this.constructor);
    } else {
      /**
       * if the adoptedStyleSheetsMap doesn't have the constructor,
       * it means that the styleSheets hasn't been created.
       */
      const styleSheets = this.$options.css;
      if (styleSheets) {
        const css = new CSSStyleSheet();
        css.replaceSync(styleSheets);
        shadowRoot.adoptedStyleSheets = [css];
        adoptedStyleSheetsMap.set(this.constructor, [css]);
      }
    }
    return shadowRoot;
  }

  private initShadowRoot() {
    let shadowRoot: ShadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot = this.initCSS(this.shadowRoot);
    if(this.css) {
      shadowRoot.appendChild(createCSSElement(
        typeof this.css === 'function' ? this.css() : this.css
      ))
    }
    if (this.inlineStyles) {
      this.customStyles = createCSSElement(this.inlineStyles);
      shadowRoot.appendChild(this.customStyles);
    }
    return shadowRoot;
  }

  private init() {
    this.props = this.getMetaList(COMPONENT_PROP_METADATA_KEY) || [];
    this.state = this.getMetaList(COMPONENT_STATE_METADATA_KEY) || [];
    const propsList: PropOptions[] = Object.values(this.props);
    reactiveData.call(this, propsList.concat(Object.values(this.state)));
    reactiveEvent.call(this);
    this.initWatcher();
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