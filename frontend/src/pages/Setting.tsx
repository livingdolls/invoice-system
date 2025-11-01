import { Link } from "react-router-dom";
import { useAddCustomer } from "../hooks/useAddCustomer";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useCreateItem } from "../hooks/useCreateItem";

export default function Settings () {
  const {formData, handleFormChange, isFormValid, resetForm, prepareCustomerData, formDataItem, handleFormChangeItem, isFormItemValid, resetFormItem, prepareItemData} = useAddCustomer();

  const {mutate: addCustomer, isPending: isCreatingCustomer} = useCreateCustomer();
  const {mutate: addItem, isPending: isCreatingItem} = useCreateItem();

  const handleCustomerCreateSubmit = () => {
    if (!isFormValid()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const customerData = prepareCustomerData();

      addCustomer(customerData, {
        onSuccess: () => {
          alert("Customer added successfully!");
          resetForm();
        },
        onError: (error) => {
          alert("Error adding customer. Please try again.");
          console.error("Error adding customer:", error);
        }
      });
    } catch (error) {
      alert("Error adding customer. Please try again.");
      console.error("Error adding customer:", error);
    }
  }

  const handleItemSubmit = () => {
    if(!isFormItemValid()) {
      alert("please fill in all fields")
      return
    }

    try {
      const itemData = prepareItemData()

      addItem(itemData, {
        onSuccess: () => {
          alert("items added successfully")
          resetFormItem()
        },
        onError: (err) => {
          alert("error adding item")
          console.error("error adding item", err)
        }
      })
    } catch (error) {
      alert("error adding item")
      console.error("error adding item", error)
    }
  }

  return <div>
    <div className="min-h-screen">
      <div className="flex flex-row text-sm gap-x-2 mb-2">
        <Link to="/">Home</Link>
        <p>{">"}</p>
        <p className="text-accent-200">Settings</p>
      </div>


      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-999">
          Settings
        </h1>
      </div>

      <div className="max-w-[1200px] grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-8 text-lg font-medium">Add Customer</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-2 block">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[46px] rounded-lg px-4 font-medium text-sm"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="text-xs mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[46px] rounded-lg px-4 font-medium text-sm"
                placeholder="Enter customer email"
              />
            </div>

            <div>
              <label className="text-xs mb-2 block">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[46px] rounded-lg px-4 font-medium text-sm"
                placeholder="Enter customer phone"
              />
            </div>

            <div>
              <label className="text-xs mb-2 block">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleFormChange("address", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[100px] rounded-lg p-4 font-medium text-sm"
                placeholder="Enter customer address"
              />
            </div>
          </div>

          <button disabled={!isFormValid() || isCreatingCustomer} onClick={handleCustomerCreateSubmit} className="border-accent-200 border text-accent-200 py-3 px-[20px] bg-white rounded-lg flex flex-row gap-2">
            {isCreatingCustomer ? "Adding..." : "Add Customer"}
          </button>
        </div>

        <div>
          <h3 className="mb-8 text-lg font-medium">Add Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-2 block">Item Name</label>
              <input
                type="text"
                value={formDataItem.name}
                onChange={(e) => handleFormChangeItem("name", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[46px] rounded-lg px-4 font-medium text-sm"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="text-xs mb-2 block">Item Type</label>
              <input
                type="text"
                value={formDataItem.type}
                onChange={(e) => handleFormChangeItem("type", e.target.value)}
                className="w-full max-w-[400px] rounded-lg shadow-input h-[46px] rounded-lg px-4 font-medium text-sm"
                placeholder="Enter item type"
              />
            </div>
          </div>

          <button disabled={!isFormItemValid() || isCreatingItem} onClick={handleItemSubmit} className="mt-4 border-accent-200 border text-accent-200 py-3 px-[20px] bg-white rounded-lg flex flex-row gap-2">
            {isCreatingItem ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  </div>
}