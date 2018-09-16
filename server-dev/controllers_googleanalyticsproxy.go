package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
)

// recaptcha confirmation
func googleanalyticsproxy(w http.ResponseWriter, r *http.Request) {

	// Part 1 - Get Source Remote IP Address
	w.Header().Set("Content-Type", "application/json")
	// var thisipaddress = strings.Split(r.RemoteAddr, ":")
	// body1, _ := json.Marshal(map[string]string{
	// 	"addr": thisipaddress[0],
	// 	"path": r.URL.Path,
	// })
	// fmt.Println("Remote IP Address", thisipaddress[0])

	url := "https://www.google-analytics.com"
	if "" != os.Getenv("URL") {
		url = os.Getenv("URL")
	}
	log.Printf("Target %s.", url)
	resp, err := http.Get(url + "/analytics.js")
	if err != nil {
		log.Fatal(err.Error())
	}
	defer resp.Body.Close()
	body2, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err.Error())
	}
	// println("You are " + string(body2))

	// Part 2 - proxying requests from /api/analytics to www.google-analytics.com.

	//
	// proxyReqPathResolver: function (req) {
	//       return r.URL.Path + (r.URL.Path.indexOf("?") === -1 ? "?" : "&") + "uip=" + UrlEncoded(thisipaddress[0]);
	//   }
	//
	//
	w.Write(body2)

}

func UrlEncoded(str string) (string, error) {
	u, err := url.Parse(str)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}

func indexOf(element string, data []string) int {
	for k, v := range data {
		if element == v {
			return k
		}
	}
	return -1 //not found.
}
