// AutosuggestInput.js
import React, { Component } from "react";

class AutosuggestInput extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: [],
    };
  }

  // Define the input change handler
  onChange = (event) => {
    const { data } = this.props;
    const inputValue = event.target.value.toLowerCase();
    const keywords = inputValue
      .split(" ")
      .filter((keyword) => keyword.trim() !== "");

    const suggestions = data.filter((item) => {
      const itemText =
        `${item.fokontany} ${item.commune} ${item.district} ${item.region}`.toLowerCase();
      return keywords.every((keyword) => itemText.includes(keyword));
    });

    this.setState({
      value: event.target.value,
      suggestions,
    });
  };

  // Define the function to render suggestions
  renderSuggestions = () => {
    const { suggestions, value } = this.state;

    if (value === "") {
      return null;
    }

    if (suggestions.length === 0 || suggestions.length > 150) {
      return null;
    }

    return (
      <div
        style={{
          zIndex: "20",
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "50vh",
          position: "absolute",
          width: "100%",
          backgroundColor: "white",
        }}
        className="list-group position-absolute w-100"
      >
        {suggestions.map((item) => (
          <button
            key={item._id}
            type="button"
            style={{ border: "3px solid #B4B4B3", backgroundColor: "#F1EFEF" }}
            className="btn btn-dark mb-1 pl-2 list-group-item list-group-item-action"
            onClick={() =>
              this.handleSuggestionClick(
                item.fokontany +
                " " +
                item.commune.charAt(0).toUpperCase() +
                item.commune.slice(1) +
                ", " +
                item.district.toUpperCase(),
                item // Pass the item's _id as the second argument
              )
            }
          >
            <b>{`${item.fokontany}, ${item.commune.charAt(0).toUpperCase() + item.commune.slice(1)
              }`}</b>{" "}
            <br />
            <small>{`${item.district.toUpperCase()}`}</small>{" "}
            {`(${item.region})`}
          </button>
        ))}
      </div>
    );
  };

  handleSuggestionClick = (suggestion, itemId) => {
    this.setState({
      value: suggestion,
      suggestions: [],
    });

    // Call the callback function with the selected item's _id
    if (this.props.onSelectItem) {
      this.props.onSelectItem(itemId);
    }
  };

  render() {
    const { suggestions, value } = this.state;

    return (
      <>
        <input
          type="search"
          name="quarter"
          id="fokontany"
          placeholder="où que ce soit à Madagascar"
          className="form-control"
          value={value}
          onChange={this.onChange}
          onFocus={this.props.onFocus && this.props.onFocus}
          required
        />
        {suggestions && suggestions.length === 0 && value !== "" &&
          <div
            style={{
              zIndex: "20",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "50vh",
              position: "absolute",
              width: "100%",
              backgroundColor: "white",
            }}
            className="list-group position-absolute w-100"
          >
            <button
              type="button"
              style={{ border: "3px solid #ff3333", backgroundColor: "#FEF2F4", color: "#ff3333" }}
              className="btn btn-outline-danger mb-1 pl-2 list-group-item list-group-item-action"
            >
              <small><b>La saisie ne correspond à aucun fokotany.</b></small>
              <br />
              <small>Veuillez vérifier votre recherche et réessayer.</small>
            </button>
          </div>
        }

        {suggestions && suggestions.length !== 0 && suggestions.length > 150 && value !== "" &&
          <div
            style={{
              zIndex: "20",
              overflowY: "auto",
              maxHeight: "50vh",
              position: "absolute",
              width: "100%",
              backgroundColor: "white",
            }}
            className="list-group position-absolute w-100"
          >
            <button
              type="button"
              style={{ border: "2px solid #05595B", backgroundColor: "#EAF6F6", color: "black" }}
              className="mb-1 px-2 list-group-item list-group-item-action"
            >
              <small><strong> Pouvez-vous préciser davantage votre recherche en incluant la commune ou le district ou la région du fokotany ?</strong></small>
              <br />
              <small>* Cela nous aidera à affiner les <b>{suggestions.length}</b> résultats.</small>
            </button>
          </div>
        }

        {this.renderSuggestions()}
      </>
    );
  }
}

export default AutosuggestInput;
