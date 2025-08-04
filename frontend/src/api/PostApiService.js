import apiClient from "./AxiosApiService"

export const createBlogForUserApi = (title, content, description, tagNames) => {
  return apiClient.post("/api/create-post", {title, content, description, tagNames})
}

export function getPostsForUserByPageApi(page, size = 3) {
  return apiClient.get(`/api/posts?page=${page}&size=${size}`)
}

export function getAllPostsForUserByPageApi(page, size = 3) {
  return apiClient.get(`/api/global-posts?page=${page}&size=${size}`)
}

export function getPostsForUserByPageWithDashboardDetailsApi(page, size = 3) {
  return apiClient.get(`/api/dashboard-posts?page=${page}&size=${size}`)
}

export function getPostByIdApi(post_id) {
  return apiClient.get(`/api/post/${post_id}`)
}

export function getPostByIdForGuest(post_id) {
  return apiClient.get(`/api/post/${post_id}/unauthenticated`)
}

export const updateBlogByPostIdApi = (postId, title, content) => {
  return apiClient.put(`/api/post/${postId}`, {title, content})
}

export const deleteBlogByPostIdApi = (postId) => {
  return apiClient.delete(`/api/post/${postId}`)
}

export const searchPostByText = (query) => {
  return apiClient.get(`/api/posts/search?query=${encodeURIComponent(query)}`)
}