import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { validateProductQuery, validatePriceCalculation } from '../validators/productValidators.js';

const router = Router();

// 1. List and Filter Products (Paginated, Searchable, Sorted)
router.get('/', validateProductQuery, productController.getProducts);

// 2. Distinct Filter Metadata & Bounds (Placed before /:id to prevent route collision)
router.get('/filters/meta', productController.getFilterMeta);

// 3. Resolve Single Product by URL Slug (Placed before /:id)
router.get('/slug/:slug', productController.getProductBySlug);

// 4. Resolve Single Product by Stable productId or MongoDB ObjectId
router.get('/:id', productController.getProductById);

// 5. Authoritative Server-Side Configured Price Calculation
router.post('/:productId/price', validatePriceCalculation, productController.calculatePrice);

export default router;
