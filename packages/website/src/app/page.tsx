import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900">RobotComLab LIMS</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          A modern, comprehensive Laboratory Information Management System designed for clinical and diagnostic laboratories. Streamline your workflow with powerful tools for patient management, test ordering, and result reporting.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/download" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Download Now
          </Link>
          <Link href="/features" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
            Explore Features
          </Link>
        </div>
      </section>

      {/* Key Stats */}
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6">
          <p className="text-4xl font-bold text-blue-600">14+</p>
          <p className="mt-2 text-gray-600">Laboratory Test Types</p>
        </div>
        <div className="text-center p-6">
          <p className="text-4xl font-bold text-blue-600">100%</p>
          <p className="mt-2 text-gray-600">Offline Capable</p>
        </div>
        <div className="text-center p-6">
          <p className="text-4xl font-bold text-blue-600">Enterprise</p>
          <p className="mt-2 text-gray-600">Grade Security</p>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose RobotComLab?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">🏥</div>
            <h3 className="text-xl font-semibold mb-3">Complete LIMS Solution</h3>
            <p className="text-gray-600">All-in-one system for patient management, test ordering, sample tracking, and result reporting.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">Built with Electron and React for smooth, responsive performance on Windows desktops.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
            <p className="text-gray-600">Enterprise-grade security, role-based access control, and comprehensive audit logging.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-semibold mb-3">Works Offline</h3>
            <p className="text-gray-600">Full functionality without internet. License validation happens weekly when online.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-3">Advanced Reporting</h3>
            <p className="text-gray-600">Generate professional PDF reports for test results, invoices, and commissions instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-3">Multi-Lab Branding</h3>
            <p className="text-gray-600">Customize the application with your lab logo and branding for a professional appearance.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Laboratory?</h2>
        <p className="text-lg mb-8 opacity-90">Download RobotComLab today and take control of your laboratory operations.</p>
        <Link href="/download" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          Download Now
        </Link>
      </section>
    </div>
  );
}
