import apiClient from "./AxiosApiService"

export const createBlogForUserApi = (title, content) => {
  return apiClient.post("/api/create-post", {title, content})
}

export function getPostsForUserByPageApi(page) {
  return apiClient.get(`/api/posts?page=${page}`)
}

export function getPostByIdApi(post_id) {
  return apiClient.get(`/api/post/${post_id}`)
}

export const updateBlogByPostIdApi = (postId, title, content) => {
  return apiClient.put(`/api/post/${postId}`, {title, content})
}