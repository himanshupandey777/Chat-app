import { useState } from "react";

const CreateRoomModal = ({ onAddRoom, onClose }) => {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [autoDelete, setAutoDelete] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddRoom({ name, isPrivate, passcode, autoDelete });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create room");
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h3>New room</h3>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private room (passcode needed to join)
        </label>

        {isPrivate && (
          <>
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={autoDelete}
                onChange={(e) => setAutoDelete(e.target.checked)}
              />
              Delete messages after 24 hours
            </label>
          </>
        )}

        <p className="hint">Public rooms always delete messages after 24 hours.</p>

        <div className="modal-buttons">
          <button type="button" className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomModal;