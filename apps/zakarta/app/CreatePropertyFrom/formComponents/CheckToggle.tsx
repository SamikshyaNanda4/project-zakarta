// components/CheckToggle.tsx

export function CheckToggle({ checked, onChange, label }: any) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-3 py-2 rounded-lg border text-sm ${
        checked
          ? "bg-green-100 border-green-500 text-green-700"
          : "border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}