# Creating a Feature

This guide walks through creating a new feature in Viteplate, using the existing `auth/login` feature as a reference. Features are the primary unit of business logic in Feature-Sliced Design.

---

## Table of Contents

- [What is a Feature?](#what-is-a-feature)
- [Feature Structure](#feature-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Real Example: auth/login](#real-example-authlogin)
- [Checklist](#checklist)

---

## What is a Feature?

A feature encapsulates a **complete user action** or business use case. It contains everything needed to perform that action: API calls, validation schemas, state hooks, and UI components.

**Examples:** Login, logout, search, toggle theme, create post, delete comment.

**FSD Rules for Features:**

- May import from `entities/` and `shared/`
- May NOT import from other features, widgets, pages, or app
- Must expose a public API through `index.ts`

---

## Feature Structure

```
src/features/
└── [domain]/
    └── [feature-name]/
        ├── index.ts              # Public API barrel
        ├── api/                   # API layer
        │   ├── dto.ts            # Request/response DTOs
        │   └── endpoint.ts       # API endpoint function
        ├── model/                 # Business logic
        │   ├── use-[name].ts     # React hook (TanStack Query mutation/query)
        │   └── [name]-schema.ts  # Zod validation schema (if forms)
        └── ui/                    # Feature-specific components
            └── [Name]Form.tsx    # UI component
```

Not every feature needs every segment. A feature like `logout` has `api/`, `model/`, and `ui/`.

---

## Step-by-Step Guide

### Step 1: Plan the Feature

Before writing code, identify:

| Question                              | Example (login)                                |
| ------------------------------------- | ---------------------------------------------- |
| What user action does this represent? | Signing in with credentials                    |
| What API endpoint(s) does it need?    | `POST /auth/login`                             |
| What data does it send/receive?       | Sends email + password, receives token + user  |
| Does it need form validation?         | Yes (Zod schema)                               |
| Does it need UI?                      | Yes (LoginForm component)                      |
| What entities does it depend on?      | `session` (to store token), `user` (for types) |

### Step 2: Create the Directory

```bash
mkdir -p src/features/[domain]/[feature-name]/{api,model,ui}
```

For a feature like "create-post":

```bash
mkdir -p src/features/post/create-post/{api,model,ui}
```

### Step 3: Define DTOs

Create request and response types in `api/dto.ts`:

```typescript
// src/features/post/create-post/api/dto.ts
import type { Post } from '@entities/post';

export interface CreatePostDto {
    title: string;
    content: string;
    tags: string[];
}

export interface CreatePostResponse {
    post: Post;
}
```

### Step 4: Create the Endpoint

Write the API call in `api/endpoint.ts`:

```typescript
// src/features/post/create-post/api/endpoint.ts
import { apiPost } from '@shared/api';
import { createPostResponseSchema } from './dto';
import type { CreatePostDto, CreatePostResponse } from './dto';

export async function createPost(dto: CreatePostDto): Promise<CreatePostResponse> {
    return apiPost('/posts', dto, { schema: createPostResponseSchema });
}
```

### Step 5: Create the Validation Schema (if forms)

Define the form schema in `model/[name]-schema.ts`:

```typescript
// src/features/post/create-post/model/create-post-schema.ts
import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).max(5, 'Maximum 5 tags'),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
```

### Step 6: Create the Hook

Write the business logic hook in `model/use-[name].ts`:

```typescript
// src/features/post/create-post/model/use-create-post.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { createPost } from '../api/endpoint';
import type { CreatePostDto } from '../api/dto';

export function useCreatePost() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (dto: CreatePostDto) => createPost(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigate({ to: '/posts' });
        },
    });
}
```

### Step 7: Create the UI Component

Build the form component in `ui/[Name]Form.tsx`:

```typescript
// src/features/post/create-post/ui/CreatePostForm.tsx
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useCreatePost } from '../model/use-create-post';
import { createPostSchema } from '../model/create-post-schema';
import { Button, Input, Label } from '@shared/ui';
import { ErrorMessage } from '@shared/ui/feedback';

export function CreatePostForm() {
    const createPost = useCreatePost();

    const form = useForm({
        defaultValues: { title: '', content: '', tags: [] },
        onSubmit: ({ value }) => createPost.mutate(value),
        validatorAdapter: zodValidator(),
        validators: { onSubmit: createPostSchema },
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
            {/* Form fields */}
            <Button type="submit" loading={createPost.isPending}>
                Create Post
            </Button>
            {createPost.isError && (
                <ErrorMessage message={createPost.error.message} />
            )}
        </form>
    );
}
```

### Step 8: Create the Public API

Export only what consumers need in `index.ts`:

```typescript
// src/features/post/create-post/index.ts
export { CreatePostForm } from './ui/CreatePostForm';
export { useCreatePost } from './model/use-create-post';
```

### Step 9: Use in a Page

Import the feature through its public API:

```typescript
// src/pages/create-post/CreatePostPage.tsx
import { CreatePostForm } from '@features/post/create-post';
import { Card, Container } from '@shared/ui';

export function CreatePostPage() {
    return (
        <Container maxWidth="md">
            <h1 className="text-2xl font-semibold text-foreground">New Post</h1>
            <Card variant="filled" padding="md">
                <CreatePostForm />
            </Card>
        </Container>
    );
}
```

---

## Real Example: auth/login

Here is how the actual login feature is structured:

```
src/features/auth/login/
├── index.ts                        # Exports: LoginForm
├── api/
│   ├── dto.ts                      # LoginDto, LoginResponse
│   └── endpoint.ts                 # login() (POST /auth/login, skipAuth)
├── model/
│   ├── use-login.ts                # TanStack Query mutation + session store update
│   └── login-form-schema.ts        # Zod schema (email + password validation)
└── ui/
    └── LoginForm.tsx               # TanStack Form + Zod validation
```

### Key Implementation Details

**Endpoint** (`api/endpoint.ts`):

- Uses `skipAuth: true` since login does not require an existing token
- Returns `LoginResponse` with access token and user data

**Hook** (`model/use-login.ts`):

- On success: stores access token and user in the session store
- On success: navigates to the user's role-based home page via `getRoleHomePath()`

**Form** (`ui/LoginForm.tsx`):

- Uses TanStack Form for state management
- Validates with Zod schema (email format, password minimum length)
- Shows loading state on the submit button
- Displays server errors via `ErrorMessage`

**Public API** (`index.ts`):

```typescript
export { LoginForm } from './ui/LoginForm';
```

Only `LoginForm` is exported because:

- `useLogin` is consumed internally by `LoginForm`
- DTOs and schemas are implementation details
- The endpoint function is not needed outside the feature

---

## Checklist

Before considering a feature complete:

| Step                                                     | Done? |
| -------------------------------------------------------- | ----- |
| Directory follows `features/[domain]/[name]/` pattern    |       |
| DTOs use `import type` for type-only imports             |       |
| Endpoint function returns typed response                 |       |
| Hook uses TanStack Query mutation or query               |       |
| Zod schema validates all form inputs (if applicable)     |       |
| UI component is in a separate `.tsx` file (fast refresh) |       |
| `index.ts` exports only the public API                   |       |
| No imports from other features, widgets, pages, or app   |       |
| No `any` types                                           |       |
| Tests cover the critical path                            |       |
