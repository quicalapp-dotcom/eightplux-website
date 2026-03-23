export const metadata = {
  title: 'Maintenance Mode | Eightplux',
  description: 'We will be back soon!',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider font-tt">
            EIGHTPLU<span className="text-red-600">+</span>
          </h1>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Under Maintenance
        </h2>
        
        <p className="text-gray-400 text-lg mb-8">
          We're currently performing scheduled maintenance.
          <br />
          We'll be back online shortly!
        </p>

        {/* Coming Back Text */}
        <div className="text-gray-500 text-sm">
          <p>Thank you for your patience.</p>
          <p className="mt-2">© {new Date().getFullYear()} Eightplux. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
