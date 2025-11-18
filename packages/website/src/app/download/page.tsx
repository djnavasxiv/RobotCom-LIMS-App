export default function Download() {
  const downloadUrl = '/downloads/RobotComLab-Setup-1.0.0.exe';

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900">Download RobotComLab</h1>
        <p className="mt-4 text-xl text-gray-600">
          Get the latest version of RobotComLab for Windows
        </p>
      </section>

      {/* Main Download Section */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Version 1.0.0</h2>
          <p className="text-gray-600 mb-6">Latest stable release with all core LIMS features and improvements.</p>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-4">System Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Windows 10 or later</li>
              <li>✓ 4 GB RAM minimum (8 GB recommended)</li>
              <li>✓ 500 MB free disk space</li>
              <li>✓ Administrator privileges for installation</li>
              <li>✓ Internet connection for license activation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <a 
              href={downloadUrl}
              download="RobotComLab-Setup-1.0.0.exe"
              className="block w-full py-4 px-6 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              📥 Download for Windows (Installer)
            </a>
            <p className="text-sm text-gray-600 text-center">File size: ~250 MB | .exe installer</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">What's Included</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">🏥 Core Features</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Patient management system</li>
                <li>• 14+ laboratory test types</li>
                <li>• Sample tracking</li>
                <li>• Test result entry forms</li>
                <li>• Billing & invoicing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📊 Reporting & Analytics</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• PDF report generation</li>
                <li>• Professional formatting</li>
                <li>• Multi-lab branding support</li>
                <li>• Commission tracking</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🔐 Security</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Role-based access control</li>
                <li>• Encrypted passwords</li>
                <li>• Audit logging</li>
                <li>• License protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Installation Instructions</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">1</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Download the Installer</h3>
              <p className="text-gray-600 mt-1">Click the download button above to get the RobotComLab installer (.exe file).</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">2</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Run the Installer</h3>
              <p className="text-gray-600 mt-1">Double-click the downloaded .exe file and follow the installation wizard. You may need administrator privileges.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">3</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Complete Installation</h3>
              <p className="text-gray-600 mt-1">Choose installation directory and wait for the setup to complete. RobotComLab will be added to your Start Menu.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">4</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Launch & Activate</h3>
              <p className="text-gray-600 mt-1">Launch RobotComLab from your Start Menu. You'll need to activate your license on first run (requires internet connection).</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">5</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Log In</h3>
              <p className="text-gray-600 mt-1">Use your credentials to log in. Demo credentials are available for testing (admin/password).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Help */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-green-900 mb-4">✓ Successful Installation Tips</h3>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• Run as Administrator if you encounter permission issues</li>
            <li>• Ensure your antivirus software doesn't block the installer</li>
            <li>• Check your internet connection for license activation</li>
            <li>• Keep your Windows system updated</li>
            <li>• Allocate at least 4GB of RAM for optimal performance</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">ℹ Getting Started</h3>
          <ul className="space-y-2 text-yellow-800 text-sm">
            <li>• Read the user guide included with the installation</li>
            <li>• Check the Settings page to configure your lab information</li>
            <li>• Start by adding test data to familiarize yourself with features</li>
            <li>• Contact support for training or assistance</li>
            <li>• Regular backups of your data are recommended</li>
          </ul>
        </div>
      </section>

      {/* Licensing */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Licensing</h2>
        <p className="text-gray-600 mb-6">
          RobotComLab is protected by a subscription-based licensing system. Users must activate their license within 7 days of installation. Weekly online validation is required to maintain an active license. Visit our <a href="/pricing" className="text-blue-600 hover:underline">Pricing page</a> for available plans.
        </p>
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
          <p className="text-blue-900 font-semibold">💡 Trial Mode</p>
          <p className="text-blue-800 text-sm mt-1">New installations come with a 7-day trial period with full functionality. Subscribe to continue using RobotComLab after the trial period.</p>
        </div>
      </section>
    </div>
  );
}
