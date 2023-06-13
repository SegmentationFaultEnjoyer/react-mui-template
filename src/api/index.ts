import { config } from '@config'
import { JsonApiClient } from '@distributedlab/jac'

import { bearerAttachInterceptor } from '@/api/interseptors'

export const api = new JsonApiClient({ baseUrl: config.API_URL }, [
  { request: bearerAttachInterceptor },
])
