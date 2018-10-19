
# 1 Job, 12 Jobs (Orders API)

# Create an order with a product (good) with SKU under "Orders -> Products"
curl https://api.stripe.com/v1/orders -u sk_test_xqnP6paEkEejxd3W21OWR1wf: -d items[][type]=sku -d items[][parent]=sku_DoNhM1EGgKGLeg -d currency=usd -d customer=cus_DoNdZq7RYqzIvv

# Pay an order
curl https://api.stripe.com/v1/orders/or_1DMkwcCsEkoLODTofLzaZ9uU/pay -u sk_test_xqnP6paEkEejxd3W21OWR1wf: -d source=tok_visa

# Retrieve an order
curl https://api.stripe.com/v1/orders/or_1DMkwcCsEkoLODTofLzaZ9uU  -u sk_test_xqnP6paEkEejxd3W21OWR1wf:




# Unlimited Jobs (Subscriptions API)

curl https://api.stripe.com/v1/subscriptions -u sk_test_xqnP6paEkEejxd3W21OWR1wf: -d items[][plan]=plan_DoNu8JmqFRMrze -d customer=cus_DoNdZq7RYqzIvv