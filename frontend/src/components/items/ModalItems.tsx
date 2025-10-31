import { useState, type FC } from "react";
import type { TItem } from "../../types/item";
import { Search } from "lucide-react";

type ModalItemsProps = {
  items: TItem[] | undefined;
  open: boolean;
  onClose: () => void;
  onItemSelect?: (item: TItem) => void; // untuk single selection
  onItemsSelect?: (items: TItem[]) => void; // untuk multiple selection
  mode: "single" | "multiple";
  search: string;
  handleSearch: (term: string) => void;
};

export const ModalItems: FC<ModalItemsProps> = ({
  items,
  open,
  onClose,
  onItemSelect,
  onItemsSelect,
  mode,
  search,
  handleSearch,
}) => {
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<TItem[]>([]);

  // Handle radio selection untuk single mode
  const handleSingleItemChange = (item: TItem) => {
    setSelectedItem(item);
  };

  // Handle checkbox selection untuk multiple mode
  const handleMultipleItemToggle = (item: TItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(
        (selectedItem) => selectedItem.id === item.id
      );
      if (isSelected) {
        return prev.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (mode === "single" && selectedItem && onItemSelect) {
      onItemSelect(selectedItem);
      setSelectedItem(null);
    } else if (
      mode === "multiple" &&
      selectedItems.length > 0 &&
      onItemsSelect
    ) {
      onItemsSelect(selectedItems);
      setSelectedItems([]);
    }
    handleSearch("");
    onClose();
  };

  // Handle close modal
  const handleClose = () => {
    setSelectedItem(null);
    setSelectedItems([]);
    handleSearch("");
    onClose();
  };

  console.log(items);
  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-purple-900 bg-opacity-70 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-2/5 max-h-4/5 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-center text-gray-800">
                  {mode === "single" ? "Select Item" : "Select Items"}
                </h2>

                {/* Search */}
                <div className="relative flex flex-row bg-gray-50 items-center rounded p-2 gap-x-2 mt-4">
                  <Search className="text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-8 w-full bg-transparent focus:outline-none focus:ring-0 focus:border-0"
                    placeholder="Search by type or name"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto max-h-[500px] p-6">
                <div className="grid grid-cols-6 gap-x-4 mb-4">
                  <div className="font-bold text-gray-700 col-span-1">
                    Select
                  </div>
                  <div className="font-bold text-gray-700 col-span-3">Item</div>
                  <div className="font-bold text-gray-700 col-span-2">Type</div>
                </div>

                {items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 mb-2 bg-gray-50 rounded shadow hover:bg-gray-100 transition-colors grid grid-cols-6 gap-x-4 items-center cursor-pointer"
                    onClick={() =>
                      mode === "single"
                        ? handleSingleItemChange(item)
                        : handleMultipleItemToggle(item)
                    }
                  >
                    <div className="col-span-1">
                      {mode === "single" ? (
                        <input
                          type="radio"
                          name="selectedItem"
                          checked={selectedItem?.id === item.id}
                          onChange={() => handleSingleItemChange(item)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (selectedItem) => selectedItem.id === item.id
                          )}
                          onChange={() => handleMultipleItemToggle(item)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                    </div>
                    <div className="col-span-3">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">{item.type}</p>
                    </div>
                  </div>
                ))}

                {items?.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No items found matching "{search}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-center gap-x-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={
                    mode === "single"
                      ? !selectedItem
                      : selectedItems.length === 0
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mode === "single"
                    ? selectedItem
                      ? "Add Item"
                      : "Add Item"
                    : selectedItems.length > 0
                    ? `Add ${selectedItems.length} Items`
                    : "Add Items"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
