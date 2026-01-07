/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_SHEETS_URL: string
    readonly VITE_META_PIXEL_ID: string
    readonly VITE_CRM_PASSWORD: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
