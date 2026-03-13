# Creating an Entity

This guide walks through creating a new entity in Viteplate, using the existing `user` entity as a reference. Entities represent domain concepts and provide types, schemas, data access, and optional UI.

---

## Table of Contents

- [What is an Entity?](#what-is-an-entity)
- [Entity Structure](#entity-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Real Example: user](#real-example-user)
- [Real Example: session](#real-example-session)
- [Checklist](#checklist)

---

## What is an Entity?

An entity represents a **domain concept** in your application -- something that has identity, types, and data access patterns. Entities encapsulate the "what" of your domain, while features encapsulate the "what you can do with it."

**Examples:** User, session, product, order, comment, notification.

**FSD Rules for Entities:**

- May only import from `shared/`
- May NOT import from other entities, features, widgets, pages, or app
- Must expose a public API through `index.ts`
- Entities at the same layer are **isolated** from each other

---

## Entity Structure

```
src/entities/
└── [entity-name]/
    ├── index.ts              # Public API barrel
    ├── model/                 # Types, stores, hooks
    │   ├── types.ts          # Domain type definitions
    │   ├── schema.ts         # Zod validation schema
    │   ├── store.ts          # Zustand store (if client state)
    │   └── use-[name].ts     # React hook for store access
    └── api/                   # Data access layer
        ├── dto.ts            # API response DTOs
        ├── endpoints.ts      # HTTP endpoint functions
        ├── mappers.ts        # DTO-to-domain mappers
        └── queries.ts        # TanStack Query options
```

### When to Use Each Segment

| Segment            | When                                                    | Example                   |
| ------------------ | ------------------------------------------------------- | ------------------------- |
| `model/types.ts`   | Always -- defines the domain type                       | `User`, `Product`         |
| `model/schema.ts`  | When you need runtime validation                        | Validating API responses  |
| `model/store.ts`   | When the entity has client-side state                   | Session store             |
| `model/use-*.ts`   | When React components need reactive access to the store | `useSession`              |
| `api/dto.ts`       | When API shapes differ from domain types                | `UserDto` vs `User`       |
| `api/endpoints.ts` | When the entity has CRUD operations                     | `fetchCurrentUser`        |
| `api/mappers.ts`   | When DTOs need transformation                           | `mapUserDtoToUser`        |
| `api/queries.ts`   | When using TanStack Query                               | `currentUserQueryOptions` |

---

## Step-by-Step Guide

### Step 1: Plan the Entity

| Question                                | Example (product)                                |
| --------------------------------------- | ------------------------------------------------ |
| What domain concept does it represent?  | A product in the catalog                         |
| What properties does it have?           | id, name, price, description, category, imageUrl |
| Does the API return a different shape?  | Yes -- API returns `snake_case` fields           |
| Does it need client-side state?         | No -- server-owned data                          |
| Will it be queried with TanStack Query? | Yes                                              |

### Step 2: Create the Directory

```bash
mkdir -p src/entities/[entity-name]/{model,api}
```

### Step 3: Define the Domain Type

```typescript
// src/entities/product/model/types.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string | null;
    createdAt: string;
}
```

### Step 4: Create the Validation Schema

```typescript
// src/entities/product/model/schema.ts
import { z } from 'zod';

export const productSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    description: z.string(),
    category: z.string(),
    imageUrl: z.string().url().nullable(),
    createdAt: z.string().datetime(),
});
```

### Step 5: Define DTOs

If the API returns a different shape than the domain type:

```typescript
// src/entities/product/api/dto.ts

/** Raw shape returned by the /products API. */
export interface ProductDto {
    id: string;
    name: string;
    price_cents: number;
    description: string;
    category: string;
    image_url: string | null;
    created_at: string;
}
```

### Step 6: Create Mappers

Transform API DTOs to domain types:

```typescript
// src/entities/product/api/mappers.ts
import type { Product } from '../model/types';
import type { ProductDto } from './dto';

export function mapProductDtoToProduct(dto: ProductDto): Product {
    return {
        id: dto.id,
        name: dto.name,
        price: dto.price_cents / 100,
        description: dto.description,
        category: dto.category,
        imageUrl: dto.image_url,
        createdAt: dto.created_at,
    };
}
```

### Step 7: Create Endpoints

```typescript
// src/entities/product/api/endpoints.ts
import { apiGet } from '@shared/api';
import { productSchema } from '../model/schema';
import { mapProductDtoToProduct } from './mappers';
import type { ProductDto } from './dto';
import type { Product } from '../model/types';

export async function fetchProducts(): Promise<Product[]> {
    const dtos = await apiGet<ProductDto[]>('/products', {
        schema: z.array(productDtoSchema),
    });
    return dtos.map(mapProductDtoToProduct);
}

export async function fetchProductById(id: string): Promise<Product> {
    const dto = await apiGet<ProductDto>(`/products/${id}`, {
        schema: productDtoSchema,
    });
    return mapProductDtoToProduct(dto);
}
```

### Step 8: Create Query Options

```typescript
// src/entities/product/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from './endpoints';

export const productsQueryOptions = queryOptions({
    queryKey: ['products'],
    queryFn: fetchProducts,
});

export function productQueryOptions(id: string) {
    return queryOptions({
        queryKey: ['products', id],
        queryFn: () => fetchProductById(id),
    });
}
```

### Step 9: Create the Public API

```typescript
// src/entities/product/index.ts
export { productsQueryOptions, productQueryOptions } from './api/queries';
export type { Product } from './model/types';
```

Note: DTOs, mappers, and endpoints are **not exported**. They are implementation details. Consumers access data through query options or hooks.

---

## Real Example: user

```
src/entities/user/
├── index.ts                # Exports: queries + User type
├── model/
│   ├── types.ts            # User interface (id, name, email, role)
│   └── schema.ts           # Zod userSchema for runtime validation
└── api/
    ├── dto.ts              # UserDto (raw API shape)
    ├── endpoints.ts        # fetchCurrentUser()
    ├── mappers.ts          # mapUserDtoToUser()
    └── queries.ts          # currentUserQueryOptions
```

### Key Details

**Domain Type** (`model/types.ts`):

```typescript
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
```

**Mapper** (`api/mappers.ts`):

- Transforms `UserDto` (API response) to `User` (domain type)
- Validates with Zod schema via `parseWithSchema()`
- Ensures type safety at the API boundary

**Query Options** (`api/queries.ts`):

- `currentUserQueryOptions` -- fetches the authenticated user via `GET /users/me`
- Used by features and widgets that need current user data

**Public API** (`index.ts`):

```typescript
export { currentUserQueryOptions } from './api/queries';
export type { User } from './model/types';
```

---

## Real Example: session

The session entity is different -- it uses a **Zustand store** for client-side state rather than TanStack Query for server data.

```
src/entities/session/
├── index.ts                # Exports: useSession, sessionStore
└── model/
    ├── store.ts            # Zustand vanilla store (createStore)
    └── use-session.ts      # React hook wrapper (useStore)
```

### Key Details

- **Vanilla store** (`createStore`) instead of React-bound `create` -- allows access from interceptors and guards
- **No API segment** -- session data comes from the login/refresh features, not from direct entity API calls
- **No persistence** -- access tokens are in-memory only for security

---

## Checklist

| Step                                                           | Done? |
| -------------------------------------------------------------- | ----- |
| Directory follows `entities/[name]/` pattern                   |       |
| Domain type defined in `model/types.ts`                        |       |
| Zod schema defined in `model/schema.ts` (if validation needed) |       |
| DTOs defined in `api/dto.ts` (if API shape differs)            |       |
| Mappers transform DTOs to domain types                         |       |
| Endpoints return domain types (not DTOs)                       |       |
| Query options defined for TanStack Query consumers             |       |
| `index.ts` exports only the public API                         |       |
| Types exported with `export type`                              |       |
| No imports from other entities, features, or higher layers     |       |
| No `any` types                                                 |       |
