import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const TopProduct = ({topProducts,loadingProducts,count,setCount}) =>{

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl border border-teal-200 shadow-lg p-5 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-teal-900">Top Products</h2>
                    <p className="text-sm text-teal-600 mt-1 font-medium">Your best-selling products</p>
                </div>
                {/* Count */}
                <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="border-2 border-teal-300 rounded-lg px-4 py-2 bg-white text-teal-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-teal-500 transition-colors"
                >
                    <option value={5}>
                        Top 5
                    </option>

                    <option value={10}>
                        Top 10
                    </option>

                    <option value={20}>
                        Top 20
                    </option>

                    <option value={50}>
                        Top 50
                    </option>
                </select>
            </div>

            {/* Top Products Chart */}
            {loadingProducts ? (
                <div className="h-100 flex items-center justify-center text-gray-500">
                    Loading top products...
                </div>
            ) : topProducts.length === 0 ? (
                <div className="h-100 flex items-center justify-center text-gray-500">
                    No product sales available.
                </div>
            ) : (
                <div className="w-full h-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topProducts}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="productName"
                                width={170}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="itemsSold"
                                name="Items Sold"
                                radius={[0, 6, 6, 0]}
                                fill="#a855f7"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Product List */}
            {!loadingProducts && topProducts.length > 0 && (
                <div className="mt-8 space-y-3">
                    {topProducts.map((product, index) => (
                        <div
                            key={product.productId}
                            className="flex items-center gap-4 rounded-lg border border-teal-200 bg-linear-to-r from-teal-50 to-transparent p-4 hover:bg-teal-50 hover:border-teal-400 transition cursor-pointer"
                            onClick={() => navigate(`/merchant/my_products/${product.productId}`)}
                        >
                            {/* Rank */}
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                                {index + 1}
                            </div>

                            {/* Product */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-teal-900 truncate">
                                    {product.productName}
                                </p>
                                <p className="text-sm text-teal-500 font-medium">
                                    ID: {product.productId}
                                </p>
                            </div>

                            {/* Items */}
                            <div className="text-right bg-linear-to-r from-teal-100 to-transparent px-4 py-2 rounded-lg">
                                <p className="font-bold text-teal-700 text-lg">
                                    {product.itemsSold}
                                </p>
                                <p className="text-xs text-teal-600 font-semibold">
                                    sold
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            )}

        </div>
    );
}

export default TopProduct;