import os
import csv
import io
import time
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel
import joblib
import numpy as np
from schemas import ChurnRequest, ChurnResponse, Token
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table
from reportlab.lib.styles import getSampleStyleSheet
from apscheduler.schedulers.background import BackgroundScheduler

# Configuration
SECRET_KEY = "your-deepmind-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="CHED AI - Central Intelligence & Export Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Automation: APScheduler for Weekly Reports ---
def generate_weekly_summary():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] CHED_AUTO_REPORT: Generating weekly executive health summary...")
    # Logic to generate and save/email report would go here
    pass

scheduler = BackgroundScheduler()
scheduler.add_job(generate_weekly_summary, 'cron', day_of_week='mon', hour=9, id='weekly_ched_report')
scheduler.start()

# --- Security: JWT Revocation & Rate Limiting (Demo logic) ---
blacklisted_tokens = set()
rate_limit_store = {} # {ip: [timestamps]}

# Simplified for Demo
def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

# Mock user for JWT demo
USER_DB = {
    "ched_agent": {
        "username": "ched_agent",
        "hashed_password": "antigravity_secret_7788",
        "role": "Super Admin",
        "permissions": ["VIEW_HEALTH", "PREDICT_CHURN", "EXPORT_DATA"]
    }
}

# --- Middleware: Rate Limiting ---
@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()
    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = []
    
    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if now - t < 60]
    if len(rate_limit_store[client_ip]) >= 100:
        raise HTTPException(status_code=429, detail="Too many requests. Rate limit exceeded.")
    
    rate_limit_store[client_ip].append(now)
    return await call_next(request)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token in blacklisted_tokens:
        raise HTTPException(status_code=401, detail="Token revoked. Please login again.")
        
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = USER_DB.get(username)
    if user is None:
        raise credentials_exception
    return user

def role_required(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Unified Security Protocol Breach"
            )
        return current_user
    return role_checker

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = USER_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- AI Core: Health & Expansion Engines ---

class HealthMetrics(BaseModel):
    usage: float  # 0-100
    support: float # 0-100
    nps: float    # 0-10
    billing: float # 0-100

class ExpansionMetrics(BaseModel):
    health: float
    usage: float
    plan_utilization: float
    nps: float
    tenure: int # months

@app.post("/api/health/calculate")
async def calculate_health(metrics: HealthMetrics):
    # Logic: Usage (0.35), Support (0.25), NPS (0.2), Billing (0.2)
    # Convert NPS to 0-100 scale (NPS * 10)
    score = (metrics.usage * 0.35) + (metrics.support * 0.25) + ((metrics.nps * 10) * 0.2) + (metrics.billing * 0.2)
    
    status = "Healthy" if score >= 80 else "At Risk" if score >= 50 else "Churn Risk"
    
    reasons = []
    if metrics.usage < 40: reasons.append("Low product engagement detected")
    if metrics.support < 50: reasons.append("High unresolved support friction")
    if metrics.nps < 7: reasons.append("Weak customer sentiment (NPS)")
    if metrics.billing < 60: reasons.append("Frequent billing delinquency/delays")

    return {
        "score": round(score, 1),
        "status": status,
        "explanation": {
            "reasons": reasons,
            "summary": f"Entity is flagged as {status} with a certainty of {round(score, 1)}%."
        }
    }

@app.post("/api/expansion/predict")
async def predict_expansion(metrics: ExpansionMetrics):
    # Logic: Health (0.30), Usage (0.25), Plan Utilization (0.20), NPS (0.15), Tenure (0.10)
    score = (metrics.health * 0.30) + (metrics.usage * 0.25) + (metrics.plan_utilization * 0.20) + ((metrics.nps * 10) * 0.15) + (min(metrics.tenure, 24) * 0.10 * 4.16)
    
    label = "Upsell" if score >= 80 else "Cross-sell" if score >= 60 else "Referral" if score >= 50 else "Not Ready"
    
    reasons = []
    if metrics.health > 80: reasons.append("Elite customer health signature")
    if metrics.usage > 75: reasons.append("High feature adoption density")
    if metrics.plan_utilization > 85: reasons.append("Entity nearing platform quota limits")
    
    return {
        "expansion_score": round(score, 1),
        "type": label,
        "explanation": {
            "reasons": reasons,
            "summary": f"Customer is {label}-ready due to {', '.join(reasons) if reasons else 'stable performance'}."
        }
    }

@app.get("/api/ai/explain-health/{customer_id}")
async def explain_health(customer_id: int):
    # Mock explainability response
    return {
        "customer_id": customer_id,
        "primary_risk": "Low Login Frequency",
        "impact_score": "High",
        "ai_prediction": "Entity likely to churn in Q3 if no playbook is deployed.",
        "confidence": 0.942,
        "shap_values": {
            "usage": -12.5,
            "support": +4.2,
            "nps": -8.1,
            "billing": +1.5
        }
    }

# --- Export Module: PDF & CSV Generation ---
@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    blacklisted_tokens.add(token)
    return {"message": "Successfully logged out and token invalidated."}

@app.post("/predict-churn", response_model=ChurnResponse)
async def predict_churn(data: ChurnRequest, current_user: dict = Depends(get_current_user)):
    # Simulation based on real seeded values
    risk_score = (data.payment_delay_days * 0.1) + (data.support_tickets * 0.15) \
                 - (data.usage_score * 0.005) - (data.nps_score * 0.005) \
                 + (1 / max(1, data.contract_months_left) * 0.2)
    churn_prob = max(0, min(0.99, risk_score + 0.1))
    risk = "High" if churn_prob > 0.7 else "Medium" if churn_prob > 0.4 else "Low"
    
    return {
        "churn_probability": round(float(churn_prob), 4),
        "risk_level": risk
    }

from scheduler.report_job import send_weekly_report
from apscheduler.schedulers.background import BackgroundScheduler

# Initialize Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(send_weekly_report, "cron", day_of_week="mon", hour=9)
scheduler.start()

# --- Export Module Implementation ---

@app.get("/export/csv")
async def export_csv():
    # Mock data as specified in requirement
    data = [
        {"customer": "EcoFlow", "health_score": 82, "status": "Healthy", "expansion": "Upsell", "confidence": "91%"},
        {"customer": "Pulse AI", "health_score": 48, "status": "Churn Risk", "expansion": "N/A", "confidence": "40%"},
        {"customer": "Gamma Labs", "health_score": 65, "status": "Stable", "expansion": "Cross-sell", "confidence": "75%"},
        {"customer": "SolarTech", "health_score": 92, "status": "Elite", "expansion": "Referral", "confidence": "98%"},
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    output.seek(0)

    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ched_health_export.csv"}
    )

@app.get("/export/streaming-large")
async def export_streaming():
    """Streaming export to handle millions of rows without memory overhead."""
    def generator():
        yield "ENTITY,HEALTH_SCORE,STATUS,UTILIZATION\n"
        for i in range(100): # Small sample for demo, can be 1M+
            yield f"Project_{i},{70+(i%30)},{'Stable' if i%2 else 'At-Risk'},{50+(i%45)}%\n"

    return StreamingResponse(
        generator(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ched_massive_dump.csv"}
    )

@app.get("/export/pdf")
async def export_pdf():
    file_path = "ched_governance_report.pdf"
    
    data = [
        ["ENTITY", "HEALTH_SCORE", "STATUS", "EXPANSION_OPP"],
        ["EcoFlow", "82", "Healthy", "Upsell"],
        ["Pulse AI", "48", "Churn Risk", "N/A"],
        ["Gamma Labs", "65", "Stable", "Cross-sell"],
        ["SolarTech", "92", "Elite", "Referral"]
    ]

    pdf = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("CHED: Global Governance & Health Report", styles["Title"]))
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    elements.append(Paragraph("<br/><br/>", styles["Normal"]))
    elements.append(Table(data))

    pdf.build(elements)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="ched_governance_report.pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
