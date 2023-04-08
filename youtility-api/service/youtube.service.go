package service

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"

	"github.com/Altamashattari/youtility/logger"
	ytd "github.com/kkdai/youtube/v2"
	"google.golang.org/api/youtube/v3"
)

type YoutubeMediaFormat struct {
	ItagNo          int    `json:"itag"`
	QualityLabel    string `json:"qualityLabel"`
	AudioQuality    string `json:"audioQuality"`
	MimeType        string `json:"mimeType"`
	HasAudioChannel bool   `json:"hasAudioChannel"`
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

type YoutubeService struct {
	service *youtube.Service
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
			ItagNo:          format.ItagNo,
			QualityLabel:    format.QualityLabel,
			AudioQuality:    format.AudioQuality,
			MimeType:        format.MimeType,
			HasAudioChannel: format.AudioChannels > 0,
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

func (ytService *YoutubeService) GetYoutubeVideoDetails(videoId string) (*[]YoutubeVideoDetail, error) {
	client := ytd.Client{}
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

func DownloadYoutubeVideo(w http.ResponseWriter, videoId string, iTagNo int) error {

	errHandler := func(err error) error {
		logger.Error("Error copying video data: %v" + err.Error())
		return err
	}

	client := ytd.Client{}
	video, err := client.GetVideo(videoId)

	if err != nil {
		return errHandler(err)
	}
	format := video.Formats.FindByItag(iTagNo)
	stream, contentLength, err := client.GetStream(video, format)

	if err != nil {
		return errHandler(err)
	}
	w.Header().Set("Content-Type", format.MimeType)
	w.Header().Set("Content-Length", fmt.Sprint(contentLength))
	var filename string
	if getMimeType(*format) == VIDEO_MIME_TYPE {
		filename = fmt.Sprintf("filename=%s.%s", video.Title, "mp4")
	} else {
		filename = fmt.Sprintf("filename=%s.%s", video.Title, "mp3")
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; %s", filename))

	bufferSize := 1024 * 1000 // 1 mb buffer size
	buffer := make([]byte, bufferSize)

	_, err = io.CopyBuffer(w, stream, buffer)
	if err != nil {
		return errHandler(err)
	}

	logger.Info("Video downloaded successfully!\n")
	return nil
}
