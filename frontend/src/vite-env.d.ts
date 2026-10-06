/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API. Defaults to /api/v1 (same origin). */
  readonly VITE_API_URL?: string;
  /** Backend address used by the dev server proxy. Defaults to http://localhost:4000. */
  readonly VITE_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
