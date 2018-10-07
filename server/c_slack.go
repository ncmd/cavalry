package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// get channel id of main chatops channel
// general - CCKFY87FV

// auth0 to invite users - xoxp-429008606982-426943357728-450707168995-edba46442f52a625faa742e4e815882b

// invite user to slackchannel
// https://github.com/ErikKalkoken/slackApiDoc/blob/master/users.admin.invite.md

func c_slack_invite_new_user_to_slack_team_and_channel(emailaddress string) {

	url := "https://slack.com/api/users.admin.invite"

	payload := strings.NewReader("------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"email\"\r\n\r\n" + emailaddress + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Authorization", "Bearer xoxp-429008606982-426943357728-450707168995-edba46442f52a625faa742e4e815882b")
	req.Header.Add("Cache-Control", "no-cache")
	req.Header.Add("Postman-Token", "3956fdd4-6805-41f1-b601-e2bc2c5fa8ba")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}

func c_slack_sent_message_to_user_with_emailaddress(emailaddress string) {

}

// get slack userid from email address
// message userid
// include action buttons completed/yes/note

func c_slack_get_userid_from_emailaddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {

	}
}
