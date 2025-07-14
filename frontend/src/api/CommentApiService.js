import apiClient from "./AxiosApiService";

export const commentByUserApi = (comment, post_id) => {
  return apiClient.post('/api/comment', {comment, postId: post_id})
}

export const deleteCommentByUserApi = (commentId) => {
  return apiClient.post('/api/comment', {comment, postId: post_id})
}