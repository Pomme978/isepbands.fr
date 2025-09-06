export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-3 sm:px-6 py-3 flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
        <p>© {currentYear} ISEPBANDS. All rights reserved.</p>
        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Admin Panel</span>
        </div>
      </div>
    </footer>
  );
}
