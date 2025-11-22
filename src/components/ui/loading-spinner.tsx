export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <img
          src="/logo_rotation.gif"
          alt="Loading..."
          className="w-24 h-24 object-contain rounded-full mx-auto"
        />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
