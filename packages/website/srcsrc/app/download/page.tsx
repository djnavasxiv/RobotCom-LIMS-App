export default function Download() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Download RobotComLab</h1>
      <p className="mt-3">
        Download the latest version for Windows.
      </p>
      <a
        href="/downloads/RobotComLab-Setup-1.0.0.exe"
        download
        className="mt-8 inline-block px-8 py-3 bg-blue-500 text-white rounded-lg"
      >
        Download for Windows
      </a>
    </div>
  );
}
