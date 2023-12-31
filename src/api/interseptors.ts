import {
  Fetcher,
  FetcherErrorResponseInterceptor,
  FetcherRequest,
  FetcherRequestInterceptor,
  FetcherResponse,
  HTTP_METHODS,
  HTTP_STATUS_CODES,
} from '@distributedlab/fetcher'

export const bearerAttachInterceptor: FetcherRequestInterceptor = async (
  request: FetcherRequest,
) => {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) return request

  if (!request.headers) request.headers = {}

  // Attach bearer token to every request
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  return request
}

// TODO: add refresh token handling logic
// IMPROVEMENT: check access token existance before response not after

export const refreshTokenInterceptor: FetcherErrorResponseInterceptor = async (
  response: FetcherResponse<unknown>,
) => {
  const config = response?.request
  const isUnauthorized = response.status === HTTP_STATUS_CODES.UNAUTHORIZED

  // If error isn't unauthorized - return error
  if (!isUnauthorized) return Promise.reject(response)

  // Some authentication store in the client app

  try {
    const accessToken = localStorage.getItem('accessToken')

    // Executes some refresh token logic in the client app

    const url = new URL(config.url)

    return new Fetcher({ baseUrl: url.origin }).request({
      endpoint: url.pathname,
      method: config.method as HTTP_METHODS,
      ...(config.body ? { body: config.body } : {}),
      headers: {
        ...config.headers,
        // Reset default authorization header with new token
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    /** Example of handling refresh token error in the client app
     *
     * Implementation may differ from example
     *
     * We can logout user and redirect him to the login page and
     * emit bus error event to show user that session expired
     */
    return Promise.reject(error)
  }
}
