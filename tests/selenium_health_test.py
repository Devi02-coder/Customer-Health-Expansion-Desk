
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys

# Configuration
BASE_URL = "http://localhost:5173" # Vite default port

def test_health_validation():
    print("Starting Health Score Validation Test...")
    
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--headless") # Comment out to see the browser

    try:
        driver = webdriver.Chrome(options=options)
        driver.get(BASE_URL)
        
        # 1. Wait for dashboard and locate "Override" button
        # The default view might be 'Mission Overview', but we removed it.
        # It should default to 'System Brain' (SuperAdminDashboard).
        # We need to switch to 'Health Matrix' (VitalSignsDashboard) via the sidebar.
        
        wait = WebDriverWait(driver, 10)
        
        print("Navigating to Health Matrix...")
        # Find the nav item for "Health Matrix"
        # In MissionControl.jsx, id='vital-signs', label='Health Matrix', icon=<Activity...
        
        # Try to find button with text "Health Matrix"
        health_nav = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Health Matrix')]/ancestor::button")))
        health_nav.click()
        
        time.sleep(2) # Wait for animation
        
        print("Opening Override Modal...")
        # 2. Click "Override" button for the first startup
        override_buttons = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//button[contains(text(), 'Override')]")))
        if not override_buttons:
            print("CRITICAL: No 'Override' buttons found! check if startups loaded.")
            return False

        override_buttons[0].click()
        
        # 3. Try to inject a 'buggy' value (e.g., -50 health score)
        print("Injecting negative value...")
        score_input = wait.until(EC.visibility_of_element_located((By.NAME, "health_score")))
        score_input.clear()
        score_input.send_keys("-50")
        
        submit_btn = driver.find_element(By.ID, "submit-update")
        submit_btn.click()
        
        time.sleep(2)
        
        # 4. Check if the error message is displayed
        print("Checking for validation error...")
        try:
            # We look for p tag with class 'validation-error'
            error_msg = driver.find_element(By.CLASS_NAME, "validation-error")
            print("SUCCESS: Validation error detected: " + error_msg.text)
            return True
        except:
            print("BUG FOUND: System accepted negative health score! No validation error displayed.")
            return False

    except Exception as e:
        print(f"Test crashed: {e}")
        return False
    finally:
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":
    if not test_health_validation():
        sys.exit(1)
    print("Test Passed!")
    sys.exit(0)
