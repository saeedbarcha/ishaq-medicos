import { lazy } from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { CategoryPage } from '@/pages/Shop/CategoryPage';
import { BrandDetailsPage, BrandsPage, DealsPage } from '@/pages/Shop/BrandsPage';
import { ProductDetailsPage } from '@/pages/ProductDetails/ProductDetailsPage';
import { SearchPage } from '@/pages/Search/SearchPage';
import { CartPage, WishlistPage } from '@/pages/Cart/CartPage';
import { CheckoutPage, CheckoutSuccessPage } from '@/pages/Checkout/CheckoutPage';
import { PrescriptionPage } from '@/pages/Prescription/PrescriptionPage';

const AccountAddresses = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountAddresses })));
const AccountHome = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountHome })));
const AccountLayout = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountLayout })));
const AccountOrders = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountOrders })));
const AccountPrescriptions = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountPrescriptions })));
const AccountProfile = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.AccountProfile })));
const LoginPage = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.LoginPage })));
const TrackOrderPage = lazy(() => import('@/pages/Account/AccountPages').then((m) => ({ default: m.TrackOrderPage })));
const AdminHome = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminHome })));
const AdminInventory = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminInventory })));
const AdminLayout = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminLayout })));
const AdminOrders = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminOrders })));
const AdminPrescriptions = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminPrescriptions })));
const AdminProducts = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminProducts })));
const AdminSettings = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminSettings })));
const AdminCategories = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminCategories })));
const AdminContent = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminContent })));
const AdminBlog = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminBlog })));
const AdminInquiries = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminInquiries })));
const AdminReviews = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminReviews })));
const AdminUsers = lazy(() => import('@/pages/Admin/AdminPages').then((m) => ({ default: m.AdminUsers })));
const AboutPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.ContactPage })));
const DeliveryPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.DeliveryPage })));
const FaqPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.FaqPage })));
const NotFoundPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.NotFoundPage })));
const RouteErrorPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.RouteErrorPage })));
const PrivacyPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.PrivacyPage })));
const ReturnsPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.ReturnsPage })));
const TermsPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.TermsPage })));
const TeamPage = lazy(() => import('@/pages/Info/InfoPages').then((m) => ({ default: m.TeamPage })));

function BrandRoute() {
  const { brandSlug = '' } = useParams();
  return <BrandDetailsPage slug={brandSlug} />;
}

function HealthNeedRoute() {
  const { need = '' } = useParams();
  return <CategoryPage healthNeed={need} />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'medicines', element: <CategoryPage forcedSlug="medicines" /> },
      { path: 'medicines/:sub', element: <CategoryPage /> },
      { path: 'otc', element: <CategoryPage forcedSlug="otc" /> },
      { path: 'surgical', element: <CategoryPage forcedSlug="surgical" /> },
      { path: 'surgical/:sub', element: <CategoryPage /> },
      { path: 'medical-equipment', element: <CategoryPage forcedSlug="medical-equipment" /> },
      { path: 'cosmetics', element: <CategoryPage forcedSlug="cosmetics" /> },
      { path: 'cosmetics/:sub', element: <CategoryPage /> },
      { path: 'skin-care', element: <CategoryPage forcedSlug="skin-care" /> },
      { path: 'personal-care', element: <CategoryPage forcedSlug="personal-care" /> },
      { path: 'mother-baby', element: <CategoryPage forcedSlug="mother-baby" /> },
      { path: 'vitamins-supplements', element: <CategoryPage forcedSlug="vitamins-supplements" /> },
      { path: 'health-needs/:need', element: <HealthNeedRoute /> },
      { path: 'brands', element: <BrandsPage /> },
      { path: 'brands/:brandSlug', element: <BrandRoute /> },
      { path: 'products/:slug', element: <ProductDetailsPage /> },
      { path: 'deals', element: <DealsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/success', element: <CheckoutSuccessPage /> },
      { path: 'prescription', element: <PrescriptionPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { index: true, element: <AccountHome /> },
          { path: 'orders', element: <AccountOrders /> },
          { path: 'prescriptions', element: <AccountPrescriptions /> },
          { path: 'addresses', element: <AccountAddresses /> },
          { path: 'profile', element: <AccountProfile /> },
        ],
      },
      { path: 'track-order', element: <TrackOrderPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'delivery', element: <DeliveryPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'returns', element: <ReturnsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'prescriptions', element: <AdminPrescriptions /> },
      { path: 'inventory', element: <AdminInventory /> },
      { path: 'content', element: <AdminContent /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'inquiries', element: <AdminInquiries /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
]);
