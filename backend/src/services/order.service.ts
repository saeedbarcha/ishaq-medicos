import crypto from 'node:crypto';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { Prescription } from '../models/prescription.model.js';
import { Product } from '../models/product.model.js';
import { createCrudService } from '../helpers/crud.helper.js';
import ApiError from '../utils/ApiError.js';

const orders = createCrudService({ model: Order, resourceName: 'Order' });
const prescriptions = createCrudService({ model: Prescription, resourceName: 'Prescription' });

function orderRef() {
  const y = new Date().getFullYear();
  const n = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `IM-${y}-${n}`;
}

async function findCheckoutProduct(productId: string) {
  const clauses: Record<string, unknown>[] = [{ slug: productId }, { sku: productId }, { catalogId: productId }];
  if (mongoose.isValidObjectId(productId)) clauses.push({ _id: productId });
  return Product.findOne({ $or: clauses, active: true });
}

export const orderService = {
  ...orders,
  createFromCheckout: async (body: {
    items: Array<{ productId: string; quantity: number }>;
    customerName: string;
    phone: string;
    email?: string;
    addressSummary?: string;
    notes?: string;
    paymentMethod?: string;
    userId?: string;
  }) => {
    if (!body.items?.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
    }
    const lines = await Promise.all(body.items.map(async (line) => {
      const product = await findCheckoutProduct(line.productId);
      if (!product || !product.active) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'One or more products are unavailable');
      }
      return {
        productId: String((product as { catalogId?: string }).catalogId || product.id),
        name: product.name,
        slug: product.slug,
        packSize: product.packSize,
        quantity: line.quantity,
        unitPrice: product.salePrice ?? product.price,
        prescriptionRequired: product.prescriptionRequired,
      };
    }));
    const subtotal = lines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const needsRx = lines.some((item) => item.prescriptionRequired);
    const accessToken = crypto.randomBytes(24).toString('hex');
    const order = await Order.create({
      publicRef: orderRef(),
      accessToken,
      status: needsRx ? 'prescription_review' : 'pending',
      items: lines,
      subtotal,
      discount: 0,
      deliveryFee: 0,
      total: subtotal,
      paymentMethod: body.paymentMethod ?? 'cod',
      paymentStatus: 'pending',
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      addressSummary: body.addressSummary ?? '',
      notes: body.notes,
      userId: body.userId,
    });
    return { ...order.toJSON(), accessToken };
  },
  listForUser: async (userId: string) => {
    return Order.find({ userId }).sort({ createdAt: -1 }).limit(50);
  },
  getByPublicRef: async (publicRef: string, accessToken?: string) => {
    const order = await Order.findOne({ publicRef });
    if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    if (accessToken && order.accessToken !== accessToken) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid tracking token');
    }
    return order;
  },
};

export const prescriptionService = {
  ...prescriptions,
  submit: async (body: Record<string, unknown>) => {
    return Prescription.create({
      name: String(body.name ?? ''),
      phone: String(body.phone ?? ''),
      email: body.email ? String(body.email) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      fileName: body.fileName ? String(body.fileName) : undefined,
      filePath: body.filePath ? String(body.filePath) : undefined,
      status: 'received',
      isDemo: false,
    });
  },
};
