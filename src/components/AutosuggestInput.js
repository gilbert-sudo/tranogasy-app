// AutosuggestInput.js
import React, { Component } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

class AutosuggestInput extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: [],
    };
  }

  onChange = (event) => {
    const { data } = this.props;
    const inputValue = event.target.value.toLowerCase();
    const keywords = inputValue
      .split(" ")
      .filter((keyword) => keyword.trim() !== "");

    const suggestions = data.filter((item) => {
      const itemText = `${item.fokontany} ${item.commune} ${item.district} ${item.region}`.toLowerCase();
      return keywords.every((keyword) => itemText.includes(keyword));
    });

    this.setState({
      value: event.target.value,
      suggestions,
    });
  };

  handleSuggestionClick = (suggestion, itemId) => {
    this.setState({
      value: suggestion,
      suggestions: [],
    });

    if (this.props.onSelectItem) {
      this.props.onSelectItem(itemId);
    }
  };

  renderSuggestions = () => {
    const { suggestions, value } = this.state;

    if (!value || suggestions.length === 0 || suggestions.length > 150) {
      return null;
    }

    return (
      <div
        style={{
          zIndex: 20,
          overflowY: "auto",
          maxHeight: "250px",
          position: "absolute",
          width: "100%",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {suggestions.map((item) => (
          <button
            key={item._id}
            type="button"
            style={{
              border: "none",
              backgroundColor: "#fff",
              textAlign: "left",
              color: "black",
              padding: "12px",
              width: "100%",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f6f6f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            onClick={() =>
              this.handleSuggestionClick(
                `${item.fokontany}, ${item.commune.charAt(0).toUpperCase() + item.commune.slice(1)}, ${item.district.toUpperCase()}`,
                item
              )
            }
          >
            <strong><FaLocationDot/> {`${item.fokontany}, ${item.commune.charAt(0).toUpperCase() + item.commune.slice(1)}`}</strong>
            <br />
            <small>{`${item.district.toUpperCase()} (${item.region})`}</small>
          </button>
        ))}
      </div>
    );
  };

  render() {
    const { suggestions, value } = this.state;

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ position: "relative" }}>
          <FaSearchLocation
            style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#6b7280",
              fontSize: "18px",
            }}
          />
          <input
            type="search"
            placeholder="Où que ce soit à Madagascar"
            value={value}
            onChange={this.onChange}
            required
            style={{
              width: "100%",
              padding: "15px 15px 15px 40px",
              border: "1px solid #ced4da",
              borderRadius: "20px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
              backgroundColor: "#f9f9f9",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
          />
        </div>

        {/* Message si pas de résultat */}
        {suggestions && suggestions.length === 0 && value !== "" && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              backgroundColor: "#fff3f3",
              color: "#ff3333",
              border: "1px solid #ff3333",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "5px",
              textAlign: "center",
              fontSize: "13px",
              zIndex: 10,
            }}
          >
            Aucun fokontany trouvé. Essayez d’être plus précis.
          </div>
        )}

        {/* Message si trop de résultats */}
        {suggestions && suggestions.length > 150 && value !== "" && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              backgroundColor: "#e6f7f7",
              color: "#05595B",
              border: "1px solid #05595B",
              borderRadius: "8px",
              padding: "20px",
              marginTop: "5px",
              textAlign: "start",
              fontSize: "13px",
              zIndex: 10,
            }}
          >
            Pouvez-vous préciser davantage votre recherche en incluant <strong>la commune</strong> ou <strong>le district</strong> ou <strong>la région du fokotany</strong> ?
            <br />
            * Cela nous aidera à affiner les <b>{suggestions.length} résultats.</b> 

          </div>
        )}

        {this.renderSuggestions()}
      </div>
    );
  }
}

export default AutosuggestInput;
