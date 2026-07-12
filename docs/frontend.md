# Frontend Engineering

The SentinelAI frontend is built with **Next.js 15 (App Router)** and **React**. It is designed to look and feel like an internal tool at a top-tier tech company (e.g., Stripe, Palantir).

## State Management

We use **Zustand** for global state management.
- `useTransactionStore`: Maintains a sliding window of the latest live transactions (max 100) received via SSE to prevent memory leaks in the browser.
- `useLiveTransactions`: A custom React hook that connects to the backend `EventSource` on mount and dispatches incoming SSE payloads directly into the Zustand store.

## Theming and UI

- **Tailwind CSS:** Used for all styling. We utilize a strict CSS variable system (e.g., `hsl(var(--primary))`) to support seamless light/dark mode transitions.
- **Lucide Icons:** Provides a clean, modern icon set.
- **Recharts:** Powers the dynamic, interactive charts on the Dashboard and Explainability Studio.
- **Micro-interactions:** Buttons and rows feature subtle hover states and transitions to ensure the platform feels responsive and "alive."

## Data Fetching

While live data is pushed via SSE, historical data (e.g., Model Registry, Dataset stats, historical MLOps analytics) is fetched via standard REST API calls to the Node.js backend. In a production environment, these would be Server Components or utilize SWR/React Query for caching, but for this portfolio project, standard `useEffect` fetching is used for simplicity and explicit demonstration of API integration.
