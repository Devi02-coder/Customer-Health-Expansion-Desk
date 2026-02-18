import smtplib
from email.message import EmailMessage
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email(to_email, subject, body, attachment_path=None):
    logger.info(f"Preparing to send email to {to_email} with subject: {subject}")
    
    msg = EmailMessage()
    msg["From"] = "ched-reports@dm-intel.ai"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    if attachment_path:
        try:
            with open(attachment_path, "rb") as f:
                msg.add_attachment(
                    f.read(),
                    maintype="application",
                    subtype="pdf" if attachment_path.endswith('.pdf') else "octet-stream",
                    filename=attachment_path.split("/")[-1]
                )
            logger.info(f"Attachment {attachment_path} added successfully.")
        except Exception as e:
            logger.error(f"Failed to attach file: {e}")

    # For demo purposes, we log the action. 
    # In a real environment with credentials, this would connect to SMTP.
    logger.info("MOCK_MAIL_SERVICE: Email serialized and 'sent' via Neural Relay.")
    logger.info(f"Recipient: {to_email}")
    logger.info(f"Subject: {subject}")
    
    # Optional logic to actually attempt send if config exists
    # with smtplib.SMTP("smtp.gmail.com", 587) as server:
    #     ...
