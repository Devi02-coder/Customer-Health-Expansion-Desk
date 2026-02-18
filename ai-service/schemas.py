from pydantic import BaseModel

class ChurnRequest(BaseModel):
    usage_score: float
    support_tickets: int
    avg_resolution_time: float
    payment_delay_days: int
    nps_score: float
    contract_months_left: int

class ChurnResponse(BaseModel):
    churn_probability: float
    risk_level: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    disabled: bool = None
