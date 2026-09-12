import Joi from 'joi';
import { objectId } from './custom.validation.js';

export const createOrder = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
        }),
      )
      .min(1)
      .required(),
    customerName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).allow(''),
    addressSummary: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    paymentMethod: Joi.string().valid('cod', 'store_pickup', 'bank_transfer', 'jazzcash', 'easypaisa'),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(
        'pending',
        'prescription_review',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'dispatched',
        'delivered',
        'cancelled',
      ),
      paymentStatus: Joi.string().valid('pending', 'awaiting_proof', 'paid', 'failed', 'refunded'),
      adminNotes: Joi.string().allow(''),
      deliveryFee: Joi.number().min(0),
      discount: Joi.number().min(0),
    })
    .min(1),
};

export const trackOrder = {
  query: Joi.object().keys({
    ref: Joi.string().required(),
    token: Joi.string(),
  }),
};

export const submitPrescription = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).allow(''),
    notes: Joi.string().allow(''),
    fileName: Joi.string().allow(''),
  }),
};

export const updatePrescription = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid(
        'received',
        'under_review',
        'needs_clarification',
        'approved',
        'unavailable',
        'ready_for_order',
        'completed',
      ),
      pharmacistNotes: Joi.string().allow(''),
    })
    .min(1),
};

export const contact = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).allow(''),
    phone: Joi.string().allow(''),
    subject: Joi.string().allow(''),
    message: Joi.string().required(),
  }),
};

export const newsletter = {
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
  }),
};

export const updateInquiry = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object().keys({
    status: Joi.string().valid('new', 'read', 'replied', 'closed'),
  }),
};

export const orderValidation = {
  createOrder,
  updateOrder,
  trackOrder,
  submitPrescription,
  updatePrescription,
  contact,
  newsletter,
  updateInquiry,
};
