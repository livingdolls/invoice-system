import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import { Invoices, Items } from "./pages";
import AddInvoices from "./pages/AddInvoices";
import EditInvoices from "./pages/EditInvoices";
import ViewInvoice from "./pages/ViewInvoice";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/add" element={<AddInvoices />} />
            <Route path="/invoices/edit/:id" element={<EditInvoices />} />
            <Route path="/invoices/view/:id" element={<ViewInvoice />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
