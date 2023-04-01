package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Altamashattari/youtility/logger"
	"github.com/Altamashattari/youtility/service"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func sanityCheck() {
	if os.Getenv("YOUTUBE_DATA_API_KEY") == "" ||
		os.Getenv("SERVER_ADDRESS") == "" ||
		os.Getenv("SERVER_PORT") == "" {
		log.Fatal("Environmnetal variables are not defined")
	}
}

func Start() {
	err := godotenv.Load(".env")
	if err != nil {
		logger.Error("error while loading env vars. Err: %s" + err.Error())
		os.Exit(1)
	}
	sanityCheck()

	router := mux.NewRouter()

	ytService, err := service.NewYoutubeService()
	if err != nil {
		logger.Error("error while initiating youtube service. Err: %s" + err.Error())
		os.Exit(1)
	}
	yh := YoutubeHandler{service: ytService}

	router.HandleFunc("/api/youtube/details", yh.GetVideoDetails)

	router.
		HandleFunc("/api/download", func(w http.ResponseWriter, r *http.Request) {}).
		Methods(http.MethodPost).
		Name("Download")

	address := os.Getenv("SERVER_ADDRESS")
	port := os.Getenv("SERVER_PORT")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	err = http.ListenAndServe(fmt.Sprintf("%s:%s", address, port), handler)
	if err != nil {
		logger.Error("error while starting server" + err.Error())
		os.Exit(1)
	}
}
