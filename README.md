# react-input-mask-hook

React hook for connecting to the input of a strict/non-strict mask.

## Installation

> npm i react-input-mask-hook

## Parameters

Passes an **_object_** with properties as input:

<table>
  <tr>
    <th>Name</th>
    <th>Required</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>inputRef</td>
    <td>+</td>
    <td>RefObject</td>
    <td>Ref connected to the input element.</td>
  </tr>
  <tr>
    <td>mask</td>
    <td>+</td>
    <td>string</td>
    <td>Mask with which the user interacts.</td>
  </tr>
  <tr>
    <td>replace</td>
    <td>+</td>
    <!-- <td>{ key: RegExp; value: RegExp; }</td> -->
    <td>
    Object
      <table>
        <tr>
          <td><nobr>key: RegExp</nobr></td>
        </tr>
        <tr>
          <td><nobr>value: RegExp</nobr></td>
        </tr>
      </table>
    </td>
    <td>Key - regular expression. Which characters in the <b><u><i>mask</i></u></b> the user can edit.<br/>
    Value - regular expression. Those values that you can change the <b><u><i>key</i></u></b> to.</td>
  </tr>
  <tr>
    <td>strict</td>
    <td>-</td>
    <td>boolean</td>
    <td>Determines whether the mask is strict or not.</td>
  </tr>
  <tr>
    <td>pattern</td>
    <td>-</td>
    <td>string</td>
    <td>To check if a mask matches a regular expression <code>input.pattern</code>.</td>
  </tr>
</table>

## Return value

Hook returns an **_object_** with the following properties:

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>value</td>
    <td>string</td>
    <td>Value from input.</td>
  </tr>
  <tr>
    <td>error</td>
    <td>string</td>
    <td>Error text from <code>input.validationMessage</code></td>
  </tr>
  <tr>
    <td>isValid</td>
    <td>boolean</td>
    <td>Indicates whether the <b><u><i>mask</i></u></b> matches the <b><u><i>pattern</i></u></b>.</td>
  </tr>
  <tr>
    <td>onChange</td>
    <td>function</td>
    <td>onChange handler.</td>
  </tr>
</table>

## Example

1. Input type must be equal to **_text_**.
2. The **_strict: true_** is transmitted if the number of characters in the mask is unchanged. For example, phone, ip address or your custom mask.
3. The **_pattern_** is passed if you want to use **_isValid_** and **_error_**.

### Strict mask

```
  const inputRef = useRef<HTMLInputElement>(null);
  const { value, onChange } = useMask({
    inputRef: inputRef,
    mask: "+7 (123) 123-12-13",
    replace: {
      key: /\d/,
      value: /\d/,
    },
    strict: true,
  });

  return (
    <label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
    </label>
  );
```

---

In this example, it makes sense to add a pattern for validation, since some characters may be equal to "\_".

```
  const inputRef = useRef<HTMLInputElement>(null);
  const { value, onChange, error, isValid } = useMask({
    inputRef: inputRef,
    mask: "+7 (___) ___-__-__",
    replace: {
      key: /_/,
      value: /\d/,
    },
    strict: true,
    pattern: '\\+\\d\\s\\([\\d]{3}\\)\\s[\\d]{3}-\\d\\d-\\d\\d',
  });

  return (
    <label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      <span>{error}</span>
    </label>
  );
```

### Non-strict mask

```
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { value, onChange, error, isValid } = useMask({
    inputRef: inputRef,
    mask: 'pochta@gmail.com',
    replace: {
      key: /[a-z]/i,
      value: /[a-z]/i,
    },
    pattern: '[a-z]+@[a-z]+\\.(ru|com)'
  });

  return (
    <label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      <span>{error}</span>
    </label>
  );
```

---

```
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { value, onChange, error, isValid } = useMask({
    inputRef: inputRef,
    mask: 'http://*.com',
    replace: {
      key: /\*/,
      value: /[a-z]/,
    },
    pattern: 'http:\\/\\/[a-z]+\\.com'
  });

  return (
    <label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      <span>{error}</span>
    </label>
  );
```
