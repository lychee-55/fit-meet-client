import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import apiInstance from '@/api/axios';

export const useCommunityStore = defineStore('community', () => {
  const posts = ref([]);
  const currentPost = ref(null); // 상세 조회용
  const comments = ref([]);
  const allTags = ref([]); // 인기 태그 저장
  // const allTags = ref([
  //   '오운완',
  //   '다이어트',
  //   '식단',
  //   '헬스',
  //   '홈트',
  //   '유산소',
  //   '단백질',
  //   '바디프로필',
  // ]);
  const loading = ref(false);

  // 검색/필터링 상태
  const filters = reactive({
    keyword: '',
    tag: '',
    category: '',
    sort: 'POPULAR',
    page: 0,
    size: 20,
  });

  // 게시글 목록 조회 (GET /api/community)
  const fetchPosts = async () => {
    loading.value = true;
    try {
      const { data } = await apiInstance.get('/api/community', {
        params: filters,
      });
      console.log(data);
      if (data.code === 0) {
        posts.value = data.data;
      }
    } catch (error) {
      console.error('목록 조회 실패', error);
    } finally {
      loading.value = false;
    }
    /*
    *요약: 지금 바로 할 일
Community.js에서 params를 정의할 때 if (value !== '') 조건문을 추가하여 값이 있을 때만 객체에 담으세요.

브라우저 네트워크 탭에서 요청 URL이 ...?sort=POPULAR&page=0&size=20 처럼 깔끔하게 바뀌었는지 확인하세요.
    */
  };

  // 게시글 상세 조회 (GET /api/community/{postId})
  const fetchPostDetail = async postId => {
    loading.value = true;
    try {
      const { data } = await apiInstance.get(`/api/community/${postId}`);
      if (data.code === 0) {
        currentPost.value = data.data;
        return data.data;
      }
    } catch (error) {
      console.error('상세 조회 실패', error);
    } finally {
      loading.value = false;
    }
  };

  // 게시글 작성 (POST /api/community) - Multipart 처리 필요 시 대응 가능하게 설계
  const createPost = async formData => {
    try {
      const { data } = await apiInstance.post('/api/community', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      console.error('게시글 작성 실패', error);
      throw error;
    }
  };

  // 게시글 수정 (PUT /api/community/{postId})
  const updatePost = async (postId, formData) => {
    try {
      const { data } = await apiInstance.put(
        `/api/community/${postId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    } catch (error) {
      console.error('게시글 수정 실패', error);
      throw error;
    }
  };

  // 게시글 삭제 (DELETE /api/community/{postId})
  const deletePost = async postId => {
    try {
      const { data } = await apiInstance.delete(`/api/community/${postId}`);
      if (data.code === 0) {
        posts.value = posts.value.filter(p => p.id !== postId);
      }
      return data;
    } catch (error) {
      console.error('게시글 삭제 실패', error);
    }
  };

  // 좋아요 토글 (POST/DELETE /api/community/{postId}/like)
  const toggleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await apiInstance.delete(`/api/community/${postId}/like`);
      } else {
        await apiInstance.post(`/api/community/${postId}/like`);
      }
      // 목록 데이터 실시간 업데이트 (UI 반영)
      const post = posts.value.find(p => p.id === postId);
      if (post) {
        post.likedByMe = !isLiked;
        post.likeCount += isLiked ? -1 : 1;
      }
      // 상세페이지일 경우 상세 데이터도 업데이트
      if (currentPost.value && currentPost.value.id === postId) {
        currentPost.value.likedByMe = !isLiked;
        currentPost.value.likeCount += isLiked ? -1 : 1;
      }
    } catch (error) {
      console.error('좋아요 처리 실패', error);
    }
  };

  // 댓글 목록 조회 (GET /api/community/{postId}/comments)
  const fetchComments = async postId => {
    try {
      const { data } = await apiInstance.get(
        `/api/community/${postId}/comments`,
      );
      if (data.code === 0) {
        comments.value = data.data;
      }
      /* [기존 목업 주석 처리]
      comments.value = [
        { id: 1, content: '와, 사진 보니까 저도 운동하고 싶어지네요! 💪', ... },
      ];
      */
    } catch (error) {
      console.error('댓글 조회 실패', error);
    }
  };

  // 댓글 등록 (POST /api/community/{postId}/comments)
  const addComment = async (postId, content, parentId = null) => {
    try {
      const { data } = await apiInstance.post(
        `/api/community/${postId}/comments`,
        {
          content,
          parentId,
        },
      );
      if (data.code === 0) {
        await fetchComments(postId); // 댓글 목록 갱신
      }
      return data.data;
    } catch (error) {
      console.error('댓글 등록 실패', error);
    }
  };

  // 댓글 삭제 (DELETE /api/community/comments/{commentId})
  const deleteComment = async (postId, commentId) => {
    try {
      const { data } = await apiInstance.delete(
        `/api/community/comments/${commentId}`,
      );
      if (data.code === 0) {
        await fetchComments(postId);
      }
    } catch (error) {
      console.error('댓글 삭제 실패', error);
    }
  };

  // 인기 태그 조회 (GET /api/community/tags/top)
  const fetchTopTags = async (limit = 10) => {
    try {
      const { data } = await apiInstance.get('/api/community/tags/top', {
        params: { limit },
      });
      if (data.code === 0) {
        allTags.value = data.data.map(tag => tag.name);
      }
    } catch (error) {
      console.error('인기 태그 조회 실패', error);
    }
  };

  // 내가 좋아요한 게시글 (GET /api/community/likes/me)
  const fetchMyLikedPosts = async () => {
    loading.value = true;
    try {
      const { data } = await apiInstance.get('/api/community/likes/me');
      if (data.code === 0) {
        posts.value = data.data;
      }
    } catch (error) {
      console.error('좋아요 게시글 조회 실패', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    posts,
    currentPost,
    comments,
    allTags,
    filters,
    loading,
    fetchPosts,
    fetchPostDetail,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    fetchComments,
    addComment,
    deleteComment,
    fetchTopTags,
    fetchMyLikedPosts,
  };
});
