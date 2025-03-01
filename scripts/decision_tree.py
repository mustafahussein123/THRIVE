def decision_tree(user_input):
    """Generate recommendations based on user responses."""
    if user_input["purpose"] == "Rent":
        if user_input["income"] < 50000:
            return "We recommend checking affordable apartments in lower-cost cities."
        elif user_input["income"] > 100000:
            return "Consider prime locations with better amenities."
    
    if user_input["healthcare_needed"]:
        return "Look for locations with high-quality medical facilities."

    return "Based on your inputs, we recommend checking locations with low crime and good transit."

if __name__ == "__main__":
    user = {"purpose": "Rent", "income": 60000, "healthcare_needed": True}
    print(decision_tree(user))
