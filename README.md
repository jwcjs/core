# @jwcjs/core 

🎨 Jwc.js is a JavaScript framework for using JSX to write web components on the web.

<pre align="center">
🧪 Working in Progress
</pre>

## TODO

After the following tasks are completed, we will publish `Release v0.1.0.alpha.0`

- [x] Data Reactively
- [x] Inject style
- [x] JSX TypeScript Support
- [x] `<Fragment />` Support
- [ ] Vite Fully Support
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

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://iucky.cn"><img src="https://avatars.githubusercontent.com/u/62133302?v=4?s=100" width="100px;" alt="Wibus"/><br /><sub><b>Wibus</b></sub></a><br /><a href="https://github.com/jwcjs/core/commits?author=wibus-wee" title="Code">💻</a></td>
      <td align="center"><a href="https://akr.moe"><img src="https://avatars.githubusercontent.com/u/85140972?v=4?s=100" width="100px;" alt="AkaraChen"/><br /><sub><b>AkaraChen</b></sub></a><br /><a href="https://github.com/jwcjs/core/commits?author=AkaraChen" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](https://opensource.org/licenses/MIT)
