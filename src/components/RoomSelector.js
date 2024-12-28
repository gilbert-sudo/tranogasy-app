import React from "react";
import "./css/roomselector.css";

const RoomSelector = ({ selectedRoom, setSelectedRoom, customRoom, setCustomRoom }) => {

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    setCustomRoom(""); // Clear the custom input when a predefined option is selected
  };

  const handleCustomRoomChange = (event) => {
    const value = event.target.value;
    
    // Check if the custom input is empty or 0 and reset to "1+"
    if ((!value || value === "" || (Number(value) <= 0))) {
      setSelectedRoom("1+");
    }else{
      setSelectedRoom(""); // Deselect predefined options
    }

    // Allow only numbers and ensure the value is between 0 and 100
    if (/^\d*$/.test(value) && (value === "" || (Number(value) >= 0 && Number(value) <= 100))) {
      setCustomRoom(value); // Update the state with the valid input
    }
  };

  const handleCustomInputBlur = () => {
    // Check if the custom input is empty or 0 and reset to "1+"
    if (!customRoom || customRoom === "0") {
      setSelectedRoom("1+");
      setCustomRoom(""); // Clear custom input
    }
  };

  return (
    <div className="room-selector d-flex justify-content-start align-items-center px-2 w-100">
      <div id="rooms" className="btn-group rooms-input-group pt-2" role="group">
        {["1+", "2+", "3+", "4+", "5+"].map((value, index) => (
          <React.Fragment key={index}>
            <input
              type="radio"
              className="btn-check"
              name="rooms"
              id={`room${index + 1}`}
              value={value}
              onChange={handleRoomChange}
              checked={selectedRoom === value}
            />
            <label
              className={`btn ${selectedRoom === value
                  ? "btn-primary active"
                  : "btn-outline-dark"
                }`}
              htmlFor={`room${index + 1}`}
            >
              <small>{value}</small>
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* "Ou" Label */}
      <label className="or-label mx-2 mt-2">Ou</label>

      {/* Custom Number Input */}
      <input
        type="number"
        id="custom-room"
        className="form-control custom-room-input"
        placeholder="Nombre spécifique"
        value={customRoom}
        onChange={handleCustomRoomChange}
        onBlur={handleCustomInputBlur} // Trigger when input loses focus
        min="0"
        max="100"
        pattern="\d*"
      />
    </div>
  );
};

export default RoomSelector;
