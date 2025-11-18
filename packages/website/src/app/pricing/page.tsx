import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works best for your laboratory. All plans include full access to RobotComLab features.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900">Monthly Plan</h2>
            <p className="text-gray-600 mt-2">Perfect for testing or short-term use</p>
            
            <div className="mt-6 mb-8">
              <span className="text-5xl font-bold text-gray-900">$49</span>
              <span className="text-gray-600 ml-2">per month</span>
            </div>

            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>

            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-gray-900">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Full LIMS functionality</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Unlimited patients & tests</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">14+ test types included</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Offline operation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">PDF report generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Weekly license check</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-gray-600">Phone support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Yearly Plan - Recommended */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105 relative">
          <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">BEST VALUE</div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white">Yearly Plan</h2>
            <p className="text-blue-100 mt-2">Save 15% compared to monthly</p>
            
            <div className="mt-6 mb-8">
              <span className="text-5xl font-bold text-white">$499</span>
              <span className="text-blue-100 ml-2">per year</span>
            </div>

            <button className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Subscribe Now
            </button>

            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-white">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Full LIMS functionality</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Unlimited patients & tests</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">14+ test types included</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Offline operation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">PDF report generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Priority email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-300 font-bold">✓</span>
                  <span className="text-blue-50">Phone support available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-center py-3 px-4 font-semibold">Monthly</th>
                <th className="text-center py-3 px-4 font-semibold">Yearly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">LIMS Core Features</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">14+ Laboratory Test Types</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Unlimited Patients & Samples</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Offline Operation</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">PDF Report Generation</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Multi-Lab Branding</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Email Support</td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">Priority Email Support</td>
                <td className="text-center"><span className="text-red-600 font-bold">✗</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Phone Support</td>
                <td className="text-center"><span className="text-red-600 font-bold">✗</span></td>
                <td className="text-center"><span className="text-green-600 font-bold">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll have access until the end of your billing period.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">We accept credit cards, bank transfers, and other standard payment methods. Contact us for details.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">Yes! New installations come with a 7-day trial period with full functionality to test RobotComLab.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Can I upgrade or downgrade?</h3>
            <p className="text-gray-600">Absolutely. You can change your plan at any time. We'll adjust your billing accordingly.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">What about volume discounts?</h3>
            <p className="text-gray-600">For organizations needing multiple licenses, please contact us to discuss custom pricing.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Do you offer support?</h3>
            <p className="text-gray-600">Yes! All plans include email support. Yearly plans also get priority support and phone assistance.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Laboratory?</h2>
        <p className="text-lg mb-8 opacity-90">Start with a 7-day free trial. No credit card required.</p>
        <Link href="/download" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
          Download and Get Started
        </Link>
      </section>
    </div>
  );
}
