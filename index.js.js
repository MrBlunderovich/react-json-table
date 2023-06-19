import React from "react";

const defaultSettings = {
  header: true,
  noRowsMessage: "No items",
  classPrefix: "json",
};

const getSetting = function (name) {
  const settings = this.props.settings;

  if (!settings || typeof settings[name] === "undefined") {
    return defaultSettings[name];
  }

  return settings[name];
};

class JsonTable extends React.Component {
  constructor(props) {
    super(props);
    this.getSetting = getSetting.bind(this);
    this.render = this.render.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.getItemField = this.getItemField.bind(this);
    this.normalizeColumns = this.normalizeColumns.bind(this);
    this.getKey = this.getKey.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
    this.onClickHeader = this.onClickHeader.bind(this);
    this.onClickCell = this.onClickCell.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
  }

  getSetting(name) {
    return defaultSettings[name];
  }

  render() {
    const cols = this.normalizeColumns();
    const contents = [this.renderRows(cols)];

    if (this.getSetting("header")) {
      contents.unshift(this.renderHeader(cols));
    }

    const tableClass =
      this.props.className || this.getSetting("classPrefix") + "Table";

    return React.createElement("table", { className: tableClass }, contents);
  }

  renderHeader(cols) {
    const me = this;
    const prefix = this.getSetting("classPrefix");
    const headerClass = this.getSetting("headerClass");
    const cells = cols.map((col) => {
      let className = prefix + "Column";
      if (headerClass) {
        className = headerClass(className, col.key);
      }

      return React.createElement(
        "th",
        {
          className: className,
          key: col.key,
          onClick: me.onClickHeader,
          "data-key": col.key,
        },
        col.label
      );
    });

    return React.createElement(
      "thead",
      { key: "th" },
      React.createElement("tr", { className: prefix + "Header" }, cells)
    );
  }

  renderRows(cols) {
    const me = this;
    const items = this.props.rows;
    const settings = this.props.settings || {};
    let i = 1;

    if (!items || !items.length) {
      return React.createElement("tbody", { key: "body" }, [
        React.createElement(
          "tr",
          { key: "row" },
          React.createElement(
            "td",
            { key: "column" },
            this.getSetting("noRowsMessage")
          )
        ),
      ]);
    }

    const rows = items.map((item) => {
      const key = me.getKey(item, i);
      return React.createElement(Row, {
        key: key,
        reactKey: key,
        item: item,
        settings: settings,
        columns: cols,
        i: i++,
        onClickRow: me.onClickRow,
        onClickCell: me.onClickCell,
      });
    });

    return React.createElement("tbody", { key: "body" }, rows);
  }

  getItemField(item, field) {
    return item[field];
  }

  normalizeColumns() {
    const getItemField = this.props.cellRenderer || this.getItemField;
    const cols = this.props.columns;
    const items = this.props.rows;

    if (!cols) {
      if (!items || !items.length) {
        return [];
      }

      return Object.keys(items[0]).map((key) => ({
        key: key,
        label: key,
        cell: getItemField,
      }));
    }

    return cols.map((col) => {
      let key;
      if (typeof col === "string") {
        return {
          key: col,
          label: col,
          cell: getItemField,
        };
      }

      if (typeof col === "object") {
        key = col.key || col.label;

        return {
          key: key,
          label: col.label || key,
          cell: col.cell || getItemField,
        };
      }

      return {
        key: "unknown",
        name: "unknown",
        cell: "Unknown",
      };
    });
  }

  getKey(item, i) {
    const field = this.props.settings && this.props.settings.keyField;
    if (field && item[field]) {
      return item[field];
    }

    if (item.id) {
      return item.id;
    }

    if (item._id) {
      return item._id;
    }

    return i;
  }

  shouldComponentUpdate() {
    return true;
  }

  onClickRow(e, item) {
    if (this.props.onClickRow) {
      this.props.onClickRow(e, item);
    }
  }

  onClickHeader(e) {
    if (this.props.onClickHeader) {
      this.props.onClickHeader(e, e.target.dataset.key);
    }
  }

  onClickCell(e, key, item) {
    if (this.props.onClickCell) {
      this.props.onClickCell(e, key, item);
    }
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.getSetting = getSetting.bind(this);
    this.render = this.render.bind(this);
    this.onClickCell = this.onClickCell.bind(this);
    this.onClickRow = this.onClickRow.bind(this);
  }

  getSetting(name) {
    return defaultSettings[name];
  }

  render() {
    const me = this;
    const props = this.props;
    const cellClass = this.getSetting("cellClass");
    const rowClass = this.getSetting("rowClass");
    const prefix = this.getSetting("classPrefix");
    const cells = props.columns.map((col) => {
      let content = col.cell;
      const key = col.key;
      let className = prefix + "Cell " + prefix + "Cell_" + key;

      if (cellClass) {
        className = cellClass(className, key, props.item);
      }

      if (typeof content === "function") {
        content = content(props.item, key);
      }

      return React.createElement(
        "td",
        {
          className: className,
          key: key,
          "data-key": key,
          onClick: me.onClickCell,
        },
        content
      );
    });

    let className = prefix + "Row " + prefix + (props.i % 2 ? "Odd" : "Even");

    if (props.reactKey) {
      className += " " + prefix + "Row_" + props.reactKey;
    }

    if (rowClass) {
      className = rowClass(className, props.item);
    }

    return React.createElement(
      "tr",
      {
        className: className,
        onClick: me.onClickRow,
        key: this.props.reactKey,
      },
      cells
    );
  }

  onClickCell(e) {
    this.props.onClickCell(e, e.target.dataset.key, this.props.item);
  }

  onClickRow(e) {
    this.props.onClickRow(e, this.props.item);
  }
}

export default JsonTable;
