package app

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

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

func (h YoutubeHandler) DownloadVideo(w http.ResponseWriter, r *http.Request) {
	videoURL := r.URL.Query().Get("video_url")
	format := r.URL.Query().Get("format")
	if videoURL == "" || format == "" {
		writeResponse(w, http.StatusBadRequest, errors.New("video url or format is missing"))
		return
	}
	iTagNo, err := strconv.Atoi(format)
	if err != nil {
		writeResponse(w, http.StatusBadRequest, errors.New("invalid video format"))
		return
	}
	err = service.DownloadYoutubeVideo(w, videoURL, iTagNo)
	if err != nil {
		writeResponse(w, http.StatusInternalServerError, errors.New("error while downloading"))
		return
	}
}

func writeResponse(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		panic(err)
	}
}
