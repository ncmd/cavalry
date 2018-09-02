package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go"
	"google.golang.org/api/option"
)

// hello world
func helloworld(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	fmt.Fprintln(w, "Hello, World!")
}

// check server uptime
func pingpong(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	response := PingPong{"pong"}

	js, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(js)
}

// get last 10 posts
func getlast10posts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")

	app, err := firebase.NewApp(context.Background(), nil, sa)

	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	if r.Method != "OPTIONS" {
		dsnap, err := client.Collection("aggregation").Doc("posts").Get(context.Background())
		if err != nil {
			fmt.Printf("Error: %#v\n", err)
		}
		m := dsnap.Data()

		last10 := m["last10"]

		js, err := json.MarshalIndent(last10, "", "    ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

func getpost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")

	app, err := firebase.NewApp(context.Background(), nil, sa)

	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	if r.Method != "OPTIONS" {
		var post Post

		log.Println("Response Body:", r.Method)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&post)

		var postID = strings.Split(r.URL.Path, "/")

		dsnap, err := client.Collection("posts").Doc(postID[3]).Get(context.Background())
		if err != nil {
			fmt.Printf("Error: %#v\n", err)
		}
		m := dsnap.Data()
		fmt.Println(m)

		// last10 := m["last10"]
		//
		js, err := json.MarshalIndent(m, "", "    ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

// get last 10 posts
func addpost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")
	app, err := firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	var post Post
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&post)
	if err != nil {
		panic(err)
	}
	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		ref := client.Collection("posts").NewDoc()
		_, err := ref.Set(context.Background(), map[string]interface{}{
			"id":          ref.ID,
			"title":       post.Title,
			"description": post.Description,
			"tags":        post.Tags,
			"objectives":  post.Objectives,
		})
		if err != nil {
			fmt.Println(err)
		}
		log.Println("Added Post!")
	}

}

func updatepost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")
	app, err := firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	var post Post
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&post)
	if err != nil {
		panic(err)
	}
	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		// Get a new write batch.
		batch := client.Batch()

		// Set the value
		ref := client.Collection("posts").Doc(post.Id)
		batch.Set(ref, map[string]interface{}{
			"id":          post.Id,
			"title":       post.Title,
			"description": post.Description,
			"tags":        post.Tags,
			"objectives":  post.Objectives,
		}, firestore.MergeAll)

		// Commit the batch.
		_, err := batch.Commit(context.Background())
		if err != nil {
			return
		}
		log.Println("Updated Post!")
	}
}

// Create a list of subscribers
func addSubscriber(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")
	app, err := firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	var subscribe Subscriber
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&subscribe)
	if err != nil {
		panic(err)
	}

	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		client.Collection("subscribers").Add(context.Background(), map[string]interface{}{
			"email": subscribe.Email,
		})
		log.Println("Subscribed Email:", subscribe.Email)
	}
}

// recaptcha confirmation
func recaptchaconfirmation(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
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
	}
}

// subscribe user
func subscribeuser(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		var user User

		log.Println("Response Body:", r.Method)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&user)
		log.Println("User:", user)
		log.Println("User Email:", user.Email)
		newSubscriber(createCustomer(user.Email, createSource(user.Email)))
	}
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	log.Println("Received Request:", r.Body)
	file, err := os.Create("./result")
	if err != nil {
		panic(err)
	}
	n, err := io.Copy(file, r.Body)
	if err != nil {
		panic(err)
	}

	w.Write([]byte(fmt.Sprintf("%d bytes are recieved.\n", n)))
}

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

// <<<<<<<<<<<< Phone >>>>>>>>>>>>>
func sendNotification(phone string) {
	from := config.Email
	pass := config.Password
	to := phone

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Customer Request!\n\n" +
		"A Customer made a Request for something!"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Println("smtp error: %s", err)
		return
	}

	log.Print("Texted: ", to)
}

func send(phone string) {
	from := config.Email
	pass := config.Password
	to := phone

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Hello from Jidoka!\n\n" +
		"Thank you for your interest in my services! I will reach out to you soon! -Charles"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Println("smtp error: %s", err)
		return
	}

	log.Print("Texted: ", to)
}
