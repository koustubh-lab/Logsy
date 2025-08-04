import apiClient from "./AxiosApiService";

export const likePostByUserApi = (postId) => {
  return apiClient.post("/api/post/like", {post: postId})
}

export const unlikePostByUserApi = (postId) => {
  return apiClient.post("/api/post/unlike", {post: postId})
}