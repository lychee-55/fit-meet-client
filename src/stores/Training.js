import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import apiInstance from "@/api/axios";

export const useTrainingStore = defineStore("training", () => {
  // 상태 관리
  const videos = ref([]); // 전체 목록
  const recommendedVideos = ref([]); // 추천 목록
  const todayCompletedVideos = ref([]); // 오늘 완료 목록
  const currentVideo = ref(null); // 상세 정보
  const comments = ref([]); // 댓글 목록
  const loading = ref(false);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const isSync = ref(false);

  // 검색/필터링 상태 (GET /api/training/videos 전용)
  const filters = reactive({
    category: "",
    level: "",
    shortVideo: null,
    sort: "LATEST",
    page: 0,
    size: 12,
  });

  // 유투브 싱크 맞추기 (post /api/admin/training/youtube/sync 전용)
  const fetchYoutubeAdminSync = async () => {
    // 이미 성공했거나 로딩 중이면 중복 실행 방지
    if (isSync.value || loading.value) return;

    loading.value = true;
    try {
      const { data } = await apiInstance.post(
        "/api/admin/training/youtube/sync",
        {}
      );

      if (data.code === 0) {
        console.log(data.msg);
        isSync.value = true;
      }
    } catch (error) {
      console.error("유투브 싱크 실패", error);
    } finally {
      loading.value = false;
    }
  };

  // 1. 운동영상 목록 조회 (GET /api/training/videos)
  const fetchVideos = async () => {
    loading.value = true;
    try {
      const params = { ...filters };

      const { data } = await apiInstance.get("/api/training/videos", {
        params,
      });

      if (data.code === 0) {
        videos.value = data.data.content || [];
        // 페이징 정보 업데이트
        totalPages.value = data.data.totalPages;
        totalElements.value = data.data.totalElements;
      }
    } catch (error) {
      console.error("운동영상 목록 조회 실패", error);
    } finally {
      loading.value = false;
    }
  };

  const setPage = (newPage) => {
    filters.page = newPage;
    fetchVideos(); // 페이지 변경 후 자동 재조회
  };

  // 2. 추천 운동영상 조회 (GET /api/training/videos/recommended)
  const fetchRecommendedVideos = async (category, limit) => {
    try {
      const { data } = await apiInstance.get(
        "/api/training/videos/recommended",
        {
          params: { category, limit },
        }
      );
      if (data.code === 0) {
        recommendedVideos.value = data.data;
        console.log("스토어에 저장된 데이터:", recommendedVideos.value);
      }
    } catch (error) {
      console.error("추천 영상 조회 실패", error);
    }
  };

  // 3. 오늘 완료한 운동영상 목록 (GET /api/training/videos/history/today)
  const fetchTodayCompletedVideos = async () => {
    try {
      const { data } = await apiInstance.get(
        "/api/training/videos/history/today"
      );
      if (data.code === 0) {
        todayCompletedVideos.value = data.data;
      }
    } catch (error) {
      console.error("오늘 완료 목록 조회 실패", error);
    }
  };

  // 4. 운동영상 상세 조회 (GET /api/training/videos/{id})
  const fetchVideoDetail = async (id) => {
    loading.value = true;
    try {
      const { data } = await apiInstance.get(`/api/training/videos/${id}`);
      // if (data.code === 0) {
      //   currentVideo.value = data.data;
      //   // 상세 조회 시 해당 영상의 댓글도 함께 저장 (명세상 포함되어 있음)
      //   comments.value = data.data.comments || [];
      //   return data.data;
      // }
      if (data.code === 0) {
        currentVideo.value = data.data;
      }
    } catch (error) {
      console.error("영상 상세 조회 실패", error);
    } finally {
      loading.value = false;
    }
  };

  // 5. 운동영상 좋아요 토글 (POST /api/training/videos/{id}/like)
  const toggleVideoLike = async (id) => {
    try {
      const { data } = await apiInstance.post(
        `/api/training/videos/${id}/like`
      );
      if (data.code === 0) {
        // 상세 페이지 상태 업데이트
        const currentLikedStatus = data.data;
        if (currentVideo.value && currentVideo.value.id === id) {
          currentVideo.value.liked = currentLikedStatus;
          currentVideo.value.likeCount += currentLikedStatus ? 1 : -1;
        }
        // 목록 상태 업데이트
        const updateList = (list) => {
          const video = list.find((v) => v.id === id);
          if (video) {
            video.liked = currentLikedStatus;
            video.likeCount += currentLikedStatus ? 1 : -1;
          }
        };

        updateList(videos.value);
        updateList(recommendedVideos.value);
        updateList(todayCompletedVideos.value);
      }
    } catch (error) {
      console.error("좋아요 토글 실패", error);
    }
  };

  // 6. 운동 영상 완료 토글 (POST /api/training/videos/{id}/complete)
  const toggleVideoComplete = async (
    id,
    payload = { durationSec: 0, memo: "" }
  ) => {
    try {
      const { data } = await apiInstance.post(
        `/api/training/videos/${id}/complete`,
        payload
      );
      if (data.code === 0) {
        const currentCompleteStatus = data.data;

        if (currentVideo.value && currentVideo.value.id === id) {
          currentVideo.value.completedToday = currentCompleteStatus;
        }
        const updateList = (list) => {
          const video = list.find((v) => v.id === id);
          if (video) video.completedToday = currentCompleteStatus;
        };

        updateList(videos.value);
        updateList(recommendedVideos.value);

        await fetchTodayCompletedVideos();
      }
    } catch (error) {
      console.error("완료 처리 실패", error);
    }
  };

  // 7. 운동영상 댓글 작성 (POST /api/training/videos/{id}/comments)
  const addVideoComment = async (id, content) => {
    try {
      const { data } = await apiInstance.post(
        `/api/training/videos/${id}/comments`,
        { content }
      );
      if (data.code === 0) {
        // 작성 후 상세 정보를 다시 불러와 댓글 목록 갱신
        await fetchVideoDetail(id);
      }
      return data;
    } catch (error) {
      console.error("댓글 작성 실패", error);
    }
  };

  // 8. 운동영상 댓글 삭제 (DELETE /api/training/videos/comments/{commentId})
  const deleteVideoComment = async (videoId, commentId) => {
    try {
      const { data } = await apiInstance.delete(
        `/api/training/videos/comments/${commentId}`
      );
      if (data.code === 0) {
        // 삭제 후 상세 정보 갱신
        await fetchVideoDetail(videoId);
      }
    } catch (error) {
      console.error("댓글 삭제 실패", error);
    }
  };

  return {
    videos,
    totalPages,
    setPage,
    recommendedVideos,
    todayCompletedVideos,
    currentVideo,
    comments,
    loading,
    filters,
    fetchYoutubeAdminSync,
    fetchVideos,
    fetchRecommendedVideos,
    fetchTodayCompletedVideos,
    fetchVideoDetail,
    toggleVideoLike,
    toggleVideoComplete,
    addVideoComment,
    deleteVideoComment,
  };
});
