package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// recaptcha confirmation
func googleanalyticsproxy(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	// Part 1 - Get Source Remote IP Address
	w.Header().Set("Content-Type", "application/json")
	var thisipaddress = strings.Split(r.RemoteAddr, ":")
	// body1, _ := json.Marshal(map[string]string{
	// 	"addr": thisipaddress[0],
	// 	"path": r.URL.Path,
	// })
	// fmt.Println("Remote IP Address", thisipaddress[0])

	destinationhost := "https://www.google-analytics.com"
	if "" != os.Getenv("URL") {
		destinationhost = os.Getenv("URL")
	}
	ipadddress := thisipaddress[0]
	v := url.Values{}
	v.Set("uip", ipadddress)
	log.Printf("zzzz Target %s", destinationhost+r.RequestURI+"?"+v.Encode())
	log.Printf("zzzz Request Method %s", r.Method)
	log.Printf("zzzz Request URI %s", r.RequestURI)
	log.Printf("zzzz Request Body %s", r.Body)
	fmt.Println("zzzz Request Target IP: ", url.QueryEscape(ipadddress))
	fmt.Println("zzzz Encode IP: " + v.Encode())

	if r.Method == "GET" {
		log.Printf("Request is GET----")
		if strings.Index(r.RequestURI, "?") == -1 {
			fmt.Println("?")
			resp, err := http.Get(destinationhost + r.RequestURI + "?" + v.Encode())
			if err != nil {
				log.Fatal(err.Error())
			}
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Fatal(err.Error())
			}
			log.Printf("Response Body: " + string(body))
			w.Write(body)
		} else {
			fmt.Println("&")
			resp, err := http.Get(destinationhost + r.RequestURI + "&" + v.Encode())
			if err != nil {
				log.Fatal(err.Error())
			}
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Fatal(err.Error())
			}
			log.Printf("Response Body: " + string(body))
			w.Write(body)
		}
		fmt.Println("zzzz Index:", strings.Index(r.RequestURI, "?"))

	} else if r.Method == "POST" {
		log.Printf("Request is POST----")
		var jsonStr = []byte(`{"title":"Buy cheese and bread for breakfast."}`)
		resp, err := http.Post(destinationhost+r.RequestURI, "application/json", bytes.NewBuffer(jsonStr))
		if err != nil {
			log.Fatal(err.Error())
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err.Error())
		}
		log.Printf("Response Body: " + string(body))
		w.Write(body)
	}

	// body2, err := ioutil.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }
	// 	w.Write(body2)

	// println("You are " + string(body2))

	// Part 2 - proxying requests from /api/analytics to www.google-analytics.com.

	//
	// proxyReqPathResolver: function (req) {
	//       return r.URL.Path + (r.URL.Path.indexOf("?") === -1 ? "?" : "&") + "uip=" + UrlEncoded(thisipaddress[0]);
	//   }
	//
	//

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