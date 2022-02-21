number_of_slices = "3"
pizza_slice_price = 2
tax_rate = 0.625

gross_total = pizza_slice_price * number_of_slices
net_total = tax_rate * gross_total + gross_total

print("Your total is", net_total, "dollars!")