import Link from 'next/link';

export default function Features() {
  const features = [
    {
      title: "Patient Management",
      description: "Complete patient database with detailed medical history, contact information, and demographic data. Quick search and filtering capabilities.",
      icon: "👥"
    },
    {
      title: "Test Ordering System",
      description: "Streamlined test ordering with support for 14+ different laboratory test types including blood tests, chemistry panels, and immunoassays.",
      icon: "📋"
    },
    {
      title: "Sample Tracking",
      description: "Track samples from collection through testing to result reporting. Barcode support and sample status management.",
      icon: "🧫"
    },
    {
      title: "Test Result Entry",
      description: "Easy-to-use forms for entering test results with validation, reference ranges, and flag management for abnormal values.",
      icon: "📊"
    },
    {
      title: "Billing & Invoices",
      description: "Automated invoice generation, payment tracking, and financial reporting. Support for multiple payment methods.",
      icon: "💳"
    },
    {
      title: "Commission Tracking",
      description: "Calculate and track commissions for doctors and referrers. Automated commission reports and payment management.",
      icon: "💰"
    },
    {
      title: "Professional Reports",
      description: "Generate beautifully formatted PDF reports with lab branding, test results, and interpretations ready for delivery to patients and doctors.",
      icon: "📄"
    },
    {
      title: "Multi-Timer Tool",
      description: "Built-in timer for test procedures with multiple concurrent timers. Perfect for time-sensitive laboratory operations.",
      icon: "⏱️"
    },
    {
      title: "User Management",
      description: "Role-based access control with multiple user types: Admin, Doctor, Technician, and Receptionist. Secure authentication.",
      icon: "🔐"
    },
    {
      title: "Inventory Management",
      description: "Track laboratory supplies and reagents. Monitor stock levels, receive alerts for low inventory, and manage supplier information.",
      icon: "📦"
    },
    {
      title: "Offline Operation",
      description: "Work completely offline with local SQLite database. Synchronize when online. Weekly license validation checks.",
      icon: "🌐"
    },
    {
      title: "Multi-Lab Support",
      description: "Customize the application for different laboratories with custom branding, logos, and company information.",
      icon: "🏢"
    },
    {
      title: "Advanced Search",
      description: "Powerful search across patients, tests, samples, and results. Filter by date, status, and other criteria.",
      icon: "🔍"
    },
    {
      title: "Settings & Configuration",
      description: "Customize application settings, change password, manage database, and configure user preferences.",
      icon: "⚙️"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900">Comprehensive Features</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          RobotComLab comes packed with powerful features designed to streamline laboratory operations and improve efficiency.
        </p>
      </section>

      <section>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Windows 10 and later</li>
              <li>✓ Built with Electron (v28.0+)</li>
              <li>✓ React 18.2.0 frontend</li>
              <li>✓ SQLite database</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Security</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Bcrypt password hashing</li>
              <li>✓ Role-based access control</li>
              <li>✓ Audit logging</li>
              <li>✓ Secure authentication</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Data Management</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Local SQLite database</li>
              <li>✓ Prisma ORM</li>
              <li>✓ Automatic backups</li>
              <li>✓ Data persistence</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Performance</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Lightning-fast UI</li>
              <li>✓ Optimized database queries</li>
              <li>✓ Minimal resource usage</li>
              <li>✓ Smooth animations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8">Download RobotComLab and experience the power of a complete LIMS solution.</p>
        <Link href="/download" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Download Now
        </Link>
      </section>
    </div>
  );
}
