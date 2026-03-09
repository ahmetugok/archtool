from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:5173')

        # Take an early screenshot to see what's loaded
        page.screenshot(path='/home/jules/verification/verification_early.png')
        print(page.content())
        browser.close()

if __name__ == '__main__':
    verify_app()
