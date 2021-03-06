# &lt;kwc-field&gt;

> This component shows a field and helps to manage validation

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install kwc-field --save
```

Or [download as ZIP](https://github.com/successk/kwc-field/archive/master.zip).

## Usage

1 – Import polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

2 – Import custom element:

```html
<link rel="import" href="bower_components/kwc-field/kwc-field.html">
```

3 – Start using it!

```html
<!-- Inside template -->
<!-- delay-async: async verification will be delayed by this number (see documentation of the attribute) -->
<kwc-field id="username" delay-async="1000" value="{{username}}">
  <!-- The component is already wrapped into a label, use .kwc-field-label to include a label text (containing all you want) -->
  <span class="kwc-field-label">Username</span>
  
  <!-- Put any field you want with all basic field verifications as required, pattern, etc. You just need to declare it .kwc-field-field -->
  <input type="text" name="username" required pattern="[a-zA-Z0-9_-]+" maxlength="15" placeholder="Use letters, numbers '_' and '-' only"
  class="kwc-field-field">
</kwc-field>

<kwc-field id="password" value="{{password}}">
  <span class="kwc-field-label">Password</span>
  <input type="password" name="password" required placeholder="Your strong password (at least 8 characters)" class="kwc-field-field">
</kwc-field>

<kwc-field id="password2" value="{{password2}}">
  <span class="kwc-field-label">Confirm</span>
  <input type="password" name="password2" required placeholder="Confirm your password" class="kwc-field-field">
</kwc-field>

<script>
  Polymer({
    is: "my-parent-component",
    
    attached: function() {
      // Add custom verifications
      // Will be called each input change
      this.$.username.verify("The username must have at least 3 characters", function(value){
        return value !== null && value.length >= 3 // return when the value is valid
      })
      
      // Will be called `delay-async` ms after last input change
      this.$.username.verifyAsync("This username is used", function(value){
        // Replace by a server call, need to return a promise
        if (value === "exist" || value === "boss" || value === "a-username-somebody-wont-think-of-it") {
          return Promise.resolve(false)
        } else {
          return Promise.resolve(true)
        }
      })
      
      this.$.password2.verify("This password must match the first one", function(value){
        return value !== null && value === that.$.password.value
      })
    }
  })
</script>
```

See `index-kwc-field-show.html` for a complete example.

## Options

Attribute    | Options   | Default | Description
---          | ---       | ---     | ---
`delayAsync` | *number*  | `500`   | The duration in ms before calling all async verification (by `verifyAsync`)

## Children

Selector           | Description
---                | ---
`.kwc-field-label` | The field label
`.kwc-field-field` | The input, select or textarea component or its container

## Methods

Method         | Parameters                 | Returns     | Description
---            | ---                        | ---         | ---
verify         | `message`: `String`        | this        | This field must verify given verification, otherwise, given message will be displayed.
               | `verification`: `function` |             | The verification function must return true when the value is valid.
verifyAsync    | `message`: `String`        | this        | This field must verify given verification, otherwise, given message will be displayed.
               | `verification`: `function` |             | The verification function must return a promise returning true when the value is valid.
               |                            |             | Unlike `verify`, this method will be called after `delay-async` milliseconds.
               |                            |             | Its use is for async verification, as an XHR call.
onValidated    | `listener`: `function`     | this        | Listens for the next time the field will be validated (sync and async verifications).
               |                            |             | Sends one parameter to listener: the field validation.
               |                            |             | Once the listener was called, it will be removed.
               |                            |             | Forces the check to trigger the validation.
isValidPromise |                            | `Promise`   | Returns a promise which will check if the field is valid. See `#onValidated`


## Events

Event     | Detail   | Description
---       | ---      | ---
None      | -        | -

## Styles

Name | Default | Description
---  | ---     | ---
None | -       | -

This component does not intend to transform fields design, but only add behavior to simplify error management.
Some styles will appear to help the developer to do whatever he want with this component.
Please help us helping you by providing your needs in Github issues.

## Radio elements

If you want to use radio elements, you need to use `kwc-field-radio`.
Below an example of use.
You can see `index-kwc-field-show.html` for a complete example.

```html
<kwc-field value="{{sex}}">
  <span class="kwc-field-label">Sex</span>
  <kwc-field-radio class="kwc-field-field" required>
    <label>
        Male
        <input type="radio" name="sex" value="m"/>
    </label>
    <label>
        Female
        <input type="radio" name="sex" value="f"/>
    </label>
  </kwc-field-radio>
</kwc-field>
```

## Custom field elements

You can create your own custom field elements (as `kwc-field-radio` do).
To do so, you just need to create an element with these properties and functions:

* checkValidity(): Is the component valid?
* validationMessage: What is the validation message?
* See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation#The_HTML5_constraint_validation_API

## Limitations

Because of how Polymer works, it seems impossible to listen on field updates by Polymer binding.
If you want to the field with your data, bind it to the `<kwc-field>` instead of concrete fields (eg. `<input>`).

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

1 – Install [bower](http://bower.io/) & [polyserve](https://npmjs.com/polyserve):

```sh
$ npm install -g bower polyserve
```

2 – Install local dependencies:

```sh
$ bower install
```

3 – Start development server and open `http://localhost:8080/components/kwc-field/`.

```sh
$ polyserve
```

## History

For detailed changelog, check [Releases](https://github.com/successk/kwc-field/releases).

## License

MIT