
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configuration
BASE_URL = "http://localhost:5173"
HEADLESS_MODE = True

ROLE_MATRIX = {
    "Super Admin": ["System Brain", "Health Matrix", "Expansion AI", "Referral Scout", "Customer 360", "Usage Depth", "Sentiment AI", "Integration Hub", "Neuro-Link", "AI Studio", "Security Audit", "Alert Center", "Executive Lens", "Agent Console", "System Core", "Admin Ops"],
    "Admin": ["System Brain", "Health Matrix", "Expansion AI", "Referral Scout", "Customer 360", "Usage Depth", "Sentiment AI", "Integration Hub", "Alert Center", "Executive Lens", "Agent Console", "Admin Ops"],
    "Manager": ["Health Matrix", "Customer 360", "Usage Depth", "Sentiment AI", "Expansion AI", "Referral Scout", "Executive Lens", "Alert Center"],
    "Sales / Success": ["Health Matrix", "Customer 360", "Usage Depth", "Sentiment AI", "Expansion AI", "Referral Scout", "Agent Console", "Alert Center"],
    "Observer": ["Health Matrix", "Customer 360", "Usage Depth", "Executive Lens"]
}

def setup_driver():
    options = webdriver.ChromeOptions()
    if HEADLESS_MODE:
        options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    try:
        driver = webdriver.Chrome(options=options)
        return driver
    except Exception as e:
        print(f"Driver Init Failed: {e}")
        return None

def verify_role_access(driver, wait, role, expected_modules):
    print(f"\n--- Testing Role: {role} ---")
    
    # 1. Select Role
    try:
        role_select = wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
        Select(role_select).select_by_visible_text(role)
        print(f"Switched context to {role}...")
    except Exception as e:
        print(f"Failed to switch role: {e}")
        return False

    # 2. Wait for Neural Sync
    time.sleep(2) # Brief wait for state transition and animation
    
    # 3. Check sidebar items
    nav_items = driver.find_elements(By.XPATH, "//nav//button")
    active_labels = [item.text.strip().split('\n')[0] for item in nav_items if item.text.strip()]
    
    # Filter out static items like "Preferences" or "Disconnect" if they are in the list
    # Based on NavItem code, label is inside a span.
    visible_labels = []
    for item in nav_items:
        try:
            label_span = item.find_element(By.XPATH, ".//span")
            visible_labels.append(label_span.text.strip())
        except:
            pass

    print(f"Detected Modules: {visible_labels}")
    
    # Verify expected modules are present
    success = True
    for module in expected_modules:
        if module not in visible_labels:
            print(f"FAILURE: Module '{module}' missing for {role}")
            success = False
            
    # Verify unexpected modules are NOT present
    for label in visible_labels:
        if label not in expected_modules and label not in ["Preferences", "Disconnect"]:
            print(f"FAILURE: Unauthorized module '{label}' visible for {role}")
            success = False
            
    if success:
        print(f"SUCCESS: RBAC enforced correctly for {role}")
    return success

def run_test():
    driver = setup_driver()
    if not driver: return
    wait = WebDriverWait(driver, 10)

    try:
        driver.get(BASE_URL)
        wait.until(EC.presence_of_element_located((By.XPATH, "//aside")))
        
        all_success = True
        for role, modules in ROLE_MATRIX.items():
            if not verify_role_access(driver, wait, role, modules):
                all_success = False
        
        if all_success:
            print("\n✅ ALL RBAC MATRIX TESTS PASSED")
        else:
            print("\n❌ RBAC MATRIX TESTS FAILED")

    except Exception as e:
        print(f"Test Crashed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_test()
