import { useMemo } from "react";
import Select from "react-select";
import { Check } from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import type { CustomerOption } from "../../types/invoice";
import type { TCustomer } from "../../types/customer";

interface CustomerSelectionProps {
  selectedCustomer: CustomerOption | null;
  onCustomerChange: (option: CustomerOption | null) => void;
  onAddressChange: (address: string) => void;
  address: string;
}

export default function CustomerSelection({
  selectedCustomer,
  onCustomerChange,
  onAddressChange,
  address,
}: CustomerSelectionProps) {
  const { data: customers, isLoading, error } = useCustomers();

  const options: CustomerOption[] = useMemo(
    () =>
      (customers || []).map((c: TCustomer) => ({
        value: c.id,
        label: c.name,
        customer: c,
      })),
    [customers]
  );

  const handleCustomerChange = (option: CustomerOption | null) => {
    onCustomerChange(option);
    onAddressChange(option?.customer.address || "");
  };

  // Custom styles untuk react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "none",
      borderRadius: "0.375rem",
      padding: "0.125rem",
      fontSize: "14px",
      height:"46px",
      fontWeight:"500",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#EEE8FA"
        : state.isFocused
        ? "white"
        : "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "&:hover": {
        backgroundColor: state.isSelected ? "#EEE8FA" : "#f3f4f6",
      },
    }),
  };

  const formatOptionLabel = (
    option: CustomerOption,
    meta: {
      selectProps?: any;
      selectValue?: any;
      context?: any;
      isFocused?: boolean;
      isDisabled?: boolean;
      isSelected?: boolean | undefined;
    }
  ) => {
    const selectValue = meta.selectValue;
    const selectProps = meta.selectProps;

    const isSelected =
      Array.isArray(selectValue) && selectValue.length > 0
        ? selectValue.some((v: any) => v?.value === option.value)
        : selectProps && selectProps.value
        ? selectProps.value.value === option.value
        : false;

    if (meta.context === "menu") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{option.label}</span>
          {isSelected && 
          <div className="p-1 bg-accent-200 rounded">
            <Check size={16} strokeWidth={2} className="text-white" />
          </div>
          }
        </div>
      );
    }

    return <span>{option.label}</span>;
  };

  if (error) {
    return (
      <div className="">
        <h2 className="text-xl font-semibold mb-6">
          Customer Information
        </h2>
        <div className="w-full p-3 border border-red-300 rounded-md bg-red-50">
          <span className="text-red-500">Error loading customers</span>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-[14px]">
        Customer Information
      </h2>

      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer
          </label>
          {isLoading ? (
            <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50">
              <span className="text-gray-500">Loading customers...</span>
            </div>
          ) : (
            <Select
              value={selectedCustomer}
              onChange={handleCustomerChange}
              options={options}
              styles={customStyles}
              placeholder="Select a customer..."
              noOptionsMessage={() => "No customers found"}
              className="react-select-container shadow-input border-0 rounded-lg outline-0 ring-0 w-[400px]"
              classNamePrefix="react-select"
              formatOptionLabel={formatOptionLabel}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detail Address
          </label>
          <textarea
            rows={4}
            disabled
            className="w-full p-4 bg-input-600 font-medium text-sm rounded-lg"
            value={address}
          />
        </div>
      </div>
    </div>
  );
}
