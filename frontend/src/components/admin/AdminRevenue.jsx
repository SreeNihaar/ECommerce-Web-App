import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const AdminRevenue = ({revenueData,loadingRevenue,month,setMonth,year,setYear}) =>{
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-lg">₹</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Revenue Analytics
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Revenue and orders for the selected period
                        </p>
                    </div>
                </div>

                {/* Month / Year */}
                <div className="flex gap-2">
                    <select
                        value={month}
                        onChange={(e) =>setMonth(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>

                    <select
                        value={year}
                        onChange={(e) =>setYear(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>
                </div>

            </div>


            {/* Revenue Chart */}

            {loadingRevenue ? (
                <div className="h-87.5 flex items-center justify-center text-gray-500">
                    Loading revenue...
                </div>
            ) : revenueData.length === 0 ? (
                    <div className="h-87.5 flex items-center justify-center text-gray-500">
                        No revenue data available.
                    </div>
            ) : (
                <div className="w-full h-87.5">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={revenueData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                tick={{
                                    fontSize: 12,
                                    fill: "#6b7280"
                                }}
                                axisLine={{
                                    stroke: "#d1d5db"
                                }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{
                                    fontSize: 12,
                                    fill: "#6b7280"
                                }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{
                                    fill: "#f0fdfa"
                                }}
                                formatter={(value) => [
                                    `₹${Number(value).toLocaleString("en-IN")}`,
                                    "Revenue"
                                ]}
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid #99f6e4",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                                }}
                            />
                            <Bar
                                dataKey="totalRevenue"
                                name="Revenue"
                                fill="#14b8a6"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}


            {/* Revenue Table */}

            {!loadingRevenue &&
                revenueData.length > 0 && (
                    <div className="overflow-x-auto mt-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-500">
                                    <th className="pb-4 font-medium">
                                        Period
                                    </th>
                                    <th className="pb-4 font-medium text-right">
                                        Revenue
                                    </th>
                                    <th className="pb-4 font-medium text-right">
                                        Orders
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {revenueData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b last:border-b-0 border-gray-100">
                                        <td className="py-4 font-medium text-gray-800">
                                            {item.label}
                                        </td>

                                        <td className="py-4 text-right font-semibold text-teal-600">
                                            ₹{Number(item.totalRevenue).toLocaleString("en-IN")}
                                        </td>
                                        <td className="py-4 text-right text-gray-700">
                                            {item.orderCount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
}

export default AdminRevenue;