package app

import (
	"net/http"
	"os"
	"strings"

	"github.com/Altamashattari/youtility/logger"
	"github.com/Altamashattari/youtility/service"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func sanityCheck() {
	if os.Getenv("YOUTUBE_DATA_API_KEY") == "" ||
		// os.Getenv("SERVER_ADDRESS") == "" ||
		// os.Getenv("SERVER_PORT") == "" ||
		os.Getenv("ALLOWED_ORIGIN") == "" {
		logger.Error("Environmnetal variables are not defined")
		os.Exit(1)
	}
}

func Start() {
	err := godotenv.Load(".env")
	if err != nil {
		logger.Error("error while loading env vars. Err: %s" + err.Error())
	}
	sanityCheck()

	router := mux.NewRouter()

	ytService, err := service.NewYoutubeService()
	if err != nil {
		logger.Error("error while initiating youtube service. Err: %s" + err.Error())
		os.Exit(1)
	}
	yh := YoutubeHandler{service: ytService}

	router.
		HandleFunc("/api/youtube/details", yh.GetVideoDetails).
		Methods(http.MethodGet).
		Name("GetVideoDetails")

	router.
		HandleFunc("/api/youtube/download", yh.DownloadVideo).
		Methods(http.MethodGet).
		Name("Download")

	router.
		HandleFunc("/api/youtube/playlist/details", yh.GetPlaylistDetails).
		Methods(http.MethodGet).
		Name("GetPlaylistDetails")

	// address := os.Getenv("SERVER_ADDRESS")
	// port := os.Getenv("SERVER_PORT")

	// CORS
	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGIN"), ",")
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"*"}
	}
	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	// err = http.ListenAndServe(fmt.Sprintf("%s:%s", address, port), handler)
	err = http.ListenAndServe(":8080", handler)
	if err != nil {
		logger.Error("error while starting server" + err.Error())
		os.Exit(1)
	}
}
