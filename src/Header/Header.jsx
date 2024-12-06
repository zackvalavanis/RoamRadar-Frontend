import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import { HomePage } from './HomePage/HomePage.jsx'
// import { CitiesPage } from './CitiesPage/CitiesPage.jsx'
// import { LoginPage } from './Login/LoginPage.jsx'


//Figure out a way to put logout on here.. 
const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Cities', href: '/Cities', current: false },
  { name: 'Signup', href: '/Signup', current: false },
  { name: 'Login', href: '/Login', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-md">
      {({ open }) => (
        <>
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Disclosure.Button className="inline-flex items-left justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </Disclosure.Button>
                  </div>

                {/* Desktop navigation */}
                <div className="hidden sm:block">
                  <div className="ml-10 flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'text-white' : 'text-gray-300 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* User Profile - Right side */}
                <div className="flex items-center space-x-4">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <span className="sr-only">Notifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.403-1.403A2.992 2.992 0 0018 12V8a6 6 0 10-12 0v4a2.992 2.992 0 00-1.597 3.597L4 17h5m6 0v-1a3 3 0 10-6 0v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
