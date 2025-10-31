import type { InvoiceItem } from "../../types/invoice";
import type { TItem } from "../../types/item";
import { ModalItems } from "../items/ModalItems";
import { useItems } from "../../hooks/useItems";

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
    isLoading: itemsLoading,
    isError: itemsError,
    open,
    handleOpen,
    search,
    handleSearch,
  } = useItems();

  // Handler untuk buka modal dengan mode single selection
  const handleOpenSingleSelection = () => {
    handleOpen(true);
  };

  // Handler untuk buka modal dengan mode multiple selection
  const handleOpenMultipleSelection = () => {
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
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
          >
            {/* Item Info */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item
              </label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {invoiceItem.item.name}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qty
              </label>
              <input
                type="number"
                min="1"
                value={invoiceItem.quantity}
                onChange={(e) =>
                  onQuantityChange(index, parseInt(e.target.value) || 1)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={invoiceItem.price}
                onChange={(e) =>
                  onPriceChange(index, parseFloat(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={invoiceItem.amount.toFixed(2)}
                disabled
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                placeholder="0"
              />
            </div>

            {/* Remove Button */}
            <div className="flex justify-center">
              <button
                onClick={() => onRemoveItem(index)}
                className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                title="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add Item Button Row - untuk single selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Item Info */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item
            </label>
            <button
              onClick={handleOpenSingleSelection}
              className="w-full p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left text-gray-500"
            >
              Select your items
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qty
            </label>
            <input
              type="number"
              min="1"
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
              placeholder="0"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
              placeholder="0"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
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
            className="py-3 px-4 bg-white  rounded-md focus:outline-none border border-purple-500  transition-colors"
          >
            + Add Multiple Items
          </button>
        </div>
      </div>

      {/* Total Summary */}
      {invoiceItems.length > 0 && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">
              Total Amount:
            </span>
            <span className="text-lg font-semibold text-gray-900">
              $
              {invoiceItems
                .reduce((total, item) => total + item.amount, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Items Modal */}
      <ModalItems
        items={items}
        open={open}
        onClose={() => handleOpen(false)}
        onItemSelect={onItemSelect}
        onItemsSelect={onItemsSelect}
        mode="single" // Will be dynamic based on which button was clicked
        search={search}
        handleSearch={handleSearch}
      />
    </div>
  );
}
