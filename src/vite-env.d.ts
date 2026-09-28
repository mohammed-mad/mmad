/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAL_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
