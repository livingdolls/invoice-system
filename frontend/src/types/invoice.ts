import type { TItem } from "./item";
import type { TCustomer } from "./customer";

export const InvoiceStatus = {
  PAID: "paid",
  UNPAID: "unpaid",
} as const;

type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type TInvoice = {
  id: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subject: string;
  total_items: number;
  customer_name: string;
  total_amount: number;
  status: InvoiceStatus;
};

export type InvoiceResponse = {
  invoices: TInvoice[];
  pagination: TPagination;
};

export type TPagination = {
  total_items: number;
  total_pages: number;
  current_page: number;
  next_page?: number;
  prev_page?: number;
};

export type TRequestInvoice = {
  invoice_id?: string;
  issue_date?: string;
  subject?: string;
  total_items?: number;
  customer_name: string;
  due_date?: string;
  status?: InvoiceStatus | null;
  cursor?: Date | null;
  limit: number;
  page?: number;
};

export type TCreateInvoice = {
  issue_date: string;
  due_date: string;
  subject: string;
  customer_id: number;
  items: {
    item_id: number;
    quantity: number;
    price: number;
  }[];
};

export type TUpdateInvoice = Partial<TCreateInvoice>;

export interface InvoiceItem {
  item: TItem;
  quantity: number;
  price: number;
  amount: number;
}

export type CustomerOption = {
  value: number;
  label: string;
  customer: TCustomer;
};

export type InvoiceForm = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subject: string;
  additionalNotes: string;
  customerId: number | null;
  items: InvoiceItem[];
};

export type TInvoiceDetail = {
  id: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subject: string;
  customer: TCustomer;
  items: TInvoiceItemDetail[];
  subtotal: number;
  tax: number;
  total_amount: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
};

export type TInvoiceItemDetail = {
  id: number;
  item_id: number;
  item_name: string;
  type: string;
  quantity: number;
  price: number;
  total_price: number;
  created_at: string;
};
