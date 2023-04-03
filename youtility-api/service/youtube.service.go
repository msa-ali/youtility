package service

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"

	"github.com/Altamashattari/youtility/logger"
	ytd "github.com/kkdai/youtube/v2"
	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
)

type YoutubeMediaFormat struct {
	ItagNo       int    `json:"itag"`
	QualityLabel string `json:"qualityLabel"`
	AudioQuality string `json:"audioQuality"`
	MimeType     string `json:"mimeType"`
}

type YoutubeVideoDetail struct {
	VideoId   string               `json:"videoId"`
	Title     string               `json:"title"`
	Thumbnail string               `json:"thumbnail"`
	Duration  int64                `json:"duration"`
	Formats   []YoutubeMediaFormat `json:"formats"`
}

const (
	VIDEO_MIME_TYPE = "video/mp4"
	AUDIO_MIME_TYPE = "audio/mp4"
)

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

func extractVideoIdFromURL(videoURL string, param string) (videoId string, err error) {
	u, err := url.Parse(videoURL)
	if err != nil {
		return "", err
	}
	videoId = u.Query().Get(param)
	return
}

func getMimeType(f ytd.Format) string {
	mimeType := strings.Split(f.MimeType, ";")[0]
	return mimeType
}

func filterFormats(video *ytd.Video) []YoutubeMediaFormat {
	var filteredFormats []ytd.Format
	unique := make(map[string]bool)
	for _, f := range video.Formats {
		mimeType := getMimeType(f)
		if mimeType == VIDEO_MIME_TYPE || mimeType == AUDIO_MIME_TYPE {
			key := fmt.Sprintf("%s|%s", f.QualityLabel, mimeType)
			if _, found := unique[key]; !found {
				unique[key] = true
				filteredFormats = append(filteredFormats, f)
			}
		}
	}

	var formats []YoutubeMediaFormat
	for _, format := range filteredFormats {
		formats = append(formats, YoutubeMediaFormat{
			ItagNo:       format.ItagNo,
			QualityLabel: format.QualityLabel,
			AudioQuality: format.AudioQuality,
			MimeType:     format.MimeType,
		})
	}
	return formats
}

func getAvailableFormats(videoId string, client ytd.Client) ([]YoutubeMediaFormat, error) {
	video, err := client.GetVideo(videoId)
	if err != nil {
		return nil, err
	}
	return filterFormats(video), nil
}

func getVideoDetails(data *youtube.VideoListResponse) (*[]YoutubeVideoDetail, error) {
	var videos []YoutubeVideoDetail
	if len(data.Items) == 0 {
		return nil, errors.New("content not found")
	}
	client := ytd.Client{}
	for _, video := range data.Items {
		formats, _ := getAvailableFormats(video.Id, client)
		videos = append(videos, YoutubeVideoDetail{
			VideoId:   video.Id,
			Title:     video.Snippet.Title,
			Thumbnail: video.Snippet.Thumbnails.Medium.Url,
			Duration:  0, //video.ContentDetails.Duration,
			Formats:   formats,
		})
	}
	return &videos, nil
}

func (ytService *YoutubeService) GetYoutubeVideoDetailsUsingYoutubeDataAPI(videoURL string, part []string) (*[]YoutubeVideoDetail, error) {
	// parse video id from the URL
	videoId, err := extractVideoIdFromURL(videoURL, "v")
	if err != nil {
		return nil, err
	}
	data, err := ytService.service.Videos.List(part).Id(videoId).Do()
	if err != nil {
		return nil, err
	}
	videos, err := getVideoDetails(data)
	if err != nil {
		return nil, err
	}
	return videos, nil
}

func (ytService *YoutubeService) GetYoutubePlaylistDetails(playlistUrl string) (*[]YoutubeVideoDetail, error) {
	client := ytd.Client{}
	p, err := client.GetPlaylist(playlistUrl)
	if err != nil {
		return nil, err
	}
	var wg sync.WaitGroup
	var res = make([]YoutubeVideoDetail, len(p.Videos))
	for i, video := range p.Videos {
		wg.Add(1)
		go func(i int, video *ytd.PlaylistEntry) {
			formats, _ := getAvailableFormats(video.ID, client)
			res[i] = YoutubeVideoDetail{
				VideoId:   video.ID,
				Title:     video.Title,
				Formats:   formats,
				Thumbnail: video.Thumbnails[0].URL,
				Duration:  video.Duration.Milliseconds(),
			}

			defer wg.Done()
		}(i, video)
	}
	wg.Wait()
	return &res, nil
}

func (ytService *YoutubeService) GetYoutubePlaylistDetailsUsingYoutubeDataAPI(playlistUrl string) (*[]YoutubeVideoDetail, error) {
	playlistId, err := extractVideoIdFromURL(playlistUrl, "list")
	if err != nil {
		return nil, err
	}
	playlistItemsCall := ytService.
		service.
		PlaylistItems.
		List([]string{"snippet"}).
		PlaylistId(playlistId).
		MaxResults(50)

	var allVideos []*youtube.PlaylistItem

	for {
		playlistItemsResponse, err := playlistItemsCall.Do()
		if err != nil {
			panic(err)
		}
		allVideos = append(allVideos, playlistItemsResponse.Items...)
		nextPageToken := playlistItemsResponse.NextPageToken
		if nextPageToken == "" {
			break
		}
		playlistItemsCall.PageToken(nextPageToken)
	}
	var wg sync.WaitGroup
	var res []YoutubeVideoDetail
	for _, item := range allVideos {
		wg.Add(1)
		func(item *youtube.PlaylistItem) {
			defer wg.Done()
			videoResponse, err := ytService.service.Videos.
				List([]string{"snippet", "contentDetails"}).
				Id(item.Snippet.ResourceId.VideoId).Do()
			if err != nil {
				return
			}
			data, err := getVideoDetails(videoResponse)
			if err != nil {
				return
			}
			res = append(res, *data...)
		}(item)
	}
	wg.Wait()
	return &res, nil
}

func (ytService *YoutubeService) GetYoutubeVideoDetails(videoURL string, part []string) (*[]YoutubeVideoDetail, error) {
	client := ytd.Client{}
	videoId, err := extractVideoIdFromURL(videoURL, "v")
	if err != nil {
		logger.Error("Error while extracting video id from url: " + err.Error())
		return nil, err
	}
	video, err := client.GetVideo(videoId)
	if err != nil {
		logger.Error("Error while extracting video by videoId: " + err.Error())
		return nil, err
	}
	formats := filterFormats(video)
	videoDetail := YoutubeVideoDetail{
		VideoId:   video.ID,
		Title:     video.Title,
		Formats:   formats,
		Thumbnail: video.Thumbnails[len(video.Thumbnails)-1].URL,
		Duration:  video.Duration.Milliseconds(),
	}
	return &[]YoutubeVideoDetail{videoDetail}, nil
}

func DownloadYoutubeVideo(w http.ResponseWriter, videoURL string, iTagNo int) error {

	errHandler := func(err error) error {
		logger.Error("Error copying video data: %v" + err.Error())
		return err
	}

	client := ytd.Client{}
	videoId, err := extractVideoIdFromURL(videoURL, "v")
	if err != nil {
		logger.Error("Error while extracting video id from url: " + err.Error())
		return err
	}
	video, err := client.GetVideo(videoId)

	if err != nil {
		return errHandler(err)
	}
	format := video.Formats.FindByItag(iTagNo)
	stream, _, err := client.GetStream(video, format)

	if err != nil {
		return errHandler(err)
	}
	w.Header().Set("Content-Type", format.MimeType)
	var filename string
	if getMimeType(*format) == VIDEO_MIME_TYPE {
		filename = fmt.Sprintf("filename=%s.%s", video.Title, "mp4")
	} else {
		filename = fmt.Sprintf("filename=%s.%s", video.Title, "mp3")
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; %s", filename))

	bufferSize := 1024 * 1000 // 2MB buffer size
	buffer := make([]byte, bufferSize)

	_, err = io.CopyBuffer(w, stream, buffer)
	if err != nil {
		return errHandler(err)
	}

	logger.Info("Video downloaded successfully!\n")
	return nil
}
