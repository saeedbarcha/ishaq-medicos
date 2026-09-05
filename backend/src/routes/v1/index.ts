import { Router } from 'express';
import adminRoute from './admin.route.js';
import publicRoute from './public.route.js';

const router = Router();

const defaultRoutes = [
  { path: '/admin', route: adminRoute },
  { path: '/', route: publicRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
