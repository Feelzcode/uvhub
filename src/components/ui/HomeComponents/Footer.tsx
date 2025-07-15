import React from 'react'

const Footer = () => {
  return (
   <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">uvHub</h3>
              <p className="text-gray-400 leading-relaxed">Professional grade gym equipment for serious athletes and fitness enthusiasts.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Shop</h4>
              <ul className="space-y-3">{['Strength', 'Cardio', 'Accessories', 'Bundles'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3">{['Contact Us', 'Shipping', 'Returns', 'FAQ'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">{['About'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 uvHub. All rights reserved.</p>
            <div className="flex space-x-6">{['Privacy', 'Terms', 'Sitemap'].map((item) => (<a key={item} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a>))}</div>
          </div>
        </div>
      </footer>
  )
}

export default Footer