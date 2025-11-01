import { useState, type FC } from "react";
import type { TItem } from "../../types/item";
import { Check, Search } from "lucide-react";

type ModalItemsProps = {
  items: TItem[] | undefined;
  open: boolean;
  onClose: () => void;
  onItemSelect?: (item: TItem) => void;
  onItemsSelect?: (items: TItem[]) => void;
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

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-[#0E123E] bg-opacity-70 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <div
              className="bg-[#F4F7FD] rounded-[20px] shadow-lg h-[80vh] max-h-[530px] w-[80vw] max-w-[568px] flex flex-col p-[30px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="">
                <h2 className="text-xl font-semibold text-center">
                  Add Items
                </h2>

                {/* Search */}
                <div className="relative flex flex-row items-center rounded p-2 gap-x-2 mt-4 shadow-input">
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
              <div className="flex-1 overflow-y-auto max-h-[500px] mt-[32px]">
                <div className="grid grid-cols-6 gap-x-4 mb-4 px-3">
                  <div className="font-bold  col-span-3">Item</div>
                  <div className="font-bold  col-span-2">Type</div>
                  <div className="font-bold  col-span-1">
                  </div>
                </div>

                {items?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border-b border-gray-200 grid grid-cols-6 gap-x-4 items-center cursor-pointer 
                      ${
                        mode === 'single' ? selectedItem?.id === item.id ? 'bg-[#EEE8FA]' : '' : selectedItems.some((selectedItem) => selectedItem.id === item.id) ? 'bg-[#EEE8FA]' : ''
                      }
                    `}
                    onClick={() =>
                      mode === "single"
                        ? handleSingleItemChange(item)
                        : handleMultipleItemToggle(item)
                    }
                  >
                    <div className="col-span-3">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">{item.type}</p>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      {mode === "single" ? (
                        <div className="relative">
                          <input
                            type="radio"
                            name="selectedItem"
                            checked={selectedItem?.id === item.id}
                            onChange={() => handleSingleItemChange(item)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 border-2 flex items-center justify-center cursor-pointer ${
                            selectedItem?.id === item.id 
                              ? 'bg-[#AF91EB] border-[#AF91EB]'
                              : 'border-[#AF91EB] bg-white'
                          }`}>
                            {selectedItem?.id === item.id && (
                              <Check size={16} color="white" strokeWidth={2} />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedItems.some(
                              (selectedItem) => selectedItem.id === item.id
                            )}
                            onChange={() => handleMultipleItemToggle(item)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
                            selectedItems.some((selectedItem) => selectedItem.id === item.id)
                              ? 'bg-[#AF91EB] border-[#AF91EB]'
                              : 'border-[#AF91EB] bg-white'
                          }`}>
                            {selectedItems.some((selectedItem) => selectedItem.id === item.id) && (
                              <Check size={16} color="white" strokeWidth={2} />
                            )}
                          </div>
                        </div>
                      )}
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
              <div className="mt-[32px] flex justify-center gap-x-4">
                <button
                  onClick={handleClose}
                  className="h-[43px] px-[20px] w-[170px] border border-[#FF8780] text-[#FF8780] rounded-lg font-bold"
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
                  className="h-[43px] px-[20px] w-[170px] border bg-[#AF91EB]  shadow-purple text-white rounded-lg font-bold"
                >
                  {mode === "single"
                    ? selectedItem
                      ? "1 | Add Item"
                      : "Add Item"
                    : selectedItems.length > 0
                      ? `${selectedItems.length} | Add Item (s)`
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
