import React from 'react';
import Link from 'next/link';

const WebsiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-gray-700">
              RobotComLab
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/features" className="py-2 px-3">Features</Link>
              <Link href="/pricing" className="py-2 px-3">Pricing</Link>
              <Link href="/download" className="py-2 px-3 bg-blue-500 text-white rounded">Download</Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-10">
        {children}
      </main>
      <footer className="bg-white mt-10">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} RobotComLab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
