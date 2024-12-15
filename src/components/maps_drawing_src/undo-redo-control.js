
export const UndoRedoControl = ({handleUndo, handleRedo, undoStack, redoStack}) => {

  return (
    <div className="drawing-history mt-1">
      <button
         onClick={handleUndo} disabled={undoStack.length === 0}
        type="button"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="26"
          viewBox="0 -960 960 960"
          width="26">
          <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
        </svg>
      </button>
      <button
         onClick={handleRedo} disabled={redoStack.length === 0}
        type="button"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="26"
          viewBox="0 -960 960 960"
          width="26">
          <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
        </svg>
      </button>
    </div>
  );
};
