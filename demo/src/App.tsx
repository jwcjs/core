import { JwcComponent, Component, Prop, h, Fragment } from "jwcjs";
import styles from "./App.css?inline";

@Component({
	name: "app-element",
	css: styles,
})
export class App extends JwcComponent {
	constructor() {
		super();
	}

	@Prop({ default: 0, attr: "count" })
	public count = 0;

	public onClick = () => {
		this.count++;
	};

	// get media
	public getSystemColorScheme() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	public override connectedCallback() {
		super.connectedCallback();
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				this.updateDiff();
				console.log("change");
			});
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", () => {
				this.updateDiff();
			});
	}

	public override render() {
		return (
			<>
				<div>
					<a href="https://vitejs.dev" target="_blank">
						<img src="/vite.svg" class="logo" alt="Vite logo" />
					</a>
					<a href="https://github.com/jwcjs/core" target="_blank">
						<img
							src={
								this.getSystemColorScheme() === "dark"
									? "/jwc-dark.svg"
									: "/jwc.svg"
							}
							class="logo jwc"
							alt="Jwc logo"
						/>
					</a>
				</div>
				<div class={"card"}>
					<button onClick={this.onClick}>
						count is {String(this.count)}
					</button>
				</div>
				{Array.from({ length: this.count }).map((_, i) => (
					<p class="read-the-docs">
						点击按钮，此处应随着按钮的点击次数而变化 {String(i + 1)}
					</p>
				))}
			</>
		);
	}
}
