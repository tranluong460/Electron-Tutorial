import { localUser } from '@system/database/entities'
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { KEY_API_URL_NEW } from '../helpers'
import { logger } from '../utils'
const axiosClient = axios.create({
  baseURL: KEY_API_URL_NEW,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 300000
})
axiosClient.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent
    const user = await localUser()
    if (user && user!.apiToken) {
      config.headers.Authorization = `Bearer ${user!.refeshToken}`
    }
    return config
  },
  function (error) {
    logger.error(error)
    // Do something with request error
    return Promise.reject(error)
  }
)
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  async function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    if (error.response?.status === 401) {
      const user = await localUser()
      if (user.apiToken || user.refeshToken) {
        user.apiToken = null
        user.refeshToken = null
        await user.save()
      }
    }
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axiosClient
