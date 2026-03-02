export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Present<span className="text-blue-500">Pro</span></span>
          </div>
          <p className="text-sm text-gray-500">
            Redefining the modern classroom and boardroom with intelligent, interactive presentation software.
          </p>
        </div>

        {/* Product Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-bold mb-2">Product</h4>
          <a href="#features" className="hover:text-white transition-colors text-sm">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors text-sm">Pricing</a>
          <a href="#" className="hover:text-white transition-colors text-sm">Case Studies</a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-bold mb-2">Legal</h4>
          <a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors text-sm">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors text-sm">Contact Support</a>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI Presentation System. All rights reserved.
      </div>
    </footer>
  );
}