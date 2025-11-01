import type { InvoiceItem } from "../../types/invoice";
import type { TItem } from "../../types/item";
import { useState } from "react";
import { ModalItems } from "../items/ModalItems";
import { useItems } from "../../hooks/useItems";
import { ChevronDown, CirclePlus, Trash } from "lucide-react";
import { CurrencyInput } from "../ui/CurrencyInput";
import { formatCurrency } from "../../utils/currency";

interface InvoiceItemsManagerProps {
  invoiceItems: InvoiceItem[];
  onQuantityChange: (index: number, quantity: number) => void;
  onPriceChange: (index: number, price: number) => void;
  onRemoveItem: (index: number) => void;
  onItemSelect: (item: TItem) => void;
  onItemsSelect: (items: TItem[]) => void;
}

export default function InvoiceItemsManager({
  invoiceItems,
  onQuantityChange,
  onPriceChange,
  onRemoveItem,
  onItemSelect,
  onItemsSelect,
}: InvoiceItemsManagerProps) {
  const {
    data: items,
    open,
    handleOpen,
    search,
    handleSearch,
  } = useItems();

  // State to track modal mode
  const [modalMode, setModalMode] = useState<"single" | "multiple">("single");

  // Handler untuk buka modal dengan mode single selection
  const handleOpenSingleSelection = () => {
    setModalMode("single");
    handleOpen(true);
  };

  // Handler untuk buka modal dengan mode multiple selection
  const handleOpenMultipleSelection = () => {
    setModalMode("multiple");
    handleOpen(true);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Details Items
      </h2>

      {/* Items List */}
      <div className="space-y-4">
        {invoiceItems.map((invoiceItem, index) => (
          <div
            key={`${invoiceItem.item.id}-${index}`}
            className="flex flex-row gap-4 items-center"
          >
            {/* Item Info */}
            <div className="">
              <label className="text-xs mb-2 block">
                Items
              </label>
              <div className="h-[46px] shadow-input rounded-lg flex items-center w-[297px] bg-white relative px-4 text-sm font-medium">
                {invoiceItem.item.name}

                <ChevronDown size={18} className="absolute right-4 inset-y-0 my-auto" />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs mb-2 block">
                Qty
              </label>
              <input
                type="number"
                min="1"
                value={invoiceItem.quantity}
                onChange={(e) =>
                  onQuantityChange(index, parseInt(e.target.value) || 1)
                }
                className="h-[46px] w-[84px] rounded-lg px-4 text-right font-medium text-sm"
                placeholder="0"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs mb-2 block">
                Unit Price
              </label>
              <CurrencyInput
                value={invoiceItem.price}
                onChange={(value) => onPriceChange(index, value)}
                className="w-[189px] h-[46px] rounded-lg px-4 font-medium text-sm text-right"
                placeholder="0"
                prefix=""
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs mb-2 block">
                Amount
              </label>
              <input
                type="text"
                value={formatCurrency(invoiceItem.amount)}
                disabled
                className="w-[189px] h-[46px] rounded-lg px-4 font-medium text-sm text-right bg-input-600"
                placeholder="0"
              />
            </div>

            {/* Remove Button */}
            <div className="flex justify-center w-[20px] items-center relative">
              <button
                onClick={() => onRemoveItem(index)}
                className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors top-[10px] relative"
                title="Remove item"
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}

        {/* Add Item Button Row - untuk single selection */}
        <div className="flex flex-row gap-4 items-center">
          {/* Item Info */}
          <div className="md:col-span-1">
            <label className="text-xs mb-2 block">
              Item
            </label>
            <button
              onClick={handleOpenSingleSelection}
              className="h-[46px] shadow-input rounded-lg flex items-center w-[297px] bg-white relative px-4 text-sm font-medium"
            >
              Select your items
              <ChevronDown size={18} className="absolute right-4 inset-y-0 my-auto" />
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs mb-2 block">
              Qty
            </label>
            <input
              type="number"
              min="1"
              disabled
              className="h-[46px] w-[84px] rounded-lg px-4 text-right font-medium text-sm"
              placeholder="0"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs mb-2 block">
              Price
            </label>
            <input
              type="text"
              disabled
              className="w-[189px] h-[46px] rounded-lg px-4 font-medium text-sm text-right"
              placeholder="0"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs mb-2 block">
              Amount
            </label>
            <input
              type="text"
              disabled
              className="w-[189px] h-[46px] rounded-lg px-4 font-medium text-sm text-right bg-input-600"
              placeholder="0"
            />
          </div>

          {/* Placeholder */}
          <div className="flex justify-center">
            <span className="text-gray-400 text-sm">-</span>
          </div>
        </div>

        {/* Add Multiple Items Button */}
        <div className="">
          <button
            onClick={handleOpenMultipleSelection}
            className="border-accent-200 border text-accent-200 py-3 px-[20px] bg-white rounded-lg flex flex-row gap-2"
          >
            <CirclePlus size={24} className="color-accent-200" />
            Add Item
          </button>
        </div>
      </div>

      {/* Items Modal */}
      <ModalItems
        items={items}
        open={open}
        onClose={() => handleOpen(false)}
        onItemSelect={onItemSelect}
        onItemsSelect={onItemsSelect}
        mode={modalMode}
        search={search}
        handleSearch={handleSearch}
      />
    </div>
  );
}
