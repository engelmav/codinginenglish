def print_menu(pizza, sandwich, coca_cola, beer):
    print("Pizza:", pizza)
    print("Sandwich:", sandwich)
    print("Coca Cola:", coca_cola)
    print("Beer:", beer)


print_menu(1.55, 2.50, .99, 2.11)



menu = {
    "Beer": 2.11,
    "Coca Cola": .99,
    "Sandwich": 2.50,
    "Pizza": 1.55
}


# Good practice to return values from functions
def price_of(menu_item):
    price = menu[menu_item]
    return f"The price of {menu_item} is {price}"


def test_price_of_menu():
    assert price_of("Pizza") == "The price of Pizza is 1.55"


salaries = {
    "manager": 45000,
    "chef": 50000,
    "waiter": 40000
}


salaries["manager"]
salaries["chef"]