'use client';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>© {currentYear} ISEPBANDS. All rights reserved.</p>
        <div className="flex space-x-4">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Admin Panel</span>
        </div>
      </div>
    </footer>
  );
}
