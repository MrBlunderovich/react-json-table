# This is a modified 'react-json-table' package

This package has been created as part of an exercise. Do not use it for important stuff.

A simple but flexible table react component to display JSON data.

As simple as feeding it with an array of objects.

```js
var items = [
  { name: "Louise", age: 27, color: "red" },
  { name: "Margaret", age: 15, color: "blue" },
  { name: "Lisa", age: 34, color: "yellow" },
];

React.render(<JsonTable rows={items} />, document.body);
```

## Installation

Using node package manager:

```
npm install react-json-table --save //FIXIT
```

## Usage

You can see the simplest example of use at the top of this page, but probably you would like to customize a bit the behaviour of the table to adapt it to your needs. Have a look at the accepted component props.

### props

| Prop name     | Values                | Description                                                                                                                                                                                                                                                           |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rows          | Array[Object]         | The data you want to display in the table.                                                                                                                                                                                                                            |
| columns       | Array[String\|Object] | The columns and their order for the table. If it is a `string` the value attribute of the current row that matches it will be shown as cell content. But also it is possible to use an `object` to customize the column, see [column definition](#column-definition). |
| className     | _string_              | Class to use for the `<table>` element.                                                                                                                                                                                                                               |
| settings      | Object                | Further customization of the table, see [table settings](#table-settings).                                                                                                                                                                                            |
| onClickCell   | Function              | Callback triggered when a cell is clicked: `fn( event, columnName, rowData )`.                                                                                                                                                                                        |
| onClickRow    | Function              | Callback triggered when a row is clicked: `fn( event, rowData )`                                                                                                                                                                                                      |
| onClickHeader | Function              | Callback triggered when a column header is clicked: `fn( event, columnName )`                                                                                                                                                                                         |

### Column definition

Using column definitions you can change the behaviour of the column easily. To do so you need to pass an array of the column definitions as the `columns` prop to the JsonTable:

```js
var items = [
  { name: "Louise", age: 27, color: "red" },
  { name: "Margaret", age: 15, color: "blue" },
  { name: "Lisa", age: 34, color: "yellow" },
];

var columns = [
  "name",
  { key: "age", label: "Age" },
  {
    key: "color",
    label: "Colourful",
    cell: function (item, columnKey) {
      return <span style={{ color: item.color }}>{item.color}</span>;
    },
  },
];

React.render(<JsonTable rows={items} columns={columns} />, document.body);
```

As you can see in the example, a column definition can be just a string with the name of the field to display or an object. But if an object is passed the customization can be much more. A column definition can be an object with the following properties:

- `key`: It is the internal name use for the column by JsonTable. It is added to the className of the cells and headers to apply styles to the column. It is also passed as an argument for the click callbacks. If the column definition has no `cell` property, it also represent the property of the current row to be shown as cell content.
- `label`: It is the content of the column header. You can use a `string` or a `ReactComponent` to show inside the header cell.
- `cell`: What is going to be displayed inside the column cells. It can be a `string` or `ReactComponent` to show static contents, but tipically it is a `function( rowData, columnKey )` that return the contents for the cell. This way different contents are shown in the column for different rows.

### Table settings

Using the prop `settings` we can customize some details that are not related to columns. It is an object with the following properties:

| Setting name    | Values                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cellClass`     | _function_                 | It is possible to add custom classes to the cells if you pass a function `fn( currentClass, columnKey, rowData )` in this setting.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `classPrefix`   | _string_                   | JsonTable uses `class` attributes for its markup like `jsonRow` or `jsonCell`. The default prefix is `json` but you can use this setting to change it in the case it is conflicting with other classes in your app.                                                                                                                                                                                                                                                                                                                                              |
| `header`        | _boolean_                  | If `false`, no header will be shown for the table. Default `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `headerClass`   | _function_                 | It is possible to add custom classes to the column headers if you pass a function `fn( currentClass, columnKey )` in this setting.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `keyField`      | _string_                   | React components that have a list of children need to give to every children a different `key` prop in order to make the diff algorithm check if something has change. You can define here what field of your rows will be used as a row key. JsonTable uses the `id` or `_id` property of your rows automatically if you don't give this setting, but **you must be sure that there is a keyField for your rows** if you don't want strange behaviours on update. [More info](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children). |
| `noRowsMessage` | _string_, _ReactComponent_ | Message shown when the table has no rows. Default _"No items"_.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `rowClass`      | _function_                 | It is possible to add custom classes to the rows if you pass a function `fn( currentClass, rowData )` in this setting.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `cellRenderer`  | _function(item,field)_     | If provided, this function will be used to render all the cells' content, so it is a way of programatically customize every cell. If no provided, the cell contents will just be `item[field]`, the value of the item for that field.                                                                                                                                                                                                                                                                                                                            |

## [MIT Licensed](LICENSE)
