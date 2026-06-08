import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const bookingStatuses = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
];

const paymentStatuses = ["unpaid", "pending", "paid", "failed", "refunded"];

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fromDate, setFromDate] = useState(""); // ✅ NEW
  const [toDate, setToDate] = useState("");     // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.get("/bookings/admin/all");

      setBookings(data.bookings || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName?.toLowerCase().includes(value) ||
        booking.customerEmail?.toLowerCase().includes(value) ||
        booking.customerPhone?.toLowerCase().includes(value) ||
        booking.serviceTitle?.toLowerCase().includes(value) ||
        booking.serviceCategoryTitle?.toLowerCase().includes(value) ||
        booking.transactionId?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || booking.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, searchText, statusFilter, paymentFilter]);

  const handleStatusChange = async (bookingId, status) => {
  const booking = bookings.find((b) => b._id === bookingId);

  if (
    booking?.status === "completed" ||
    booking?.status === "cancelled"
  ) {
    return;
  }

  try {
    await api.patch(`/bookings/${bookingId}/status`, {
      status,
      adminNote: `Booking status changed to ${status}`,
    });

    fetchBookings();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to update booking status");
  }
};

  const handlePaymentChange = async (bookingId, paymentStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/payment`, {
        paymentStatus,
        adminNote: `Payment status changed to ${paymentStatus}`,
      });

      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update payment status");
    }
  };

  const handleDownloadInvoice = async (booking) => {
    try {
      const response = await api.get(`/bookings/${booking._id}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `booking-invoice-${booking._id}.pdf`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 3000);
    } catch (error) {
      console.error("Invoice download error:", error);
    }
  };

  // ✅ UPDATED: now includes fromDate and toDate
  const handleDownloadReport = async () => {
    try {
      const query = new URLSearchParams();

      if (statusFilter !== "all") {
        query.append("status", statusFilter);
      }

      if (paymentFilter !== "all") {
        query.append("paymentStatus", paymentFilter);
      }

      if (fromDate) {
        query.append("fromDate", fromDate);
      }

      if (toDate) {
        query.append("toDate", toDate);
      }

      const queryString = query.toString();

      const response = await api.get(
        `/bookings/admin/reports/bookings${queryString ? `?${queryString}` : ""}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `booking-sales-report-${Date.now()}.pdf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(fileUrl), 3000);
    } catch (error) {
      console.error("Report download error:", error);
      
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-slate-700">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ UPDATED: header with date range pickers */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-emerald-600">Bookings</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            Manage Bookings
          </h1>
          <p className="mt-2 text-slate-600">
            View orders, update booking status and verify payments.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Download Report
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 font-semibold text-red-700">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1fr_220px_220px]">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search customer, service, phone or transaction ID..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="all">All Booking Status</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="all">All Payment Status</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <h3 className="text-2xl font-black text-slate-900">
            No booking found
          </h3>
          <p className="mt-2 text-slate-500">
            No booking matched your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900">
                      {booking.serviceTitle}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                      {booking.status}
                    </span>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold capitalize text-emerald-700">
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <span className="font-bold text-slate-900">
                        Customer:
                      </span>{" "}
                      {booking.customerName}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Email:</span>{" "}
                      {booking.customerEmail}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Phone:</span>{" "}
                      {booking.customerPhone}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Address:</span>{" "}
                      {booking.customerAddress}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Category:
                      </span>{" "}
                      {booking.serviceCategoryTitle}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Date & Time:
                      </span>{" "}
                      {booking.bookingDate}, {booking.bookingTime}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Quantity:
                      </span>{" "}
                      {booking.quantity}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Total:</span>{" "}
                      {booking.totalAmount} BDT
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Payment Method:
                      </span>{" "}
                      {booking.paymentMethod}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Transaction ID:
                      </span>{" "}
                      {booking.transactionId || "N/A"}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">
                        Payment Phone:
                      </span>{" "}
                      {booking.paymentPhone || "N/A"}
                    </p>

                    <p>
                      <span className="font-bold text-slate-900">Created:</span>{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>

                  {booking.note && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <span className="font-bold text-slate-900">
                        Customer Note:
                      </span>{" "}
                      {booking.note}
                    </div>
                  )}

                  {booking.adminNote && (
                    <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                      <span className="font-bold">Admin Note:</span>{" "}
                      {booking.adminNote}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Booking Status
                    </label>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
  
</label>

<select
  value={booking.status}
  disabled={
    booking.status === "completed" ||
    booking.status === "cancelled"
  }
  onChange={(event) =>
    handleStatusChange(booking._id, event.target.value)
  }
  className={`w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 ${
    booking.status === "completed" ||
    booking.status === "cancelled"
      ? "cursor-not-allowed bg-slate-100 text-slate-500"
      : ""
  }`}
>
  {bookingStatuses.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Payment Status
                    </label>
                    <select
                      value={booking.paymentStatus}
                      onChange={(event) =>
                        handlePaymentChange(booking._id, event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleDownloadInvoice(booking)}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;