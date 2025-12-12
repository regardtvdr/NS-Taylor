/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  readonly VITE_API_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

