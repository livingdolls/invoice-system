import { apiClient } from "../lib/api";
import {
  type InvoiceResponse,
  type TCreateInvoice,
  type TInvoiceDetail,
  type TRequestInvoice,
} from "../types/invoice";

export const InvoicesRepository = async (req: TRequestInvoice) => {
  const params = new URLSearchParams();

  if (req.invoice_id) params.append("invoice_id", req.invoice_id);
  if (req.issue_date)
    params.append("issue_date", new Date(req.issue_date).toISOString());
  if (req.subject) params.append("subject", req.subject);
  if (req.customer_name) params.append("customer_name", req.customer_name);
  if (req.due_date)
    params.append("due_date", new Date(req.due_date).toISOString());
  if (req.status) params.append("status", req.status);
  if (req.limit) params.append("limit", req.limit.toString());
  if (req.page) params.append("page", req.page.toString());

  const res = await apiClient.get<InvoiceResponse>(
    `/invoices?${params.toString()}`
  );
  return res.data;
};

export const CreateInvoiceRepository = async (invoiceData: TCreateInvoice) => {
  const res = await apiClient.post<string>("/invoices", invoiceData);
  return res.data;
};

export const GetInvoiceByIdRepository = async (id: string) => {
  const res = await apiClient.get<TInvoiceDetail>(`/invoices/${id}`);
  return res.data;
};

export const UpdateInvoiceRepository = async (
  id: string,
  invoiceData: TCreateInvoice
) => {
  const res = await apiClient.put<string>(`/invoices/${id}`, invoiceData);
  return res.data;
};
