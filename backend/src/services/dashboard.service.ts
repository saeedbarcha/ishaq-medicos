import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { Prescription } from '../models/prescription.model.js';
import { InventoryBatch } from '../models/inventoryBatch.model.js';
import { User } from '../models/user.model.js';
import { Inquiry } from '../models/content.model.js';

const TZ = 'Asia/Karachi';

function startOfDay(offset = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

function pctChange(current: number, previous: number) {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

function labelForDay(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export async function getAdminMetrics() {
  const today = startOfDay(0);
  const tomorrow = startOfDay(1);
  const days7 = startOfDay(-6);
  const days14 = startOfDay(-13);
  const prev7 = startOfDay(-13);
  const prev7End = startOfDay(-6);
  const days30 = startOfDay(-29);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const in90Days = new Date();
  in90Days.setDate(in90Days.getDate() + 90);
  const notCancelled = { status: { $nin: ['cancelled'] } };

  const [
    todaysOrders,
    salesTodayAgg,
    orders7,
    sales7Agg,
    ordersPrev7,
    salesPrev7Agg,
    orders30,
    sales30Agg,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalOrders,
    prescriptionReviews,
    lowStock,
    outOfStock,
    nearExpiry,
    recentCustomers,
    totalCustomers,
    newInquiries,
    catalogActive,
    catalogTotal,
    daily,
    byStatus,
    byKind,
    byPayment,
    popular,
    recentOrderDocs,
    lowStockDocs,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today }, ...notCancelled }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow }, ...notCancelled } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: days7 }, ...notCancelled }),
    Order.aggregate([
      { $match: { createdAt: { $gte: days7 }, ...notCancelled } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: prev7, $lt: prev7End }, ...notCancelled }),
    Order.aggregate([
      { $match: { createdAt: { $gte: prev7, $lt: prev7End }, ...notCancelled } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: days30 }, ...notCancelled }),
    Order.aggregate([
      { $match: { createdAt: { $gte: days30 }, ...notCancelled } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: { $in: ['pending', 'prescription_review', 'confirmed'] } }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'cancelled' }),
    Order.countDocuments({}),
    Prescription.countDocuments({ status: { $in: ['received', 'under_review', 'needs_clarification'] } }),
    Product.countDocuments({ active: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] }, stock: { $gt: 0 } }),
    Product.countDocuments({ active: true, stock: { $lte: 0 } }),
    InventoryBatch.countDocuments({
      active: true,
      expiryDate: { $gte: new Date(), $lte: in90Days },
    }),
    User.countDocuments({ role: 'customer', createdAt: { $gte: weekAgo } }),
    User.countDocuments({ role: 'customer' }),
    Inquiry.countDocuments({ status: 'new' }),
    Product.countDocuments({ active: true }),
    Product.countDocuments({}),
    Order.aggregate([
      { $match: { createdAt: { $gte: days14 }, ...notCancelled } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
          orders: { $sum: 1 },
          sales: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Product.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$kind', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Order.aggregate([
      { $match: notCancelled },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, sales: { $sum: '$total' } } },
      { $sort: { count: -1 } },
    ]),
    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          qty: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', { $ifNull: ['$items.unitPrice', 0] }] } },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 6 },
    ]),
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select('publicRef status total customerName createdAt paymentMethod')
      .lean(),
    Product.find({ active: true, $expr: { $lte: ['$stock', { $ifNull: ['$lowStockThreshold', 5] }] } })
      .select('name sku stock lowStockThreshold kind')
      .sort({ stock: 1 })
      .limit(6)
      .lean(),
  ]);

  const dailyMap = Object.fromEntries(
    (daily as Array<{ _id: string; orders: number; sales: number }>).map((row) => [row._id, row]),
  );
  const series = Array.from({ length: 14 }, (_, index) => {
    const date = startOfDay(index - 13);
    const key = date.toLocaleDateString('en-CA', { timeZone: TZ });
    const row = dailyMap[key];
    return {
      date: key,
      label: labelForDay(key),
      orders: row?.orders ?? 0,
      sales: row?.sales ?? 0,
    };
  });

  const salesToday = salesTodayAgg[0]?.total ?? 0;
  const sales7d = sales7Agg[0]?.total ?? 0;
  const salesPrev7d = salesPrev7Agg[0]?.total ?? 0;
  const sales30d = sales30Agg[0]?.total ?? 0;

  return {
    todaysOrders,
    salesToday,
    orders7d: orders7,
    sales7d,
    ordersPrev7d: ordersPrev7,
    salesPrev7d,
    orders30d: orders30,
    sales30d,
    ordersChange: pctChange(orders7, ordersPrev7),
    salesChange: pctChange(sales7d, salesPrev7d),
    avgOrderValue: orders30 ? Math.round(sales30d / orders30) : 0,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalOrders,
    prescriptionReviews,
    lowStock,
    outOfStock,
    nearExpiry,
    recentCustomers,
    totalCustomers,
    newInquiries,
    catalogActive,
    catalogTotal,
    series,
    ordersByStatus: (byStatus as Array<{ _id: string; count: number }>).map((row) => ({
      status: row._id || 'unknown',
      count: row.count,
    })),
    catalogByKind: (byKind as Array<{ _id: string; count: number }>).map((row) => ({
      kind: row._id || 'other',
      count: row.count,
    })),
    payments: (byPayment as Array<{ _id: string; count: number; sales: number }>).map((row) => ({
      method: row._id || 'cod',
      count: row.count,
      sales: row.sales,
    })),
    popularProducts: (popular as Array<{ _id: string; qty: number; revenue: number }>).map((row) => ({
      name: row._id || 'Unknown',
      qty: row.qty,
      revenue: row.revenue,
    })),
    recentOrders: recentOrderDocs.map((order) => ({
      id: String((order as { _id?: unknown })._id ?? ''),
      publicRef: order.publicRef,
      status: order.status,
      total: order.total,
      customerName: order.customerName,
      paymentMethod: order.paymentMethod,
      createdAt: (order as { createdAt?: Date }).createdAt,
    })),
    attention: lowStockDocs.map((product) => ({
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      kind: product.kind,
    })),
    popularProductIds: popular.map((row: { _id: string }) => row._id),
  };
}

export default { getAdminMetrics };
