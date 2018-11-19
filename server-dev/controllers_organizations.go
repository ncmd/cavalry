package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func c_organizations_account_leave_organization_in_firebase(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		sa := option.WithCredentialsFile("./firestore.json")
		app, err := firebase.NewApp(context.Background(), nil, sa)
		if err != nil {
			fmt.Println(err)
		}
		client, err := app.Firestore(context.Background())
		if err != nil {
			fmt.Println(err)
		}

		var organization Organization
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&organization)
		if err != nil {
			fmt.Println(err)
		}

		_, err = client.Collection("accounts").Doc(organization.AccountId).Set(context.Background(), map[string]interface{}{
			"organizationname":   "",
			"organizationmember": false,
		}, firestore.MergeAll)
		if err != nil {
			fmt.Println(err)
		}
	}
}

func c_organizations_account_add_organization_in_firebase(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		sa := option.WithCredentialsFile("./firestore.json")
		app, err := firebase.NewApp(context.Background(), nil, sa)
		if err != nil {
			fmt.Println(err)
		}
		client, err := app.Firestore(context.Background())
		if err != nil {
			fmt.Println(err)
		}

		var organization Organization
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&organization)
		if err != nil {
			fmt.Println(err)
		}

		_, err = client.Collection("accounts").Doc(organization.AccountId).Set(context.Background(), map[string]interface{}{
			"organizationname":   organization.Name,
			"organizationmember": true,
		}, firestore.MergeAll)
		if err != nil {
			fmt.Println(err)
		}

		// get existing members in organization
		// dsnap, err := client.Collection("organizations").Doc(organization.Name).Get(context.Background())
		// if err != nil {
		// 	fmt.Println(err)
		// }
		// m := dsnap.Data()
		//
		// fmt.Printf("Document data: %#v\n", m)

		// add to array of previous members

		// update 'members' array in document with new users

	}
}

func c_organizations_check_if_organization_exists_in_firebase(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		sa := option.WithCredentialsFile("./firestore.json")
		app, err := firebase.NewApp(context.Background(), nil, sa)
		if err != nil {
			fmt.Println(err)
		}
		client, err := app.Firestore(context.Background())
		if err != nil {
			fmt.Println(err)
		}

		var organization Organization
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&organization)
		if err != nil {
			panic(err)
		}

		dsnap, err := client.Collection("organizations").Doc(organization.Name).Get(context.Background())
		if err != nil {
			fmt.Println("Organization Available.... return w.Write that organization is available")
			response := PingPong{"available"}
			js, err := json.Marshal(response)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write(js)
		} else {
			m := dsnap.Data()
			fmt.Println("Organization Exists.... not creating, return w.Write that organization exists", m)
			response := PingPong{"exists"}
			js, err := json.Marshal(response)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write(js)
		}

	}
}

func c_organizations_create_orgnaization_in_firebase(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		sa := option.WithCredentialsFile("./firestore.json")
		app, err := firebase.NewApp(context.Background(), nil, sa)
		if err != nil {
			fmt.Println(err)
		}
		client, err := app.Firestore(context.Background())
		if err != nil {
			fmt.Println(err)
		}

		var organization Organization
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&organization)
		if err != nil {
			panic(err)
		}

		_, err = client.Collection("organizations").Doc(organization.Name).Set(context.Background(), map[string]interface{}{
			"organizationid":    organization.Name,
			"organizationname":  organization.Name,
			"organizationadmin": organization.AccountId,
			"organizationmembers": []interface{}{
				map[string]interface{}{
					"emailaddress": organization.Email,
					"accountid":    organization.AccountId,
					"status":       "active",
					"department":   "any",
				},
			},
			"organizationactivity": []interface{}{},
		})
		if err != nil {
			fmt.Println(err)
		}

	}

}
