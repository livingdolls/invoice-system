export function TableHeader() {
  const headers = [
    "No",
    "Invoice ID",
    "Issue Date",
    "Subject",
    "Total Items",
    "Customer",
    "Due Date",
    "Status",
    "Actions",
  ];

  return (
    <thead className="">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className={`px-6 py-3 text-left text-sm font-medium  tracking-wider ${
              header === "Actions" ? "text-center" : ""
            }`}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
