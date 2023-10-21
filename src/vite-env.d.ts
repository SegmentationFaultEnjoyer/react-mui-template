/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string
  VITE_MULTER_FILE_IDENTIFIER: string
  VITE_CHAIN_ID: string
}

interface Document {
  ENV: ImportMetaEnv
}
