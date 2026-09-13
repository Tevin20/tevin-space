export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-tevin-bg">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-tevin-product border-t-tevin-accent rounded-full animate-spin mb-4" />
        <p className="text-tevin-text font-medium">Loading Tevin Space...</p>
      </div>
    </div>
  );
}
