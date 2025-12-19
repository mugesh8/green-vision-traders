import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getOrderById, getDraftById } from '../../../api/orderApi';

const OrderView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDraft, setIsDraft] = useState(false);

    // Group packing types and calculate totals
    const getPackingSummary = (data) => {
        if (!data.items) return { groups: [], totalPcs: 0, totalGrossWeight: 0 };

        const groupsMap = {};

        let totalGross = 0;
        let totalPcs = 0;

        data.items.forEach((item) => {
            let type = item.packing_type || "Unknown";
            let count = parseInt(item.num_boxes) || 0;

            // Add to gross weight
            totalGross += parseFloat(item.gross_weight) || 0;

            // Count packing pcs
            totalPcs += count;

            // Grouping
            if (!groupsMap[type]) {
                groupsMap[type] = 0;
            }
            groupsMap[type] += count;
        });

        const groups = Object.keys(groupsMap).map((key) => ({
            type: key,
            count: groupsMap[key],
        }));

        return {
            groups,
            totalPcs,
            totalGrossWeight: totalGross,
        };
    };


    useEffect(() => {
        // Check if we're viewing a draft based on the URL
        const isDraftView = location.pathname.includes('/drafts/');
        setIsDraft(isDraftView);

        const fetchOrderOrDraft = async () => {
            try {
                setLoading(true);
                let response;

                if (isDraftView) {
                    response = await getDraftById(id);
                } else {
                    response = await getOrderById(id);
                }

                if (response.success) {
                    setOrder(response.data);
                } else {
                    setError('Failed to fetch order details');
                }
            } catch (err) {
                setError('Error fetching order: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderOrDraft();
        }
    }, [id, location.pathname]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-xl">Loading {isDraft ? 'draft' : 'order'} details...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    // Show if no order found
    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-xl text-gray-500">{isDraft ? 'Draft' : 'Order'} not found</div>
            </div>
        );
    }

    // Format order/draft data for display
    const formatData = () => {
        if (isDraft) {
            // Format draft data
            return {
                id: order.did,
                customer_name: order.customer_name || 'N/A',
                customer_id: order.customer_id || 'N/A',
                phone_number: order.phone_number || 'N/A',
                order_status: 'Draft',
                priority: 'N/A',
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                delivery_address: order.delivery_address || 'N/A',
                needed_by_date: 'N/A',
                preferred_time: 'N/A',
                items: order.draft_data?.products?.map((product, index) => ({
                    product: product.productName || 'N/A',
                    num_boxes: product.numBoxes || 'N/A',
                    packing_type: product.packingType || 'N/A',
                    net_weight: product.netWeight || 'N/A',
                    gross_weight: product.grossWeight || 'N/A',
                    box_weight: product.boxWeight || 'N/A',
                    market_price: product.marketPrice || '0.00',
                    total_price: product.totalAmount || '0.00'
                })) || []
            };
        } else {
            // Order data is already in the correct format
            return order;
        }
    };

    const formattedData = formatData();
    const packingSummary = getPackingSummary(formattedData);

    // Calculate totals
    const calculateTotals = () => {
        if (!formattedData.items || formattedData.items.length === 0) return { totalNetWeight: 0, totalGrossWeight: 0, totalAmount: 0 };

        const totals = formattedData.items.reduce(
            (acc, item) => {
                acc.totalNetWeight += parseFloat(item.net_weight) || 0;
                acc.totalGrossWeight += parseFloat(item.gross_weight) || 0;
                acc.totalAmount += parseFloat(item.total_price) || 0;
                return acc;
            },
            { totalNetWeight: 0, totalGrossWeight: 0, totalAmount: 0 }
        );

        return totals;
    };

    const totals = calculateTotals();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (isDraft) {
                                    navigate('/orders?tab=drafts');
                                } else {
                                    navigate('/orders?tab=orders');
                                }
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        <h1 className="text-2xl font-bold text-gray-900">{isDraft ? 'Draft' : 'Order'} Details</h1>
                    </div>
                    <div className="flex gap-3">
                        {isDraft ? (
                            <button
                                onClick={() => navigate(`/orders/create?draftId=${order.did}`)}
                                className="px-6 py-2.5 border border-[#0D7C66] text-[#0D7C66] rounded-lg hover:bg-[#0D7C66] hover:text-white transition-colors duration-200 font-medium"
                            >
                                Edit Draft
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate(`/orders/create?orderId=${order.oid}`)}
                                className="px-6 py-2.5 border border-[#0D7C66] text-[#0D7C66] rounded-lg hover:bg-[#0D7C66] hover:text-white transition-colors duration-200 font-medium"
                            >
                                Edit Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                {isDraft ? 'Draft ID' : 'Order ID'}
                            </p>
                            <p className="font-semibold text-gray-900">
                                {isDraft ? formattedData.id : formattedData.oid}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                            <p className="font-semibold text-gray-900">{formattedData.customer_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Customer ID</p>
                            <p className="font-semibold text-gray-900">{formattedData.customer_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                            <p className="font-semibold text-gray-900">{formattedData.phone_number || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{isDraft ? 'Status' : 'Order Status'}</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                {formattedData.order_status}
                            </span>
                        </div>
                        {/* {!isDraft && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                                    <p className="font-semibold text-gray-900">{formattedData.priority}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Created At</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(formattedData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Updated At</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(formattedData.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </>
                        )} */}
                    </div>
                </div>

                {/* Delivery Details Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                            <p className="font-medium text-gray-900">{formattedData.delivery_address}</p   >
                        </div>
                        {/* {!isDraft && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Needed By Date</p>
                                    <p className="font-medium text-gray-900">
                                        {formattedData.needed_by_date !== 'N/A' ? new Date(formattedData.needed_by_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Preferred Time</p>
                                    <p className="font-medium text-gray-900">{formattedData.preferred_time}</p>
                                </div>
                            </>
                        )} */}
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Products</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        No of Boxes/Bags
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Type of Packing
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Box Weight (kg)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Net Weight (kg)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Gross Weight (kg)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Market Price (₹)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">
                                        Total Amount (₹)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {formattedData.items && formattedData.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{item.product}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{item.num_boxes}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.packing_type}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.box_weight}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.net_weight}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.gross_weight}</td>
                                        <td className="px-4 py-3 text-gray-700">₹{parseFloat(item.market_price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-gray-700">₹{parseFloat(item.total_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-300 bg-gray-50 font-semibold">
                                    <td className="px-4 py-3 text-gray-900">Total</td>
                                    <td className="px-4 py-3 text-gray-900"></td>
                                    <td className="px-4 py-3 text-gray-900"></td>
                                    <td className="px-4 py-3 text-gray-900"></td>
                                    <td className="px-4 py-3 text-gray-900">{totals.totalNetWeight.toFixed(2)} kg</td>
                                    <td className="px-4 py-3 text-gray-900">{totals.totalGrossWeight.toFixed(2)} kg</td>
                                    <td className="px-4 py-3 text-gray-900"></td>
                                    <td className="px-4 py-3 text-gray-900">₹{totals.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Packing Summary
                </h2>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB] w-1/2">
                    {/* Header Row - Brown Tape Gross Weight */}
                    <div className="bg-[#D4F4E8] px-6 py-4 flex justify-between items-center border-b-2 border-[#D0E0DB]">
                        <span className="text-sm font-semibold text-[#0D5C4D]">Brown Tape Gross Weight</span>
                        <span className="text-sm font-semibold text-[#0D5C4D]">{packingSummary.totalGrossWeight} Kg</span>
                    </div>

                    {/* Data Rows */}
                    <table className="w-full">
                        <tbody>
                            {packingSummary.groups.map((g, idx) => (
                                <tr key={idx} className={`border-b border-[#D0E0DB] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                                    <td className="px-6 py-4 text-sm text-[#0D5C4D]">
                                        {g.type}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#0D5C4D] text-right">
                                        {g.count}
                                    </td>
                                </tr>
                            ))}

                            {/* TOTAL */}
                            <tr className="bg-[#D4F4E8]">
                                <td className="px-6 py-4 text-sm font-semibold text-[#0D5C4D]">Total No. of Pcs</td>
                                <td className="px-6 py-4 text-sm font-semibold text-[#0D5C4D] text-right">{packingSummary.totalPcs}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderView;