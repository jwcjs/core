import { VNode } from "@jwcjs/runtime";

export interface CustomElementProps {
  /**
   * The component's name.
   */
  name: string;

  /**
   * The component's styles.
   */
  css?: any;

  /**
   * Options for the component.
   */
  options?: ElementDefinitionOptions; // https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define

  isMounted?: boolean;
}

export interface PropOptions {
  /**
   * default value for the prop
   * @default undefined
   */
  default?: any;

  /**
   * whether the prop is required
   * @default false
   */
  required?: boolean;

  /**
   * The prop's attribute name.
   */
  attr?: string;
}

export interface JwcElement {
  /**
   * Whether ths component is connected to the DOM.
   */
  isConnected: boolean;

  /**
   * Whether the component should be updated.
   */
  shouldUpdate: boolean;

  /**
   * The component's custom styles.
   */
  customStyles?: string;

  /**
    * The component host element.
    */
  host: HTMLElement;

  /**
   * The component's reactivity data.
   */
  $data?: any;

  /**
   * The component's options.
   * @see CustomElementProps
   */
  $options?: CustomElementProps;

  /**
   * The component's injected dependencies.
   */
  $deps?: any;

  /**
   * The last time vdom was rendered.
   */
  $lastRender?: VNode;

  /**
   * The component's attributes changed callback.
   */
  attributeChangedCallback?: (name: string, oldValue: string, newValue: string) => void;

  /**
   * The component's connected callback.
   */
  connectedCallback?: () => void;

  /**
   * The component's connected function.
   */
  connected?: (shadowRoot: ShadowRoot) => void;

  /**
   * The component's disconnected callback.
   */
  disconnectedCallback?: () => void;

  /**
   * The component's disconnected function.
   */
  disconnected?: () => void;

  /**
   * The component's adopted callback.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
   */
  adoptedCallback?: (oldDocument: Document, newDocument: Document) => void;

  /**
   * The component's update function.
   */
  update?: () => void;

  /**
   * The component's render function.
   */
  render?(...args: any[]): any;
}

/**
 * The JwcElement constructor.
 */
export interface JwcElementConstructor {
  new (): JwcElement;
}