# LMS Frontend

The web client for the LMS platform — a **Next.js 16** (App Router) + **React 19** app in
**TypeScript**, styled with **Tailwind CSS v4**. It talks to the backend microservices
through the **API Gateway** and renders role-aware UI for students, instructors, and
admins. Deployed on **Vercel**.

---

## Tech stack

- **Next.js 16** (App Router) / **React 19**
- **TypeScript** (strict) with the `@/*` → `src/*` path alias
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **fetch** for most API calls (`src/lib/api.ts`); **axios** in one hook
  (`useChangePassword`); **jwt-decode** in the profile page
- Remote images allowed from `lmsuserstorageayler.blob.core.windows.net` (see
  `next.config.ts`)

---

## Project structure

```
src/
├── app/                          # App Router routes
│   ├── (auth)/                   # Auth route group (no app chrome)
│   │   ├── sign-in/              # Email entry / register
│   │   ├── enter-password/       # Password step
│   │   └── verify-email/         # 6-digit code verification
│   ├── courses/
│   │   ├── page.tsx              # Course catalog
│   │   ├── create/              # Create a course (instructor/admin)
│   │   └── [id]/
│   │       ├── page.tsx          # Course detail
│   │       ├── edit/            # Edit course (instructor/admin)
│   │       ├── content/         # Module/lesson management
│   │       └── [lessonId]/      # Lesson viewer
│   ├── dashboard/               # Authenticated landing
│   ├── profile/                 # User profile (+ change password)
│   ├── help/                    # Help center, FAQ, support tickets
│   ├── layout.tsx               # Root layout
│   ├── not-found.tsx            # 404
│   └── page.tsx                 # Public landing
├── components/
│   ├── ui/                      # Primitives: Button, Card, Input, Badge, Pagination, …
│   ├── layout/                  # AuthShell, DashboardShell, ProfileShell, Sidebar, Topbar, ChangePassword*
│   ├── courses/                 # EnrollButton, CourseManagementMenu, ReviewForm, DeleteCourseButton, …
│   ├── profile/                 # ProfileCard
│   ├── search/                  # SearchDropdown
│   └── icons.tsx
└── lib/
    ├── api.ts                   # Auth / Content / Enrollment API clients (via gateway)
    ├── search.ts                # Search API client
    └── cn.ts                    # className combiner
```

---

## Backend integration

Most calls go through the **API Gateway** (`NEXT_PUBLIC_API_URL`). The gateway strips the
leading `/<service>` segment and forwards to that service's `…/api/` base, so the client
**repeats the service segment** in the path. This is why the URLs look "doubled":

| Frontend call | Gateway forwards to |
|---|---|
| `POST /auth/Auth/login` | `…/api/Auth/login` (Auth Service) |
| `GET /content/content/courses/{id}/modules` | `…/api/content/courses/{id}/modules` (Content Service) |
| `POST /enrollments/enrollments` | `…/api/enrollments` (Enrollment Service) |
| `GET /enrollments/internal/enrollments/check` | `…/api/internal/enrollments/check` (Enrollment internal) |

`src/lib/api.ts` groups these into `authApi`, `contentApi`, and `enrollmentApi`, plus a
generic `request<T>()` helper that returns `{ data, error, status }` and surfaces the
backend's `message`/`error` field on failure.

Some calls **do not** go through the gateway and hit services directly: the Course Service
(`NEXT_PUBLIC_API_Course_URL`), Search (`NEXT_PUBLIC_SEARCH_API_URL`), FAQ
(`NEXT_PUBLIC_FAQ_API_URL`), and Tickets (`NEXT_PUBLIC_TICKET_API_URL`).

---

## Auth & roles

- **Tokens** are stored in `localStorage` (`accessToken`, `refreshToken`, `user`) via
  helpers in `api.ts` (`getAccessToken`, `setTokens`, `clearTokens`, `getUser`,
  `setUser`). Authenticated requests send `Authorization: Bearer <accessToken>`.
- **Flow:** sign-in → enter-password → (if unverified) verify-email → dashboard. The
  token response includes a `requiresEmailVerification` flag the UI reacts to.
- **Roles** (`Student`, `Instructor`, `Admin`) drive the UI: `EnrollButton` renders only
  for students; `CourseManagementMenu`, course create/edit, and content management render
  only for `Instructor`/`Admin`; the sidebar adapts per role.

---

## Environment variables

All are `NEXT_PUBLIC_*` (exposed to the browser). Create `.env.local` for development:

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `lib/api.ts` | **API Gateway** base URL (auth / content / enrollment) |
| `NEXT_PUBLIC_API_Course_URL` | `lib/api.ts` | Course Service base (direct, not via gateway) |
| `NEXT_PUBLIC_SEARCH_API_URL` | `lib/search.ts` | Search API base |
| `NEXT_PUBLIC_FAQ_API_URL` | `help/faq` | FAQ API base |
| `NEXT_PUBLIC_TICKET_API_URL` | `help/tickets` | Support-ticket API base |
| `NEXT_PUBLIC_API_GATEWAY_URL` | `useChangePassword` | Gateway base used by change-password (**duplicate of `API_URL`**) |
| `NEXT_PUBLIC_API_BASE` | `profile/page.tsx` | Base used by the profile page (**another gateway alias**) |
| `NEXT_PUBLIC_TOKEN` | `profile/page.tsx` | Referenced by the profile page (review — see Known issues) |
| `NEXT_PUBLIC_ENROLLMENT_SERVICE_API_KEY` | `lib/api.ts` | Internal `X-Api-Key` (**should not be in the browser** — see Known issues) |
| `NEXT_PUBLIC_CONTENT_SERVICE_API_KEY` | `lib/api.ts` | Internal `X-Api-Key` (**should not be in the browser**) |

> A missing variable becomes `undefined` and silently produces broken request URLs (e.g.
> `undefined/auth/Auth/login`), so set every one the running pages touch.

---

## Getting started

```bash
npm install
# create .env.local with at least NEXT_PUBLIC_API_URL pointing at the gateway
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (eslint-config-next)
```


- **Token refresh.** `authApi.refreshToken` exists; confirm there's an automatic
  refresh-on-401 path, otherwise sessions just expire when the access token does.
- **Cosmetic:** `package.json` name is still the scaffold default `my-next-app`.
