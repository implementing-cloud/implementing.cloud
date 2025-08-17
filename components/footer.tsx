export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-foreground">
              Implementing Cloud
            </p>
            <p className="text-xs text-muted-foreground">
              Practical Research for Busy Developer
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Implementing Cloud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
