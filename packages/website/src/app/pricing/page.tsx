export default function Pricing() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Pricing</h1>
      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Monthly Plan</h2>
          <p className="mt-2 text-3xl font-bold">$49</p>
          <p className="mt-1 text-gray-500">per month</p>
          <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded">Subscribe</button>
        </div>
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Yearly Plan</h2>
          <p className="mt-2 text-3xl font-bold">$499</p>
          <p className="mt-1 text-gray-500">per year</p>
          <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded">Subscribe</button>
        </div>
      </div>
    </div>
  );
}
