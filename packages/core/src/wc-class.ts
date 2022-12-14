import { createCSSElement, defineProxy } from "@jwcjs/reactively";
import { createElement, diff, removeAttrs } from "@jwcjs/runtime";
import {
	COMPONENT_PROP_METADATA_KEY,
	JwcElement,
	PropOptions,
	WatcherOptions,
} from "@jwcjs/shared";

/**
 * The map of adoptedStyleSheets.
 * It is used to avoid duplicate styleSheets.
 */
const adoptedStyleSheetsMap = new WeakMap();

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
	public propsList: PropOptions[] = [];
	public previousProps = {};
	public previousVNode = null;

	public host: HTMLElement;

	public override shadowRoot: ShadowRoot;

	private watchersMap = new Map<string, WatcherOptions[]>();

	public getMetaList<K, V>(key: string): Map<K, V> {
		return Reflect.getMetadata(key, this) || new Map();
	}

	private initWatcher() {
		const watchers =
			this.getMetaList(COMPONENT_PROP_METADATA_KEY) ||
			([] as WatcherOptions[]);
		watchers.forEach((watcher: WatcherOptions) => {
			const { callbackName } = watcher;
			const currentItem = this.watchersMap.get(callbackName);
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
		});
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
		if (adoptedStyleSheetsMap.has(this.constructor)) {
			/**
			 * if the adoptedStyleSheetsMap has the constructor,
			 * it means that the styleSheets has been created.
			 */
			shadowRoot.adoptedStyleSheets = adoptedStyleSheetsMap.get(
				this.constructor
			);
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
		let shadowRoot: ShadowRoot =
			this.shadowRoot || this.attachShadow({ mode: "open" });
		shadowRoot = this.initCSS(this.shadowRoot);
		if (this.$options.css) {
			shadowRoot.appendChild(createCSSElement(this.$options.css));
		}
		if (this.inlineStyles) {
			this.customStyles = createCSSElement(this.inlineStyles);
			shadowRoot.appendChild(this.customStyles);
		}
		return shadowRoot;
	}

	private attrsToProps() {
		const host =
			this.shadowRoot && this.shadowRoot.host
				? this.shadowRoot.host
				: this;
		const attrs: Record<string, any> = {};
		for (let i = 0; i < host.attributes.length; i++) {
			const attr = host.attributes[i];
			attrs[attr.name] = attr.value;
		}
		this.propsList.forEach((prop: PropOptions) => {
			const { attr: name, default: defaultValue } = prop;
			if (attrs[name]) {
				this.previousProps[name] = attrs[name];
				this[name] = attrs[name];
			} else {
				this.previousProps[name] = defaultValue;
				this[name] = defaultValue;
			}
		});
	}

	private init() {
		this.props = this.getMetaList(COMPONENT_PROP_METADATA_KEY) || [];
		this.propsList = Object.values(this.props);
		const that = this;
		// define the default value of the props.
		this.propsList.forEach((prop: PropOptions) => {
			const { attr: name, default: defaultValue } = prop;
			this.previousProps[name] = defaultValue;
			// getAttribute
			this[name] = defaultValue;
			defineProxy(that, name, prop);
		});
		this.initWatcher();
	}

	get inlineStyles() {
		return super.getAttribute("style");
	}

	public updateDiff() {
		const previous = this.$lastRender;
		const current = this.render(this.$data);
		if (previous) {
			this.$lastRender = null;
			this.$lastRender = diff(
				removeAttrs(previous),
				removeAttrs(current),
				this.shadowRoot
			);
		}
	}

	public customEvent(name: string, detail: any) {
		const event = new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true,
		});

		this.dispatchEvent(event);
	}

	public connectedCallback() {
		const shadowRoot = this.initShadowRoot();
		this.attrsToProps();
		/**
		 * beforeCreate ->
		 * created ->
		 * afterCreate ->
		 * beforeMount ->
		 * mounted
		 */
		const propsList = this.props as PropOptions[];
		const that = this;
		propsList.forEach((prop: PropOptions) => {
			const attr = shadowRoot.host.getAttribute(prop.attr);
			if (attr) {
				that[prop.attr] = attr;
			}
		});
		const rendered = this.render(this.$data);
		this.rootNode = createElement(removeAttrs(rendered) as any);
		if (this.$options.isMounted) {
			this.rootNode && shadowRoot.appendChild(this.rootNode);
		}

		this.$lastRender = removeAttrs(rendered);
	}

	public disconnectedCallback() {}

	public attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string
	) {
		if (oldValue !== newValue) {
			this.props[name] = newValue;
		}
		this.updateDiff();
	}

	public adoptedCallback() {}

	public render(data: {}): any {}
}
