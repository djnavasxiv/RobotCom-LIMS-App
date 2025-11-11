export default function Features() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Features</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Modern UI/UX</h2>
          <p className="mt-2 text-gray-600">A clean, professional, and intuitive user interface designed for efficiency.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Subscription-based Licensing</h2>
          <p className="mt-2 text-gray-600">Secure, anti-piracy licensing with monthly and yearly options.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Multi-Lab Support</h2>
          <p className="mt-2 text-gray-600">Customizable branding, including logos and text, for each laboratory.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Offline-First</h2>
          <p className="mt-2 text-gray-600">Works without an internet connection, with a weekly online license check.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Professional Printing</h2>
          <p className="mt-2 text-gray-600">Generate high-quality PDF reports for test results and invoices.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Secure & Compliant</h2>
          <p className="mt-2 text-gray-600">Data encryption, user roles, and audit logging to ensure data integrity.</p>
        </div>
      </div>
    </div>
  );
}
