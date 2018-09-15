package main

import (
	"fmt"
)

// <<<<<<<<<<<< Email >>>>>>>>>>>>>

func sendEmail(email string, password string) {

	subject := "[Cavalry] Welcome to Cavalry! 🐎️"
	destination := email
	r := NewRequest([]string{destination}, subject)
	r.Send("emailtemplates/cavalrysubscriptionwelcome.html", map[string]string{"customername": email, "password": password})
	fmt.Printf("Email: %s", email)

}
