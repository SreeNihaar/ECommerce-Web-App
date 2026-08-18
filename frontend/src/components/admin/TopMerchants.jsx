import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const TopMerchants = ({topMerchants,loadingMerchants,count,setCount}) =>{

    return(
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">★</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Top Merchants
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Highest revenue generating merchants
                        </p>
                    </div>
                </div>

                <select
                    value={count}
                    onChange={(e) =>setCount(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                </select>
            </div>

            {/* Top Merchant Chart */}

            {loadingMerchants ? (
                <div className="h-112.5 flex items-center justify-center text-gray-500">
                    Loading top merchants...
                </div>
            ) : topMerchants.length === 0 ? (
                <div className="h-112.5 flex items-center justify-center text-gray-500">
                    No merchant data available.
                </div>
            ) : (
                <div className="w-full h-112.5">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topMerchants}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false}/>
                            <XAxis
                                type="number"
                                tick={{
                                    fill: "#6b7280"
                                }}
                                axisLine={{
                                    stroke: "#d1d5db"
                                }}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="merchantName"
                                width={170}
                                tick={{
                                    fontSize: 12,
                                    fill: "#4b5563"
                                }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{
                                    fill: "#f5f3ff"
                                }}
                                formatter={(value) => [
                                    `₹${Number(value).toLocaleString("en-IN")}`,
                                    "Revenue"
                                ]}
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid #ddd6fe",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.08)"
                                }}
                            />
                            <Bar
                                dataKey="totalRevenue"
                                name="Revenue"
                                fill="#8b5cf6"
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            {/* Merchant List */}

            {!loadingMerchants &&
                topMerchants.length > 0 && (
                    <div className="mt-8 space-y-3">
                        {topMerchants.map(
                            (merchant, index) => (
                                <div
                                    key={merchant.merchantId}
                                    className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition">
                                    {/* Rank */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0
                                            ${
                                                index === 0
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : index === 1
                                                    ? "bg-gray-200 text-gray-600"
                                                    : index === 2
                                                    ? "bg-orange-100 text-orange-600"
                                                    : "bg-purple-100 text-purple-600"
                                            }
                                        `}
                                    >
                                        {index + 1}
                                    </div>
                                    {/* Merchant */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">
                                            {merchant.merchantName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Merchant ID:{" "}
                                            {merchant.merchantId}
                                        </p>
                                    </div>

                                    {/* Revenue */}
                                    <div className="text-right">
                                        <p className="font-bold text-purple-600">
                                            ₹{Number(merchant.totalRevenue).toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {merchant.orderCount} orders
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
        </div>
    );
}

export default TopMerchants;