import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import apiInstance from "@/api/axios";

export const useCommunityStore = defineStore("community", () => {
  const posts = ref([]);
  const currentPost = ref(null); // 상세 조회용
  const comments = ref([]);
  const allTags = ref([]); // 인기 태그 저장
  const totalPages = ref(0);
  const totalElements = ref(0);
  const loading = ref(false);
  const myPosts = ref([]);
  const likedPosts = ref([]);
  const hasNext = ref(true);

  // 검색/필터링 상태
  const filters = reactive({
    keyword: "",
    tag: "",
    category: "",
    sort: "POPULAR",
    page: 0,
    size: 10,
  });

  // 게시글 목록 조회 (GET /api/community) 무한스크롤링 전
  //   const fetchPosts = async () => {
  //     loading.value = true;
  //     try {
  //       console.log(filters);
  //       const { data } = await apiInstance.get("/api/community/posts", {
  //         params: filters,
  //       });
  //       console.log(data);
  //       if (data.code === 0) {
  //         posts.value = data.data.content || [];
  //         totalPages.value = data.data.totalPages;
  //         totalElements.value = data.data.totalElements;
  //       }
  //     } catch (error) {
  //       console.error("목록 조회 실패", error);
  //     } finally {
  //       loading.value = false;
  //     }
  //   };
  const fetchPosts = async (isReset = false) => {
    if (loading.value) return; // 중복 요청 방지

    if (isReset) {
      filters.page = 0;
      hasNext.value = true;
    }

    if (!hasNext.value) return;

    loading.value = true;
    try {
      const { data } = await apiInstance.get("/api/community/posts", {
        params: filters,
      });

      if (data.code === 0) {
        const newPosts = data.data.content || [];

        // 핵심: 이전에 있던 posts에 새로운 posts를 합칩니다.
        posts.value = isReset ? newPosts : [...posts.value, ...newPosts];

        // 다음 페이지 정보 업데이트
        hasNext.value = data.data.hasNext;
        if (hasNext.value) filters.page++;
      }
    } catch (error) {
      console.error("목록 조회 실패", error);
    } finally {
      loading.value = false;
    }
  };

  // 게시글 상세 조회 (GET /api/community/{postId})
  const fetchPostDetail = async (postId) => {
    loading.value = true;
    try {
      const { data } = await apiInstance.get(`/api/community/${postId}`);
      if (data.code === 0) {
        currentPost.value = data.data;
        return data.data;
      }
    } catch (error) {
      console.error("상세 조회 실패", error);
    } finally {
      loading.value = false;
    }
  };

  // 게시글 작성 (POST /api/community) - Multipart 처리 필요 시 대응 가능하게 설계
  const createPost = async (formData) => {
    try {
      const { data } = await apiInstance.post("/api/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error("게시글 작성 실패", error);
      throw error;
    }
  };

  // 게시글 수정 (PUT /api/community/{postId})
  const updatePost = async (postId, formData) => {
    try {
      console.log(postId, formData);
      const { data } = await apiInstance.put(
        `/api/community/${postId}`,
        formData
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error("게시글 수정 실패", error);
      throw error;
    }
  };

  // 게시글 삭제 (DELETE /api/community/{postId})
  const deletePost = async (postId) => {
    try {
      const { data } = await apiInstance.delete(`/api/community/${postId}`);
      if (data.code === 0) {
        // posts.value = posts.value.filter((p) => p.id !== postId);
        myPosts.value = myPosts.value.filter((p) => p.id !== postId);
      }
      return data;
    } catch (error) {
      console.error("게시글 삭제 실패", error);
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
      const post = posts.value.find((p) => p.id === postId);
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
      console.error("좋아요 처리 실패", error);
    }
  };

  // 댓글 목록 조회 (GET /api/community/{postId}/comments)
  const fetchComments = async (postId) => {
    try {
      const { data } = await apiInstance.get(
        `/api/community/${postId}/comments`
      );
      if (data.code === 0) {
        comments.value = data.data;
        console.log(comments.value);
        return data.data;
      }
    } catch (error) {
      console.error("댓글 조회 실패", error);
    }
  };

  // 댓글 등록 (POST /api/community/{postId}/comments)
  const addComment = async (postId, content, parentId) => {
    try {
      const { data } = await apiInstance.post(
        `/api/community/${postId}/comments`,
        {
          content,
          parentId,
        }
      );
      if (data.code === 0) {
        await fetchComments(postId); // 댓글 목록 갱신
      }
      return data.data;
    } catch (error) {
      console.error("댓글 등록 실패", error);
    }
  };

  // 댓글 삭제 (DELETE /api/community/comments/{commentId})
  const deleteComment = async (postId, commentId) => {
    try {
      const { data } = await apiInstance.delete(
        `/api/community/comments/${commentId}`
      );
      if (data.code === 0) {
        await fetchComments(postId);
      }
    } catch (error) {
      console.error("댓글 삭제 실패", error);
    }
  };

  // 인기 태그 조회 (GET /api/community/tags/top)
  const fetchTopTags = async (limit = 10) => {
    try {
      const { data } = await apiInstance.get("/api/community/tags/top", {
        params: { limit },
      });
      if (data.code === 0) {
        allTags.value = data.data.map((tag) => tag.name);
      }
    } catch (error) {
      console.error("인기 태그 조회 실패", error);
    }
  };

  // 내가 좋아요한 게시글 (GET /api/community/likes/me)
  const fetchMyPosts = async () => {
    loading.value = true;
    try {
      const response = await apiInstance.get("/api/community/posts/me", {
        params: { page: 0, size: 50 },
      });
      // 스웨거 응답 구조: response.data.data.content
      myPosts.value = response.data.data.content;
    } catch (error) {
      console.error("내 게시글 로드 실패:", error);
    } finally {
      loading.value = false;
    }
  };

  // 2. 내가 좋아요한 게시글 조회
  const fetchLikedPosts = async () => {
    loading.value = true;
    try {
      const response = await apiInstance.get("/api/community/likes/me", {
        params: { page: 0, size: 50 },
      });
      likedPosts.value = response.data.data.content;
    } catch (error) {
      console.error("좋아요 게시글 로드 실패:", error);
    } finally {
      loading.value = false;
    }
  };

  // // 3. 게시글 삭제
  // const deletePost = async (postId) => {
  //   try {
  //     await axios.delete(`/api/community/posts/${postId}`)
  //     // 삭제 성공 시 로컬 상태에서도 즉시 제거 (서버 다시 안 불러와도 됨)
  //     myPosts.value = myPosts.value.filter(p => p.id !== postId)
  //     likedPosts.value = likedPosts.value.filter(p => p.id !== postId)
  //     return true
  //   } catch (error) {
  //     console.error("게시글 삭제 실패:", error)
  //     return false
  //   }
  // }

  return {
    posts,
    currentPost,
    comments,
    allTags,
    filters,
    loading,
    myPosts,
    likedPosts,
    hasNext,
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
    fetchMyPosts,
    fetchLikedPosts,
  };
});
