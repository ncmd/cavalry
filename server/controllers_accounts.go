package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

// add email subscribers
func accountcreate(w http.ResponseWriter, r *http.Request) {
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

	var account Account
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&account)
	if err != nil {
		panic(err)
	}

	fmt.Println("Received Account Post", account)

	if r.Method != "OPTIONS" {
		client.Collection("accounts").Doc(account.ID).Set(context.Background(), map[string]interface{}{
			"accountid":    account.ID,
			"emailaddress": account.Email,
			"plan":         account.Plan,
		})

	}
}

// func accountcreate(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
// 	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
// 	sa := option.WithCredentialsFile("./firestore.json")
//
// 	app, err := firebase.NewApp(context.Background(), nil, sa)
//
// 	if err != nil {
// 		log.Fatalln(err)
// 	}
// 	client, err := app.Firestore(context.Background())
// 	if err != nil {
// 		log.Fatalln(err)
// 	}
// 	defer client.Close()
//
// 	if r.Method != "OPTIONS" {
// 		var account Account
//
// 		log.Println("Response Body:", r.Method)
// 		decoder := json.NewDecoder(r.Body)
// 		decoder.Decode(&account)
//
// 		// var accountID = strings.Split(r.URL.Path, "/")
// 		// fmt.Println("Account ID:", accountID)
//
// 		client.Collection("accounts").Doc(account.ID).Set(context.Background(), map[string]interface{}{
// 			"accountid": account.ID,
// 		})
//
// 		// dsnap, err := client.Collection("accounts").Doc(accountID[3]).Get(context.Background())
// 		// if err != nil {
// 		// 	fmt.Printf("Error: %#v\n", err)
// 		// }
// 		// m := dsnap.Data()
// 		// fmt.Println(m)
// 		//
// 		// // last10 := m["last10"]
// 		// //
// 		// js, err := json.MarshalIndent(m, "", "    ")
// 		// if err != nil {
// 		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
// 		// 	return
// 		// }
// 		// w.Write(js)
// 	}
// }
