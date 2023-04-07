package app

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/Altamashattari/youtility/logger"
	"github.com/Altamashattari/youtility/service"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func Start() {
	loadEnv()
	router := mux.NewRouter()

	ytService, err := service.NewYoutubeService()
	if err != nil {
		logger.Error("error while initiating youtube service. Err: %s" + err.Error())
		os.Exit(1)
	}
	yh := YoutubeHandler{service: ytService}

	router.
		HandleFunc("/api/youtube/{id}", yh.GetVideoDetails).
		Methods(http.MethodGet).
		Name("GetVideoDetails")

	router.
		HandleFunc("/api/youtube/download/{id}/{itag:[0-9]+}", yh.DownloadVideo).
		Methods(http.MethodGet).
		Name("Download")

	router.
		HandleFunc("/api/youtube/playlist/details", yh.GetPlaylistDetails).
		Methods(http.MethodGet).
		Name("GetPlaylistDetails")

	// CORS
	allowedOrigins := strings.Split(os.Getenv(config[ALLOWED_ORIGIN]), ",")
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"*"}
	}
	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowCredentials: false,
	})

	handler := c.Handler(router)
	logger.Info(fmt.Sprintf("Starting server at port 8080 in %s mode", getEnvironment()))
	err = http.ListenAndServe(":8080", handler)
	if err != nil {
		logger.Error("error while starting server" + err.Error())
		os.Exit(1)
	}
}
