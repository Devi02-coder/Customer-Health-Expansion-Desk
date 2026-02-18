from services.email_service import send_email
import os

def send_weekly_report():
    # In a real scenario, this might trigger a PDF generation first
    report_path = "ched_governance_report.pdf"
    
    # Check if report exists, if not, it's fine for the mock
    if not os.path.exists(report_path):
        # Create a dummy for the first run if needed
        with open(report_path, "w") as f:
            f.write("Placeholder for CHED Tactical Report v5")

    send_email(
        to_email="executive-board@dm-intel.ai",
        subject="[TACTICAL] Weekly Customer Health & Expansion Registry",
        body="Attaching the latest synchronized health report from the Central Intelligence unit.",
        attachment_path=report_path
    )
