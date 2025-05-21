import React, { useState } from "react";

export default function EditableSection({ heading, content, onSave }) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(content);

  return (
    <div className="mb-4">
      <h3 className="text-xl font-medium">{heading}</h3>
      {edit ? (
        <div>
          <textarea
            className="w-full border p-2 mb-2"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <button
            onClick={() => {
              onSave(value);
              setEdit(false);
            }}
            className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
          >Save</button>
          <button onClick={() => setEdit(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
        </div>
      ) : (
        <div>
          <p>{value}</p>
          <button onClick={() => setEdit(true)} className="mt-1 text-blue-600 underline text-sm">Edit</button>
        </div>
      )}
    </div>
  );
}
