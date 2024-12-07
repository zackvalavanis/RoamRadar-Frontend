import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Logout } from '../LogoutLink/Logout';
import { useAuth } from '../AuthenticationProvider/AuthProvider';

const navigationLeft = [
  { name: 'Home', href: '/', current: true },
  { name: 'Cities', href: '/Cities', current: false },
];

const navigationRight = [
  { name: 'Signup', href: '/Signup', current: false },
  { name: 'Login', href: '/Login', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  const { auth } = useAuth();

  return (
    <Disclosure as="header" className="bg-gray-800 shadow-md">
      {({ open }) => (
        <>
          <nav className="max-w-10px mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* Logo and Left Navigation */}
              <div className="flex items-center space-x-4">
                <a href="/" className="text-white text-lg font-bold hover:text-gray-400">
                  MyLogo
                </a>
                <div className="hidden sm:flex space-x-4">
                  {navigationLeft.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Navigation */}
              {!auth && (
                <div className="hidden sm:flex items-center space-x-4">
                  {navigationRight.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}

                </div>
              )}
              {auth &&
              <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                <Logout />
              </div>
              } 
              {/* Hamburger Menu for Mobile */}
              <div className="sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3">
              <Disclosure.Button
                as="a"
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                MyLogo
              </Disclosure.Button>
              {navigationLeft.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {auth &&
                navigationRight.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              {auth && (
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Logout />
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
