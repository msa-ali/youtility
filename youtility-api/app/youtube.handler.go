package app

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Altamashattari/youtility/service"
)

type YoutubeHandler struct {
	service *service.YoutubeService
}

func (h YoutubeHandler) GetVideoDetails(w http.ResponseWriter, r *http.Request) {
	videoURL := r.URL.Query().Get("video_url")
	if videoURL == "" {
		writeResponse(w, http.StatusBadRequest, errors.New("video url is missing"))
		return
	}

	data, err := h.service.GetYoutubeVideoDetails(videoURL, []string{"snippet", "contentDetails"})

	if err != nil {
		writeResponse(w, http.StatusBadRequest, errors.New("video url is invalid"))
		return
	}

	writeResponse(w, http.StatusOK, data)
}

func writeResponse(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		panic(err)
	}
}
