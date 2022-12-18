# @jwcjs/core 

🎨 Jwc.js is a JavaScript framework for using JSX to write web components on the web.

<pre align="center">
🧪 Working in Progress
</pre>

## TODO

After the following tasks are completed, we will publish `Release v0.1.0.alpha.0`

- [x] Data Reactively
- [ ] `<Fragment />` Support
- [ ] Vite Fully Support
- [x] Inject style
- [ ] JSX TypeScript Support
- [ ] Function Component Support

## Usage

```bash
npm i @jwcjs/core
```

### Class Component (Feature Preview)

```tsx
import { JwcComponent, Component } from "@jwcjs/core";
import { h } from "@jwcjs/runtime";
import style from './App.css'

@Component({
  name: "app-element",
  css: style
})
export class App extends JwcComponent {

  @Props()
  hello: string

  public override render() {
    return (
      <div>
        <h1>Hello World</h1>
        <span>{this.hello}</span>
      </div>
    )
  }
}
```

### Function Component (Feature Preview)

```tsx
import { registerFunctionComponent } from "@jwcjs/core";
import style from './App.css'

export function App() {
  useStyle(style)
  
  const [hello, setHello] = useState<string>("Hi")
  
  return (<></>)
}

registerFunctionComponent("app-element", <App />);
```

## License

[MIT](https://opensource.org/licenses/MIT)
