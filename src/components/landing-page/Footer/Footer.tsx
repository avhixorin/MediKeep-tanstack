import React from 'react';

const Footer: React.FC = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
            <div className='flex flex-col gap-6'>
                <div className="mb-6 md:mb-0">
                    <span className="self-center cursor-pointer font-playwrite text-2xl font-medium whitespace-nowrap text-white hover:text-slate-400"
                    onClick={scrollTop}
                    >
                        medikeep
                    </span>
                    
                </div>
                <div className="mb-6 md:mb-0">
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Subscribe to Our Newsletter</h2>
                    <div className="flex">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="p-2 rounded-l bg-gray-800 text-white border-none"
                    />
                    <button className="bg-blue-500 p-2 rounded-r hover:bg-blue-600">
                        Subscribe
                    </button>
                    </div>
                </div>
            </div>
          

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase">Follow Us</h2>
              <ul className="text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com/avhixorin" className="hover:underline">Github</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/abhishek-bharti-1558b3290" className="hover:underline">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase">Legal</h2>
              <ul className="text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-400 sm:text-center">
            ©2023 <a href="https://github.com/avhixorin" className="hover:underline">MediKeep</a>. All Rights Reserved.
          </span>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-2 font-oleo">
        <span className="text-sm text-gray-400">Developed by avhixorin</span>
      </div>
    </footer>
  );
};

export default Footer;
