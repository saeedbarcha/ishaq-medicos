import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import { admin } from '../../middlewares/admin.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';
import { authValidation, productValidation, orderValidation, contentValidation } from '../../validations/index.js';
import { authController, catalogController, opsController, contentController } from '../../controllers/admin/index.js';

const router = Router();

router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/logout', validate(authValidation.logout), authController.logout);

router.get('/me', admin('account:read'), authController.me);
router.get('/dashboard', admin('dashboard:read'), authController.dashboard);
router.get('/metrics', admin('dashboard:read'), authController.dashboard);

router
  .route('/users')
  .get(admin('user:read'), authController.users.list)
  .post(admin('user:write'), validate(authValidation.createUser), authController.users.create);

router
  .route('/users/:id')
  .get(admin('user:read'), validate(authValidation.idParam), authController.users.get)
  .patch(admin('user:update'), validate(authValidation.updateUser), authController.users.update)
  .delete(admin('user:write'), validate(authValidation.idParam), authController.users.remove);

router
  .route('/products')
  .get(admin('product:read'), validate(productValidation.productQuery), catalogController.listProducts)
  .post(admin('product:write'), validate(productValidation.createProduct), catalogController.createProduct);

router
  .route('/products/:id')
  .get(admin('product:read'), validate(authValidation.idParam), catalogController.getProduct)
  .patch(admin('product:update'), validate(productValidation.updateProduct), catalogController.updateProduct)
  .delete(admin('product:delete'), validate(authValidation.idParam), catalogController.deleteProduct);

router
  .route('/categories')
  .get(admin('category:read'), catalogController.categories.list)
  .post(admin('category:write'), validate(productValidation.createCategory), catalogController.categories.create);

router
  .route('/categories/:id')
  .get(admin('category:read'), validate(authValidation.idParam), catalogController.categories.get)
  .patch(admin('category:update'), validate(productValidation.updateCategory), catalogController.categories.update)
  .delete(admin('category:delete'), validate(authValidation.idParam), catalogController.categories.remove);

router
  .route('/brands')
  .get(admin('brand:read'), catalogController.brands.list)
  .post(admin('brand:write'), validate(productValidation.createBrand), catalogController.brands.create);

router
  .route('/brands/:id')
  .get(admin('brand:read'), validate(authValidation.idParam), catalogController.brands.get)
  .patch(admin('brand:update'), validate(productValidation.updateBrand), catalogController.brands.update)
  .delete(admin('brand:delete'), validate(authValidation.idParam), catalogController.brands.remove);

router
  .route('/manufacturers')
  .get(admin('brand:read'), catalogController.manufacturers.list)
  .post(admin('brand:write'), validate(productValidation.createManufacturer), catalogController.manufacturers.create);

router
  .route('/manufacturers/:id')
  .get(admin('brand:read'), validate(authValidation.idParam), catalogController.manufacturers.get)
  .patch(admin('brand:update'), validate(productValidation.updateManufacturer), catalogController.manufacturers.update)
  .delete(admin('brand:delete'), validate(authValidation.idParam), catalogController.manufacturers.remove);

router
  .route('/inventory')
  .get(admin('inventory:read'), catalogController.listInventory)
  .post(admin('inventory:write'), validate(productValidation.createInventory), catalogController.createInventory);

router.get('/inventory/near-expiry', admin('inventory:read'), catalogController.nearExpiry);

router
  .route('/inventory/:id')
  .patch(admin('inventory:update'), validate(productValidation.updateInventory), catalogController.updateInventory)
  .delete(admin('inventory:write'), validate(authValidation.idParam), catalogController.deleteInventory);

router.route('/orders').get(admin('order:read'), opsController.listOrders);
router
  .route('/orders/:id')
  .get(admin('order:read'), validate(authValidation.idParam), opsController.getOrder)
  .patch(admin('order:update'), validate(orderValidation.updateOrder), opsController.updateOrder);

router.route('/prescriptions').get(admin('prescription:read'), opsController.listPrescriptions);
router
  .route('/prescriptions/:id')
  .get(admin('prescription:read'), validate(authValidation.idParam), opsController.getPrescription)
  .patch(admin('prescription:update'), validate(orderValidation.updatePrescription), opsController.updatePrescription);

router.route('/inquiries').get(admin('inquiry:read'), opsController.listInquiries);
router
  .route('/inquiries/:id')
  .patch(admin('inquiry:update'), validate(orderValidation.updateInquiry), opsController.updateInquiry);

router.route('/newsletter').get(admin('inquiry:read'), opsController.listSubscribers);
router.route('/audit-logs').get(admin('audit:read'), opsController.listAuditLogs);

router
  .route('/banners')
  .get(admin('content:read'), contentController.banners.list)
  .post(admin('content:write'), validate(contentValidation.createBanner), contentController.banners.create);
router
  .route('/banners/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.banners.get)
  .patch(admin('content:update'), validate(contentValidation.updateBanner), contentController.banners.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.banners.remove);

router
  .route('/deals')
  .get(admin('content:read'), contentController.deals.list)
  .post(admin('content:write'), validate(contentValidation.createDeal), contentController.deals.create);
router
  .route('/deals/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.deals.get)
  .patch(admin('content:update'), validate(contentValidation.updateDeal), contentController.deals.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.deals.remove);

router
  .route('/faqs')
  .get(admin('content:read'), contentController.faqs.list)
  .post(admin('content:write'), validate(contentValidation.createFaq), contentController.faqs.create);
router
  .route('/faqs/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.faqs.get)
  .patch(admin('content:update'), validate(contentValidation.updateFaq), contentController.faqs.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.faqs.remove);

router
  .route('/blog')
  .get(admin('content:read'), contentController.blog.list)
  .post(admin('content:write'), validate(contentValidation.createBlog), contentController.blog.create);
router
  .route('/blog/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.blog.get)
  .patch(admin('content:update'), validate(contentValidation.updateBlog), contentController.blog.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.blog.remove);

router
  .route('/delivery-zones')
  .get(admin('content:read'), contentController.zones.list)
  .post(admin('content:write'), validate(contentValidation.createZone), contentController.zones.create);
router
  .route('/delivery-zones/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.zones.get)
  .patch(admin('content:update'), validate(contentValidation.updateZone), contentController.zones.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.zones.remove);

router
  .route('/reviews')
  .get(admin('content:read'), contentController.reviews.list)
  .post(admin('content:write'), validate(contentValidation.createReview), contentController.reviews.create);
router
  .route('/reviews/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.reviews.get)
  .patch(admin('content:update'), validate(contentValidation.updateReview), contentController.reviews.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.reviews.remove);

router
  .route('/coupons')
  .get(admin('content:read'), contentController.coupons.list)
  .post(admin('content:write'), validate(contentValidation.createCoupon), contentController.coupons.create);
router
  .route('/coupons/:id')
  .get(admin('content:read'), validate(authValidation.idParam), contentController.coupons.get)
  .patch(admin('content:update'), validate(contentValidation.updateCoupon), contentController.coupons.update)
  .delete(admin('content:delete'), validate(authValidation.idParam), contentController.coupons.remove);

router
  .route('/settings')
  .get(admin('settings:read'), contentController.getSettings)
  .patch(admin('settings:update'), validate(contentValidation.updateSettings), contentController.updateSettings);

export default router;
