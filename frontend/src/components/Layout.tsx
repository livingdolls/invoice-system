import { Book, House, Settings } from "lucide-react";
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
      icon: <Book />,
    },
    {
      name : "Setting",
      href : "/settings",
      icon : <Settings />
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-accent-500">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-[191px] bg-accent-500 shadow-xl">
        {/* Navigation */}
        <nav className="mt-6 px-6 h-full flex flex-col justify-center">
          <div className="flex items-center flex-row justify-center gap-2 mb-16">
            <div className="size-9 rounded-full bg-accent-200 text-white flex items-center justify-center text-lg font-bold">H</div>
            <h2 className="text-white text-xs font-bold">Invoice System</h2>
          </div>
          <ul className="space-y-10">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-4 text-xs font-medium rounded-md transition-colors
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
      <div className="pl-[12rem] py-4 pr-4">
        <main className="px-[35px] py-[24px] bg-accent-50 rounded-2xl h-[95vh] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
