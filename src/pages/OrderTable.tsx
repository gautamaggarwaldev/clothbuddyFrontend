/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ordersData from "../orderData/orderData.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import Image from "next/image";
import watermark from "../../public/wm.png"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster, toast } from "@/components/ui/sonner";

// Function to get the status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "text-green-500";
    case "Processing":
      return "text-[#3E54C8]";
    case "Incomplete":
      return "text-yellow-500";
    case "Pending":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Available status options
const statusOptions = ["Completed", "Processing", "Incomplete", "Pending"];

const OrderTable = () => {
  const [orders, setOrders] = useState(ordersData);
  const [originalOrders, setOriginalOrders] = useState(ordersData); // Keep original data for filtering
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    {}
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const actionMenuRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollPositionRef = useRef<number>(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Initialize order statuses
  useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    orders.forEach((order) => {
      initialStatuses[order.id] = order.status;
    });
    setOrderStatuses(initialStatuses);
  }, [orders]);

  // Function to parse date strings in the format "Feb 11, 10:25 am"
  // Completely rewritten date parsing function
  const parseOrderDate = (dateString: string) => {
    try {
      // Example format: "Feb 11, 10:25 am"
      const parts = dateString.match(/(\w+)\s+(\d+),\s+(\d+):(\d+)\s+(\w+)/);

      if (!parts) {
        console.error("Date string doesn't match expected format:", dateString);
        return null;
      }

      const monthNames = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };

      const month = monthNames[parts[1]];
      const day = parseInt(parts[2]);
      let hour = parseInt(parts[3]);
      const minute = parseInt(parts[4]);
      const ampm = parts[5].toLowerCase();

      // Validate month
      if (month === undefined) {
        console.error("Invalid month in date string:", dateString);
        return null;
      }

      // Validate day
      if (day < 1 || day > 31) {
        console.error("Invalid day in date string:", dateString);
        return null;
      }

      // Handle AM/PM
      if (ampm === "pm" && hour < 12) hour += 12;
      if (ampm === "am" && hour === 12) hour = 0;

      // Use current year
      const currentYear = new Date().getFullYear();

      // Create the date object
      const date = new Date(currentYear, month, day, hour, minute);

      // If the date is in the future, assume it's from the previous year
      if (date > new Date()) {
        date.setFullYear(currentYear - 1);
      }

      // Check if the date is valid
      if (date.getMonth() !== month || date.getDate() !== day) {
        console.error("Invalid date in date string:", dateString);
        return null;
      }

      return date;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  // Completely rewritten filter function
  const filterByDateRange = (months: number) => {
    // Validate months input
    if (months < 1 || months > 120) {
      console.error("Invalid months value:", months);
      toast("Invalid Filter", {
        description: "Please select a valid time range (1-120 months).",
        duration: 3000,
      });
      return;
    }

    // Calculate date range
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - months);

    // Set times to beginning/end of day for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    console.log("Filter range:", {
      from: startDate.toISOString(),
      to: today.toISOString(),
    });

    // Filter orders
    const filteredOrders = [];

    for (const order of originalOrders) {
      const orderDate = parseOrderDate(order.date);

      // Skip invalid dates
      if (!orderDate) {
        console.warn(
          `Skipping order ${order.id} due to invalid date format: ${order.date}`
        );
        continue;
      }

      // Debug log for individual orders
      console.log(
        `Order ${order.id} date: ${order.date} → ${orderDate.toISOString()}`
      );

      // Check if date is in range
      if (orderDate >= startDate && orderDate <= today) {
        filteredOrders.push(order);
        console.log(`✓ Order ${order.id} is within range`);
      } else {
        console.log(`✗ Order ${order.id} is outside range`);
      }
    }

    // Apply filter
    console.log(
      `Filtered ${originalOrders.length} → ${filteredOrders.length} orders`
    );

    setOrders(filteredOrders);
    setOpenActionMenuId(null);
    setActiveFilter(`Last ${months} Months`);

    toast(`Filter Applied`, {
      description: `Showing ${filteredOrders.length} orders from the last ${months} months`,
      duration: 3000,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setOrders(originalOrders);
    setOpenActionMenuId(null);
    setActiveFilter(null);

    toast(`Filter Cleared`, {
      description: "Showing all orders",
      duration: 3000,
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Store Orders", 14, 20);

    const tableColumn = [
      "Order ID",
      "Product",
      "Order Date",
      "Price (Rs)",
      "Payment",
      "Status",
    ];
    const tableRows: string[][] = [];

    orders.forEach((order) => {
      const price = order.price.replace(/[^0-9.]/g, "");
      const formattedPrice = `${parseFloat(price).toLocaleString("en-IN")}`;

      const rowData = [
        order.id,
        order.product,
        order.date,
        formattedPrice,
        order.payment,
        order.status,
      ];
      tableRows.push(rowData);
    });

    // Pre-load the watermark image before starting to generate the PDF
    if (watermark) {
      const img = new Image();
      img.src = watermark.src;
      img.onload = function () {
        // Once the image is loaded, proceed with PDF generation
        generatePDF(img);
      };
    } else {
      // If no watermark, proceed directly
      generatePDF(null);
    }

    function generatePDF(watermarkImg: CanvasImageSource | null) {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "grid",
        styles: {
          overflow: "linebreak",
          fontSize: 10,
          cellPadding: 3,
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 35 },
          3: { cellWidth: 25, halign: "center" },
          4: { cellWidth: 30 },
          5: { cellWidth: 35, halign: "center" },
        },
        margin: { left: 10, right: 10 },
        tableWidth: "auto",
        didParseCell: function (data) {
          if (data.column.index === 5) {
            const status = data.cell.raw;
            switch (status) {
              case "Completed":
                data.cell.styles.textColor = [0, 128, 0];
                break;
              case "Processing":
                data.cell.styles.textColor = [62, 84, 200];
                break;
              case "Incomplete":
                data.cell.styles.textColor = [255, 165, 0];
                break;
              case "Pending":
                data.cell.styles.textColor = [255, 0, 0];
                break;
              default:
                data.cell.styles.textColor = [0, 0, 0];
                break;
            }
          }
        },
        didDrawPage: function (data) {
          // This function runs for each page
          if (watermarkImg) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const imgWidth = 100;
            const imgHeight = 100;
            const xPos = (pageWidth - imgWidth) / 2;
            const yPos = (pageHeight - imgHeight) / 2;

            console.log(`Adding watermark to page ${doc.getNumberOfPages()}`);

            // Create the lightened version of the image
            const canvas = document.createElement("canvas");
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.globalAlpha = 0.2;
              ctx.drawImage(watermarkImg, 0, 0, imgWidth, imgHeight);
              const lightenedImg = canvas.toDataURL("image/png");

              // Add the watermark to the current page
              doc.addImage(
                lightenedImg,
                "PNG",
                xPos,
                yPos,
                imgWidth,
                imgHeight,
                `watermark_${doc.getNumberOfPages()}`, // Unique identifier for each page
                "FAST"
              );
            }
          }
        },
      });

      // Save the PDF after all pages have been generated
      doc.save("store_orders.pdf");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown-container")) {
        setIsDropdownOpen(false);
        setIsPriceDropdownOpen(false);
      }
      if (!(event.target as HTMLElement).closest(".action-menu-container")) {
        setOpenActionMenuId(null);
      }
      if (
        isCustomizeOpen &&
        !(event.target as HTMLElement).closest(".status-dropdown-container")
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isCustomizeOpen]);

  const sortByDate = () => {
    setOrders(
      [...orders].sort((a, b) => {
        // Parse dates for both orders
        const dateA = parseOrderDate(a.date);
        const dateB = parseOrderDate(b.date);

        // Handle cases where parsing fails (null values)
        if (!dateA && !dateB) return 0; // Both dates are invalid, treat as equal
        if (!dateA) return 1; // Move invalid dateA to the end
        if (!dateB) return -1; // Move invalid dateB to the end

        // Compare valid dates
        return dateA.getTime() - dateB.getTime();
      })
    );
    setIsDropdownOpen(false);
  };

  const sortByProduct = () => {
    setOrders([...orders].sort((a, b) => a.product.localeCompare(b.product)));
    setIsDropdownOpen(false);
  };

  const sortByPriceLowToHigh = () => {
    setOrders(
      [...orders].sort(
        (a, b) =>
          parseFloat(a.price.replace("₹ ", "").replace(",", "")) -
          parseFloat(b.price.replace("₹ ", "").replace(",", ""))
      )
    );
    setIsDropdownOpen(false);
    setIsPriceDropdownOpen(false);
  };

  const sortByPriceHighToLow = () => {
    setOrders(
      [...orders].sort(
        (a, b) =>
          parseFloat(b.price.replace("₹ ", "").replace(",", "")) -
          parseFloat(a.price.replace("₹ ", "").replace(",", ""))
      )
    );
    setIsDropdownOpen(false);
    setIsPriceDropdownOpen(false);
  };

  // Handle status change
  const handleStatusChange = (
    orderId: string,
    value: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setOrderStatuses((prev) => ({ ...prev, [orderId]: value }));
    setSelectedOrderId(orderId);
    setOpenDropdownId(null);
  };

  // Handle save button
  const handleSave = () => {
    setIsCustomizeOpen(false);
    setOpenDropdownId(null);

    const hasChanges = orders.some(
      (order) => orderStatuses[order.id] !== order.status
    );
    if (hasChanges) {
      setIsConfirmOpen(true);
    } else {
      toast("No Changes", {
        description: "No status changes were made.",
        duration: 3000,
      });
    }
  };

  // Handle confirmation
  const handleConfirm = () => {
    const updatedOrders = orders.map((order) => ({
      ...order,
      status: orderStatuses[order.id] || order.status,
    }));
    setOrders(updatedOrders);
    setOriginalOrders(updatedOrders);
    setIsConfirmOpen(false);
    toast("Status Updated", {
      description: "Order statuses have been updated successfully",
      duration: 3000,
    });
  };

  // Custom dialog component
  const CustomDialog = () => {
    // Store scroll position in a ref
    const scrollPositionRef = useRef(0);

    if (!isCustomizeOpen) return null;

    // Function to save scroll position before status update
    const saveScrollPosition = () => {
      if (scrollContainerRef.current) {
        scrollPositionRef.current = scrollContainerRef.current.scrollTop;
      }
    };

    // Function to restore scroll position after state update
    const restoreScrollPosition = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    };

    // Modified status change handler
    const handleStatusChangeWithScroll = (orderId, status, e) => {
      // Save current scroll position before state change
      saveScrollPosition();

      // Call original handler
      handleStatusChange(orderId, status, e);

      // Restore scroll position after React updates the component
      setTimeout(restoreScrollPosition, 0);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black opacity-70"
          onClick={() => setIsCustomizeOpen(false)}
        />
        <div className="relative z-50 w-full max-w-[95%] sm:max-w-md max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden mx-2">
          <div className="p-3 sm:p-6 custom-dialog-content">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Customize Order Statuses
              </h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Update the status for any order by selecting from the dropdown
              </p>
            </div>
            <div className="py-2 sm:py-4">
              <div
                ref={scrollContainerRef}
                className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1"
                onScroll={(e) => {
                  scrollPositionRef.current = e.currentTarget.scrollTop;
                }}
              >
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 py-2 border-b relative"
                  >
                    <label className="font-medium sm:text-right text-sm sm:text-base">
                      {order.id}:
                    </label>
                    <div className="col-span-1 sm:col-span-3 relative">
                      <div className="status-dropdown-container">
                        <button
                          type="button"
                          className={`flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${getStatusColor(
                            orderStatuses[order.id] || order.status
                          )}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            saveScrollPosition();
                            setOpenDropdownId(
                              openDropdownId === order.id ? null : order.id
                            );
                            setTimeout(restoreScrollPosition, 0);
                          }}
                        >
                          <span>{orderStatuses[order.id] || order.status}</span>
                          <span className="ml-2">
                            {openDropdownId === order.id ? "▲" : "▼"}
                          </span>
                        </button>
                        {openDropdownId === order.id && (
                          <div
                            className="absolute left-0 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-50"
                            style={{
                              top: "100%",
                              maxHeight: "144px",
                              overflowY: "auto",
                            }}
                          >
                            <ul className="py-1">
                              {statusOptions.map((status) => (
                                <li
                                  key={status}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm ${getStatusColor(
                                    status
                                  )}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChangeWithScroll(
                                      order.id,
                                      status,
                                      e
                                    );
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  {status}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-end space-x-2">
              <Button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-6 font-semibold relative">
      {/* Sort Button */}
      <div className="relative dropdown-container inline-block">
        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          variant="outline"
          className="mb-4 border-[#8F8C8C] px-4 sm:px-10 text-base sm:text-xl py-2 sm:py-5 rounded-xl border-2 font-medium"
        >
          Sort
        </Button>
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-md w-40 sm:w-48 z-50">
            <button
              onClick={sortByDate}
              className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Sort by Date
            </button>
            <div className="relative">
              <button
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Sort by Price ▸
              </button>
              {isPriceDropdownOpen && (
                <div className="absolute left-0 sm:left-full top-full sm:top-0 mt-1 sm:mt-0 sm:ml-2 bg-white border border-gray-300 shadow-lg rounded-md w-40 sm:w-48 z-50">
                  <button
                    onClick={sortByPriceLowToHigh}
                    className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    Low to High
                  </button>
                  <button
                    onClick={sortByPriceHighToLow}
                    className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    High to Low
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={sortByProduct}
              className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Sort by Product
            </button>
          </div>
        )}
      </div>

      {/* Active Filter Indicator */}
      {activeFilter && (
        <div className="inline-flex items-center ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
          <span>{activeFilter}</span>
          <button
            onClick={resetFilters}
            className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Orders Table */}
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl">Latest Orders</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-[#f7f7f7] border-transparent hover:underline text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
                onClick={() => setIsCustomizeOpen(true)}
              >
                Customize
              </Button>
              <Button
                variant="ghost"
                className="hover:underline text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
                onClick={exportToPDF}
              >
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[640px] px-2 sm:px-0 sm:min-w-full">
              <Table className="w-full border border-gray-300 rounded-lg shadow-md">
                <TableHeader className="bg-gray-100 text-gray-900">
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm text-gray-900">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">
                      Product
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">
                      Order Date
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">Price</TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">
                      Payment
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm text-gray-900">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow
                      key={`${order.id}-${index}`}
                      className="border-t hover:bg-gray-100 transition"
                    >
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {order.product}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {order.date}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {order.price}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                        {order.payment}
                      </TableCell>
                      <TableCell
                        className={`font-semibold text-xs sm:text-sm py-2 sm:py-4 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <div className="relative action-menu-container">
                          <button
                            className="font-bold text-gray-700 hover:text-gray-900"
                            onClick={(e) => setOpenActionMenuId(order.id)}
                          >
                            ...
                          </button>
                          {openActionMenuId === order.id && (
                            <div
                              className="rounded-md border border-gray-200 bg-white shadow-lg"
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: "0",
                                width: "160px",
                                zIndex: 100,
                              }}
                            >
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-xs sm:text-sm"
                                  onClick={() => filterByDateRange(3)}
                                >
                                  Order by last 3 months
                                </button>
                                <button
                                  className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-xs sm:text-sm"
                                  onClick={() => filterByDateRange(6)}
                                >
                                  Order by last 6 months
                                </button>
                                <button
                                  className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-xs sm:text-sm"
                                  onClick={() => filterByDateRange(12)}
                                >
                                  Order by last 12 months
                                </button>
                                {activeFilter && (
                                  <button
                                    className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-blue-600 text-xs sm:text-sm"
                                    onClick={resetFilters}
                                  >
                                    Show all orders
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Dialog */}
      <CustomDialog />

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-white mx-4 w-[95%] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              You are about to update order statuses. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-2 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4"
            >
              Yes, update it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
};

export default OrderTable;