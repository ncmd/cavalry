package main

import (
	"fmt"
	"log"
	"time"

	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
	"github.com/stripe/stripe-go/plan"
	"github.com/stripe/stripe-go/product"
	"github.com/stripe/stripe-go/source"
	"github.com/stripe/stripe-go/sub"
)

//func main() {
//	// Only create 1 place with 1 service
//	attachPlan(createService())

// Product: prod_DNsVWKlAzjtCEu
// Plan: plan_DNsV7QMhFmBH10
//var monthlyService = "plan_DNrnS35z2a1m2z"
//var emailAddress = "test1@gmail.com"
//
//	// You can have many customers
//	var newCustomer = createCustomer(createSource(emailAddress))
//
//	// Subscribe Customer
//	newSubscriber(newCustomer, monthlyService)
//}

func newSubscriber(customer string) {
	// Here we `make` a channel of strings buffering up to
	// 2 values.
	messages := make(chan string, 2)

	// Because this channel is buffered, we can send these
	// values into the channel without a corresponding
	// concurrent receive.
	messages <- customer
	time.Sleep(time.Second * 5)

	// Later we can receive these two values as usual.
	subscribeCustomer(<-messages, "plan_DNsV7QMhFmBH10")
}

func createService() string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.ProductParams{
		Name: stripe.String("Cavalry Subscription"),
		Type: stripe.String(string(stripe.ProductTypeService)),
	}
	prod, _ := product.New(params)
	fmt.Println("Product:", prod.ID)

	return prod.ID
}

func attachPlan(prod string) string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.PlanParams{
		ProductID: stripe.String(prod),
		Nickname:  stripe.String("Cavalry Subscription Plan"),
		Interval:  stripe.String(string(stripe.PlanIntervalMonth)),
		Currency:  stripe.String("usd"),
		Amount:    stripe.Int64(1000),
	}
	p, err := plan.New(params)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Plan:", p.ID)
	return p.ID
}

//src_1Cwj8KDycnK884dHBLz2dUO0
func createSource(emailaddress string) string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.SourceObjectParams{
		Type:     stripe.String("ach_credit_transfer"),
		Currency: stripe.String(string(stripe.CurrencyUSD)),
		Owner: &stripe.SourceOwnerParams{
			Email: stripe.String(emailaddress),
		},
	}
	s, err := source.New(params)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Source:", s.ID)

	return s.ID
}

//cus_DNU7cdW15Eu6jc
func createCustomer(customerName string, token string) string {
	stripe.Key = config.StripeTestSecretKey

	params := &stripe.CustomerParams{
		Email:          stripe.String(customerName),
		AccountBalance: stripe.Int64(-10),
		Description:    stripe.String("Customer Subscription"),
	}
	params.SetSource(token)
	cus, _ := customer.New(params)
	fmt.Println("Customer:", cus.ID)

	//subscribeCustomer(cus.ID,plan)
	return cus.ID

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
	sendInvoice(customer, plan)

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
