import "./App.css";
import { ConversationalForm } from "./components/ConversationalForm";
import type { FieldDefinition } from "./components/ConversationalForm/types";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL!;

function App() {
  const requiredFields: FieldDefinition[] = [
    { name: "age", label: "Age" },
    { name: "weight", label: "Weight" },
    { name: "height", label: "Height" },
  ];

  const handleComplete = (data: Record<string, unknown>) => {
    console.log("✅ Collected Data:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 min-w-lg">
      <ConversationalForm
        initialMessage="Hello! I'll ask you a few questions."
        requiredFields={requiredFields}
        onComplete={handleComplete}
        apiBaseUrl={BASE_API_URL}
      />
    </div>
  );
}

export default App;
