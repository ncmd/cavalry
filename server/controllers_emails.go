package main

import (
	"fmt"
)

// <<<<<<<<<<<< Email >>>>>>>>>>>>>

func sendEmail(email string) {

	subject := "[Cavalry] Welcome to Cavalry! 🐎️"
	destination := email
	r := NewRequest([]string{destination}, subject)
	r.Send("emailtemplates/securitycourse.html", map[string]string{"customername": email})
	fmt.Printf("Email: %s", email)

}
