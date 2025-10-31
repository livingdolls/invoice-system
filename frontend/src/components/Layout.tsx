import { House } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: <House />,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-accent-500">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-accent-500 shadow-xl">
        {/* Navigation */}
        <nav className="mt-6 px-3 h-full flex flex-col justify-center">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      isActiveRoute(item.href)
                        ? "bg-accent-200 text-white"
                        : "text-white"
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64 py-4 pr-4">
        <main className="p-6 bg-accent-50 rounded-2xl h-[95vh] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
