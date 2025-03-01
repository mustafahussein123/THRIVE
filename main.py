from fastapi import FastAPI
from api.piloterr import get_apartments
from api.cost_of_living import get_cost_of_living
from api.census import get_income_by_county
from api.healthcare import get_healthcare_data
from scripts.decision_tree import decision_tree

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to Thrive API"}

@app.get("/search")
def search(city: str, state: str, max_price: int):
    return {"apartments": get_apartments(city, state, max_price)}

@app.get("/cost-of-living")
def cost_of_living(city: str, country: str):
    return {"cost_of_living": get_cost_of_living(city, country)}

@app.get("/income")
def income(state: str):
    return {"income_data": get_income_by_county(state)}

@app.get("/healthcare")
def healthcare():
    return {"healthcare": get_healthcare_data("crucial-citron-452322-p8", "us-central1")}

@app.post("/recommend")
def recommend(user_input: dict):
    return {"recommendation": decision_tree(user_input)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
