# TechSphere

TechSphere is a full-stack e-commerce platform for consumer electronics built with Next.js, TypeScript, MongoDB, Mongoose, Tailwind CSS, and shadcn/ui.

The platform allows customers to browse products, search and filter the catalog, manage a persistent shopping cart, place orders, and track their purchases. It also includes a protected admin dashboard for product, inventory, customer, and order management.

## Live Demo

https://techsphere-mu.vercel.app/

## Features

### Customer Experience

- Responsive product catalog
- Product search
- Category filtering
- Product sorting by:
  - Newest
  - Name
  - Price low to high
  - Price high to low
- Dynamic product detail pages
- Product specifications
- Discount pricing
- Stock availability indicators
- Persistent shopping cart using localStorage
- Cart quantity management
- Secure user registration and login
- Protected checkout
- Cash on Delivery checkout
- Customer order history
- Individual order details
- Responsive mobile navigation
- Loading skeletons
- Success and error notifications
- Custom 404 and error pages
- About Us and contact sections

### Authentication & Security

- Custom authentication using JWT
- Password hashing using bcrypt
- HTTP-only authentication cookies
- Protected customer routes
- Protected administrator routes
- Role-based authorization
- Server-side admin role validation
- Safe redirect handling
- Generic login error responses

### Shopping Cart

- Add products to cart
- Remove products
- Update product quantities
- Stock-aware quantity limits
- Persistent cart storage
- Cart totals
- Clear cart confirmation
- Automatic cart clearing after successful checkout

### Checkout & Orders

- Shipping information collection
- Server-side order validation using Zod
- Server-calculated product prices
- Server-side stock verification
- MongoDB transactions
- Atomic inventory updates
- Duplicate cart item handling
- Order item snapshots
- Customer-specific order access
- Order status tracking

### Admin Dashboard

- Dashboard statistics
- Product management
- Create products
- Edit products
- Archive products
- Restore products through product editing
- Inventory management
- Order management
- Customer statistics
- Revenue statistics
- Order detail views
- Controlled order status transitions

Supported order workflow:

```text
Pending
  ├── Confirmed
  │     ├── Shipped
  │     │     └── Delivered
  │     └── Cancelled
  └── Cancelled
