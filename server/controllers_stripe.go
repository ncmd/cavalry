package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
	"github.com/stripe/stripe-go/plan"
	"github.com/stripe/stripe-go/product"
	"github.com/stripe/stripe-go/sub"
)

// //Experiment with Main
// func main() {
// 	// Only create 1 place with 1 service
// 	attachPlan(createService("1_month_service"), "1_month_plan", 3500)
//
// 	// // Product: prod_DNsVWKlAzjtCEu
// 	// // Plan: plan_DNsV7QMhFmBH10
// 	// var monthlyService = "plan_DNrnS35z2a1m2z"
// 	// var emailAddress = "test1@gmail.com"
// 	//
// 	// 	// You can have many customers
// 	// 	var newCustomer = createCustomer(createSource(emailAddress))
// 	// 	// Subscribe Customer
// 	// 	newSubscriber(newCustomer, monthlyService)
// }

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
		log.Println("User Source:", user.Source)
		log.Println("User Plan:", user.Plan)
		if user.Plan == "1month" {
			log.Println("Selected 1 Month!")
			newSubscriber1Month(createCustomer(user.Email, user.Source))
		} else if user.Plan == "12months" {
			log.Println("Selected 12 Months!")
			newSubscriber12Months(createCustomer(user.Email, user.Source))
		} else if user.Plan == "beta" {
			log.Println("Selected Beta!")
			newSubscriberBeta(createCustomer(user.Email, user.Source))
		} else {
			log.Println("No Plan Selected...")
		}

	}
}

func newSubscriberBeta(customer string) {
	messages := make(chan string, 2)
	messages <- customer
	time.Sleep(time.Second * 5)
	subscribeCustomer(<-messages, "plan_DZt53EC6P7W3aH")
}

func newSubscriber1Month(customer string) {
	messages := make(chan string, 2)
	messages <- customer
	time.Sleep(time.Second * 5)
	subscribeCustomer(<-messages, "plan_DZlhSuoCUAGlEL")
}

func newSubscriber12Months(customer string) {
	messages := make(chan string, 2)
	messages <- customer
	time.Sleep(time.Second * 5)
	subscribeCustomer(<-messages, "plan_DZljpBH03blVLR")
}

// Creates a Service;
// This should only be created for the first 3 plans (1m, 12m, lifetime)
func createService(serviceName string) string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.ProductParams{
		Name: stripe.String(serviceName),
		Type: stripe.String(string(stripe.ProductTypeService)),
	}
	prod, _ := product.New(params)
	fmt.Println("Product:", prod.ID)
	return prod.ID
}

// Creates a Attach Payment plan for service
func attachPlan(productID string, planNickname string, planAmount int64) string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.PlanParams{
		ProductID: stripe.String(productID),
		Nickname:  stripe.String(planNickname),
		Interval:  stripe.String(string(stripe.PlanIntervalMonth)),
		Currency:  stripe.String("usd"),
		Amount:    stripe.Int64(planAmount),
	}
	// Amount 1000 = $10.00
	p, err := plan.New(params)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Plan:", p.ID)
	return p.ID
}

// func chargeCustomer(customer string, source string) {
// 	stripe.Key = config.StripeTestSecretKey
//
// 	chargeParams := &stripe.ChargeParams{
// 		Amount:   stripe.Int64(3500),
// 		Currency: stripe.String(string(stripe.CurrencyUSD)),
// 		Customer: stripe.String(customer),
// 	}
// 	chargeParams.SetSource(source)
// 	ch, err := charge.New(chargeParams)
// 	return ch.ID
// }

func createCustomer(emailaddress string, source string) string {
	stripe.Key = config.StripeTestSecretKey
	fmt.Println("Customer email", emailaddress, source)
	customerParams := &stripe.CustomerParams{
		Email: stripe.String(emailaddress),
	}
	customerParams.SetSource(source)
	c, _ := customer.New(customerParams)
	return c.ID

}

func subscribeCustomer(customer string, plan string) {
	stripe.Key = config.StripeTestSecretKey

	items := []*stripe.SubscriptionItemsParams{
		{
			Plan: stripe.String(plan),
		},
	}
	params := &stripe.SubscriptionParams{
		Customer: stripe.String(customer),
		Items:    items,
	}
	subscription, _ := sub.New(params)
	fmt.Println("Subscription:", subscription)
	// sendInvoice(customer, plan)

}

func sendInvoice(customer string, plan string) {
	stripe.Key = config.StripeTestSecretKey

	items := []*stripe.SubscriptionItemsParams{
		{Plan: stripe.String(plan)},
	}
	params := &stripe.SubscriptionParams{
		Customer:     stripe.String(customer),
		Items:        items,
		Billing:      stripe.String(string(stripe.InvoiceBillingSendInvoice)),
		DaysUntilDue: stripe.Int64(30),
	}
	subscription, _ := sub.New(params)
	fmt.Println("Subscription:", subscription)
}
