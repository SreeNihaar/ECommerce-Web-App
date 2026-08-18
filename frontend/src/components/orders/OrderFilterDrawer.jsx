import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faFilter,
    faMoneyBill,
    faReceipt,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

const OrderFilterDrawer = ({
    open,
    onClose,
    filters,
    setFilters,
    onApply
}) => {

    const updateField = (field, value) => {

        setFilters(prev => ({
            ...prev,
            [field]: value
        }));

    };

    const resetFilters = () => {

        setFilters({
            fromDate: "",
            toDate: "",
            status: "",
            paymentStatus: "",
            minAmount: "",
            maxAmount: ""
        });

    };

    return (
        <>
            {/* Backdrop */}

            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40
                ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* Drawer */}

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-107.5 bg-white shadow-xl z-50
                transition-transform duration-300
                ${open ? "translate-x-0" : "translate-x-full"}`}
            >

                {/* Header */}

                <div className="flex justify-between items-center border-b p-5">

                    <div className="flex items-center gap-3">

                        <FontAwesomeIcon
                            icon={faFilter}
                            className="text-blue-600 text-lg"
                        />

                        <h2 className="text-2xl font-bold">
                            Filter Orders
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-gray-100 transition cursor-pointer"
                    >

                        <FontAwesomeIcon
                            icon={faXmark}
                            className="text-gray-600"
                        />

                    </button>

                </div>

                {/* Body */}

                <div className="overflow-y-auto h-[calc(100%-90px)] pb-28 p-5 space-y-8">

                    {/* Date */}

                    <div>

                        <div className="flex items-center gap-2 mb-3">

                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="text-blue-600"
                            />

                            <h3 className="font-semibold">
                                Date Range
                            </h3>

                        </div>

                        <div className="space-y-3">

                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => updateField("fromDate", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => updateField("toDate", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                        </div>

                    </div>

                    {/* Status */}

                    <div>

                        <div className="flex items-center gap-2 mb-3">

                            <FontAwesomeIcon
                                icon={faReceipt}
                                className="text-blue-600"
                            />

                            <h3 className="font-semibold">
                                Order Status
                            </h3>

                        </div>

                        <select
                            value={filters.status}
                            onChange={(e) => updateField("status", e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >

                            <option value="">All Orders</option>
                            <option value="PAYMENT_PENDING">Payment Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>

                        </select>

                    </div>

                    {/* Payment */}

                    <div>

                        <div className="flex items-center gap-2 mb-3">

                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="text-blue-600"
                            />

                            <h3 className="font-semibold">
                                Payment Status
                            </h3>

                        </div>

                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => updateField("paymentStatus", e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >

                            <option value="">All Payments</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILURE">Failure</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>

                        </select>

                    </div>

                    {/* Amount */}

                    <div>

                        <div className="flex items-center gap-2 mb-3">

                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="text-blue-600"
                            />

                            <h3 className="font-semibold">
                                Total Amount
                            </h3>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            <input
                                type="number"
                                placeholder="Minimum"
                                value={filters.minAmount}
                                onChange={(e) => updateField("minAmount", e.target.value)}
                                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            <input
                                type="number"
                                placeholder="Maximum"
                                value={filters.maxAmount}
                                onChange={(e) => updateField("maxAmount", e.target.value)}
                                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="absolute bottom-0 left-0 w-full border-t bg-white p-5">

                    <div className="flex gap-3">

                        <button
                            onClick={resetFilters}
                            className="flex-1 border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-100 transition cursor-pointer"
                        >
                            Reset
                        </button>

                        <button
                            onClick={onApply}
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition cursor-pointer"
                        >
                            Apply Filters
                        </button>

                    </div>

                </div>

            </div>

        </>
    );
};

export default OrderFilterDrawer;