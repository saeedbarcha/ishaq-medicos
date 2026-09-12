import productService from '../../services/product.service.js';
import { categoryService, brandService, manufacturerService, inventoryService } from '../../services/catalog.service.js';
import { catchAsync } from '../../utils/index.js';
import pick from '../../utils/pick.js';
import { paginationMeta, sendCreated, sendSuccess } from '../../helpers/response.helper.js';
import { recordAudit } from '../../helpers/audit.helper.js';
import { createAdminCrudController } from '../../helpers/crudController.helper.js';
import { param } from '../../helpers/params.helper.js';
import httpStatus from 'http-status';

export const listProducts = catchAsync(async (req, res) => {
  const filter = await productService.buildProductFilter(req.query as Record<string, unknown>);
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const result = await productService.queryProducts(filter, {
    page,
    limit,
    sortBy: (req.query.sortBy as string) || productService.productSort(req.query.sort as string),
  });
  sendSuccess(
    res,
    result.results,
    'Products retrieved',
    httpStatus.OK,
    paginationMeta(result.page, result.limit, result.totalResults, result.totalPages),
  );
});

export const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(param(req, 'id'));
  sendSuccess(res, product, 'Product retrieved');
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  await recordAudit(req, 'create', 'product', product.id);
  sendCreated(res, product, 'Product created');
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(param(req, 'id'), req.body);
  await recordAudit(req, 'update', 'product', param(req, 'id'));
  sendSuccess(res, product, 'Product updated');
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(param(req, 'id'));
  await recordAudit(req, 'delete', 'product', param(req, 'id'));
  sendSuccess(res, { id: param(req, 'id') }, 'Product deleted');
});

export const categories = createAdminCrudController(categoryService, 'Category', ['navGroup', 'featured', 'active', 'parentId']);
export const brands = createAdminCrudController(brandService, 'Brand', ['featured', 'active']);
export const manufacturers = createAdminCrudController(manufacturerService, 'Manufacturer', ['active']);

export const listInventory = catchAsync(async (req, res) => {
  const filter = pick(req.query as Record<string, unknown>, ['productId', 'active', 'batchNumber']);
  const result = await inventoryService.query(filter, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
    sortBy: (req.query.sortBy as string) || 'expiryDate:asc',
  });
  sendSuccess(
    res,
    result.results,
    'Inventory retrieved',
    httpStatus.OK,
    paginationMeta(result.page, result.limit, result.totalResults, result.totalPages),
  );
});

export const createInventory = catchAsync(async (req, res) => {
  const batch = await inventoryService.create(req.body);
  await inventoryService.recountProductStock(req.body.productId);
  await recordAudit(req, 'create', 'inventory', batch.id);
  sendCreated(res, batch, 'Inventory batch created');
});

export const updateInventory = catchAsync(async (req, res) => {
  const batch = await inventoryService.updateById(param(req, 'id'), req.body);
  await inventoryService.recountProductStock(String((batch as { productId: string }).productId));
  await recordAudit(req, 'update', 'inventory', param(req, 'id'));
  sendSuccess(res, batch, 'Inventory batch updated');
});

export const deleteInventory = catchAsync(async (req, res) => {
  const batch = await inventoryService.getById(param(req, 'id'));
  await inventoryService.deleteById(param(req, 'id'));
  await inventoryService.recountProductStock(String((batch as { productId: string }).productId));
  await recordAudit(req, 'delete', 'inventory', param(req, 'id'));
  sendSuccess(res, { id: param(req, 'id') }, 'Inventory batch deleted');
});

export const nearExpiry = catchAsync(async (_req, res) => {
  const batches = await inventoryService.nearExpiry();
  sendSuccess(res, batches, 'Near-expiry batches retrieved');
});
