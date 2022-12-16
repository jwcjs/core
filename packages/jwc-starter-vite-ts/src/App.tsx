import { JwcComponent, Component } from "@jwcjs/core";
import { h } from "@jwcjs/runtime";
import style from './App.css?inline'

@Component({
  name: "app-element",
  css: style
})
export class App extends JwcComponent {
  constructor() {
    super();
  }

  public override render() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    )
  }
}