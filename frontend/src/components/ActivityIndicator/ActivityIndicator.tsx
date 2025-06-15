export const ActivityIndicator = () => (
  <div className="flex justify-center items-center h-12">
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-6 bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
      ))}
    </div>
  </div>
);