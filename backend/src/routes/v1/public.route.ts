import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import { optionalAuth } from '../../middlewares/admin.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';
import { authValidation, productValidation, orderValidation } from '../../validations/index.js';
import { storeController } from '../../controllers/public/index.js';

const router = Router();

router.get('/products', validate(productValidation.productQuery), storeController.listProducts);
router.get('/products/:slug', validate(authValidation.slugParam), storeController.getProduct);
router.get('/categories', storeController.listCategories);
router.get('/categories/:slug', validate(authValidation.slugParam), storeController.getCategory);
router.get('/brands', storeController.listBrands);
router.get('/brands/:slug', validate(authValidation.slugParam), storeController.getBrand);
router.get('/search', storeController.search);
router.get('/search/suggestions', storeController.suggestions);
router.get('/store', storeController.getStore);
router.get('/banners', storeController.listBanners);
router.get('/deals', storeController.listDeals);
router.get('/delivery-zones', storeController.listZones);
router.get('/faqs', storeController.listFaqs);
router.get('/blog', storeController.listBlog);
router.get('/blog/:slug', validate(authValidation.slugParam), storeController.getBlog);
router.get('/reviews', storeController.listReviews);
router.get('/team', storeController.listTeam);

router.post('/prescriptions', validate(orderValidation.submitPrescription), storeController.submitPrescription);
router.post('/contact', validate(orderValidation.contact), storeController.submitContact);
router.post('/newsletter', validate(orderValidation.newsletter), storeController.submitNewsletter);
router.post('/orders', optionalAuth, validate(orderValidation.createOrder), storeController.createOrder);
router.get('/orders', optionalAuth, storeController.listMyOrders);
router.get('/orders/track', validate(orderValidation.trackOrder), storeController.trackOrder);

router.post('/auth/register', authLimiter, validate(authValidation.register), storeController.register);
router.post('/auth/login', authLimiter, validate(authValidation.login), storeController.login);
router.post('/auth/refresh-tokens', validate(authValidation.refreshTokens), storeController.refreshTokens);
router.post('/auth/logout', validate(authValidation.logout), storeController.logout);

export default router;
