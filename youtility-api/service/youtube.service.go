package service

import (
	"net/http"
	"net/url"
	"os"

	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
)

type YoutubeVideoDetail struct {
	VideoId    string `json:"videoId"`
	Title      string `json:"title"`
	Thumbnail  string `json:"thumbnail"`
	Definition string `json:"definition"`
}

func getYoutubeService() (*youtube.Service, error) {
	youtubeDataApiKey := os.Getenv("YOUTUBE_DATA_API_KEY")
	httpClient := &http.Client{
		Transport: &transport.APIKey{
			Key: youtubeDataApiKey,
		},
	}
	service, err := youtube.New(httpClient)
	if err != nil {
		return nil, err
	}
	return service, nil
}

type YoutubeService struct {
	service *youtube.Service
}

func NewYoutubeService() (*YoutubeService, error) {
	service, err := getYoutubeService()
	if err != nil {
		return nil, err
	}
	return &YoutubeService{service}, nil
}

func getVideoDetails(data *youtube.VideoListResponse) YoutubeVideoDetail {
	videoId := data.Items[0].Id
	title := data.Items[0].Snippet.Title
	thumbnail := data.Items[0].Snippet.Thumbnails.Default.Url
	// definition := data.Items[0].ContentDetails.Definition
	return YoutubeVideoDetail{
		VideoId:    videoId,
		Title:      title,
		Definition: "",
		Thumbnail:  thumbnail,
	}
}

func (ytService *YoutubeService) GetYoutubeVideoDetails(videoURL string, part []string) (YoutubeVideoDetail, error) {
	// parse video id from the URL
	u, err := url.Parse(videoURL)
	if err != nil {
		return YoutubeVideoDetail{}, err
	}
	videoId := u.Query().Get("v")
	data, err := ytService.service.Videos.List(part).Id(videoId).Do()
	if err != nil {
		return YoutubeVideoDetail{}, err
	}
	return getVideoDetails(data), nil
}
