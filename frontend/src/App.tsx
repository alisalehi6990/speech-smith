import { useState } from "react";
import "./App.css";
import ConversationalForm from "./components/ConversationalForm";
import type { FieldDefinition } from "./components/ConversationalForm/types";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL!;

function App() {
  const [fields, setFields] = useState<FieldDefinition[]>([
    { name: "age", label: "Age" },
    { name: "weight", label: "Weight" },
    { name: "height", label: "Height" },
  ]);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [showComponent, setShowComponent] = useState(false);

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    setFields([
      ...fields,
      {
        name: newFieldName.trim(),
        label: newFieldLabel || newFieldName.trim(),
      },
    ]);
    setNewFieldName("");
    setNewFieldLabel("");
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleComplete = (data: Record<string, unknown>) => {
    console.log("✅ Collected Data:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 text-black">
        {!showComponent && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              Configure Your Conversational Form
            </h1>

            {/* Field Editor */}
            <div className="mb-6">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Field name (e.g. email)"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Label (optional)"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                >
                  Add Field
                </button>
              </div>

              <ul className="space-y-2 mt-4">
                {fields.map((field, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
                  >
                    <span>
                      <strong>{field.name}</strong> ({field.label})
                    </span>
                    <button
                      onClick={() => handleRemoveField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌ Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowComponent(true)}
                className="text-green-500 hover:text-green-700"
              >
                Ready
              </button>
            </div>
          </>
        )}

        {/* Conversational Form */}
        {showComponent && (
          <div className="mt-8">
            <ConversationalForm
              initialMessage="Hello! I'll ask you a few questions."
              requiredFields={fields}
              onComplete={handleComplete}
              apiBaseUrl={BASE_API_URL}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
