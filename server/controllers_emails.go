package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

// <<<<<<<<<<<< Email >>>>>>>>>>>>>
var phoneProviders [8]string

func sendEmail(w http.ResponseWriter, r *http.Request) {

	phoneProviders[0] = "@message.alltel.com"
	phoneProviders[1] = "@txt.att.net"
	phoneProviders[2] = "@myboostmobile.com"
	phoneProviders[3] = "@tmomail.net"
	phoneProviders[4] = "@mms.cricketwireless.net"
	phoneProviders[5] = "@vtext.com"
	phoneProviders[6] = "@vmobl.com"
	phoneProviders[7] = "@msg.fi.google.com"

	var data Data
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&data)

	if (data.Recaptcha == "undefined") || (data.Recaptcha == "") {
		log.Println("Nothing in data.Recaptcha", data.Recaptcha)
	} else {
		log.Println("RECAPTCHA:", data.Recaptcha)

		var secretKey = config.Captchasecret

		url := "https://www.google.com/recaptcha/api/siteverify"

		payload := strings.NewReader("------WebKitFormBoundary7MA4YWxkTrZu0gW\r" +
			"\nContent-Disposition: form-data; " +
			"name=\"secret\"\r\n\r\n" + secretKey + "\r" +
			"\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r" +
			"\nContent-Disposition: form-data; name=\"response\"\r\n" +
			"\r\n" + data.Recaptcha + "\r\n" +
			"------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"remoteip\"\r\n" +
			"\r\n" + r.RemoteAddr + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--")

		req, _ := http.NewRequest("POST", url, payload)

		req.Header.Add("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW")
		req.Header.Add("Content-Type", "application/json")
		req.Header.Add("Cache-Control", "no-cache")

		response := &Response{
			Success:     false,
			ChallengeTS: time.Now().String(),
			Hostname:    "Localhost",
		}

		res, _ := http.DefaultClient.Do(req)

		defer res.Body.Close()
		body, _ := ioutil.ReadAll(res.Body)
		log.Println("RESPONSE BODY:", string(body))
		json.Unmarshal(body, &response)
		log.Println("RESPONSE RECAPTCHA:", response.Success)

		if response.Success == true {
			subject := "[Jidoka] Hello " + data.Name + "! 👋"
			destination := data.Email
			r := NewRequest([]string{destination}, subject)
			r.Send("emailtemplates/welcome.html", map[string]string{"customername": data.Name})
			for _, phone := range phoneProviders {
				go send(data.Phone + phone)
			}
			fmt.Printf("Name: %s \n Phone: %s \n Email: %s", data.Name, data.Phone, data.Email)
		}
		if response.Success == true {
			subject := "[Cavalry] Business Requested"
			destination := "cchong.vise@gmail.com"
			r := NewRequest([]string{destination}, subject)
			r.Send("emailtemplates/businessrequest.html", map[string]string{"customername": data.Name, "customerphone": data.Phone, "customeremail": data.Email})
			go sendNotification("6269915827" + "@txt.att.net")
		}
	}
}
