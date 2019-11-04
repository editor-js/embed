![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Embed Tool

Provides Block tool for embedded content for the [Editor.js](https://editorjs.io).
Tool uses Editor.js pasted patterns handling and inserts iframe with embedded content.

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev @editorjs/embed
```

Include module at your application

```javascript
const Embed = require('@editorjs/embed');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN
You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/embed).

`https://cdn.jsdelivr.net/npm/@editorjs/embed@latest`

Then require this script on page with Editor.js.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: Embed,
  },

  ...
});
```

## Available configuration

Embed Tool supports some services by default (see the full list [here](docs/services.md)). You can specify services you would like to use:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true
        }
      }
    },
  },

  ...
});
```

> Note that if you pass services you want to use like in the example above, others will not be enabled.

Also you can provide your own services using simple configuration.


First of all you should create a Service configuration object. It contains following fields:

| Field      | Type       | Description |
| ---------- | ---------- | ----------- |
| `regex`    | `RegExp`   | Pattern of pasted URLs. You should use regexp groups to extract resource id
| `embedUrl` | `string`   | Url of resource\`s embed page. Use `<%= remote_id %>` to substitute resource identifier
| `html`     | `string`   | HTML code of iframe with embedded content. `embedUrl` will be set as iframe `src`
| `height`   | `number`   | _Optional_. Height of inserted iframe
| `width`    | `number`   | _Optional_. Width of inserted iframe
| `id`       | `Function` | _Optional_. If your id is complex you can provide function to make the id from extraced regexp groups

Example:

```javascript
{
  regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
  embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
  height: 300,
  width: 600,
  id: (groups) => groups.join('/embed/')
}
```

When you create a Service configuration object, you can provide it with Tool\`s configuration:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true,
          codepen: {
            regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
            embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
            html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
            height: 300,
            width: 600,
            id: (groups) => groups.join('/embed/')
          }
        }
      }
    },
  },

  ...
});
```

#### Inline Toolbar
Editor.js provides useful inline toolbar. You can allow it\`s usage in the Embed Tool caption by providing `inlineToolbar: true`.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: Embed,
      inlineToolbar: true
    },
  },

  ...
});
```

## Output data

| Field   | Type     | Description
| ------- | -------- | -----------
| service | `string` | service unique name
| source  | `string` | source URL
| embed   | `string` | URL for source embed page
| width   | `number` | embedded content width
| height  | `number` | embedded content height
| caption | `string` | content caption


```json
{
  "type" : "embed",
  "data" : {
    "service" : "coub",
    "source" : "https://coub.com/view/1czcdf",
    "embed" : "https://coub.com/embed/1czcdf",
    "width" : 580,
    "height" : 320,
    "caption" : "My Life"
  }
}
```

