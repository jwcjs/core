import { JwcComponent, Component, Prop, Event } from "@jwcjs/core";
import { h } from "@jwcjs/runtime";
// @ts-ignore In Vite4 
import styles from './App.css?inline'

@Component({
  name: "app-element",
  css: styles
})
export class App extends JwcComponent {
  constructor() {
    super();
  }

  @Prop({ default: 0, attr: "count" })
  public count: number = 0;

  public onClick = () =>{
    this.count++;
  }

  // get media
  public getSystemColorScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  public override render() {
    return (
      <div>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
          </a>
          <a href="https://github.com/jwcjs/core" target="_blank">
            <img src={this.getSystemColorScheme() === 'dark' ? "/jwc-dark.svg" : "/jwc.svg"} class="logo jwc" alt="Jwc logo" />
          </a>
        </div>
        <div class={"card"}>
          <button onClick={this.onClick} part="button">
            count is {String(this.count)}
          </button>
        </div>
        <p class="read-the-docs">
          Click on the Vite and Jwc logos to learn more
        </p>
      </div>
    )
  }
}