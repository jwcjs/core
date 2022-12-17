import { JwcComponent, Component, Prop, Event } from "@jwcjs/core";
import { h } from "@jwcjs/runtime";
// import style from './App.css'

@Component({
  name: "app-element",
  // css: style
})
export class App extends JwcComponent {
  constructor() {
    super();
  }

  @Prop({ default: "Hi" })
  public msg: string = "Hi";

  @Event("click")
  public onClick() {
    console.log("clicked");
    this.msg = "Hello";
    console.log(this.msg);
  }

  public override render() {
    return (
      <div>
        <h1
          onClick={this.onClick}
        >Hello World</h1>
        <p>{this.msg}</p>
      </div>
    )
  }
}