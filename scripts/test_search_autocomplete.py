"""
Test search autocomplete on serwis-zebry.pl/sklep
Tests both "zd220" and "zd22" queries in the sidebar search input.
"""

import time
import json
from playwright.sync_api import sync_playwright

SCREENSHOTS_DIR = "/Users/jakubtiuchty/Desktop/serwiszebra/screenshots"
URL = "https://www.serwis-zebry.pl/sklep"

def run_test():
    console_errors = []
    console_all = []
    network_requests = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # Capture console messages
        def on_console(msg):
            entry = {"type": msg.type, "text": msg.text}
            console_all.append(entry)
            if msg.type in ("error", "warning"):
                console_errors.append(entry)

        page.on("console", on_console)

        # Capture network requests related to search
        def on_request(request):
            url = request.url
            if "search" in url.lower() or "szukaj" in url.lower() or "autocomplete" in url.lower() or "api" in url.lower():
                network_requests.append({
                    "method": request.method,
                    "url": url,
                })

        def on_response(response):
            url = response.url
            if "search" in url.lower() or "szukaj" in url.lower() or "autocomplete" in url.lower():
                try:
                    body = response.text()
                except:
                    body = "<could not read body>"
                network_requests.append({
                    "type": "response",
                    "url": url,
                    "status": response.status,
                    "body_preview": body[:500] if isinstance(body, str) else str(body)[:500],
                })

        page.on("request", on_request)
        page.on("response", on_response)

        # Step 1: Navigate to /sklep
        print("=== Step 1: Navigating to", URL)
        page.goto(URL, wait_until="networkidle", timeout=30000)

        # Step 2: Wait for full load
        print("=== Step 2: Waiting 3 seconds for full page load...")
        time.sleep(3)

        # Step 3: Full page screenshot
        print("=== Step 3: Taking full page screenshot")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-01-page-loaded.png", full_page=True)

        # Step 4: Find the sidebar search input
        print("=== Step 4: Finding sidebar search input")

        # Try multiple selectors to find the search input
        search_input = None
        selectors_tried = []

        selectors = [
            'aside input[placeholder*="Szukaj"]',
            'aside input[placeholder*="szukaj"]',
            'input[placeholder*="Szukaj"]',
            'input[placeholder*="szukaj"]',
            'aside input[type="search"]',
            'aside input[type="text"]',
            'input[type="search"]',
            '.sidebar input',
            '[class*="sidebar"] input',
            '[class*="search"] input',
            'aside input',
        ]

        for sel in selectors:
            selectors_tried.append(sel)
            try:
                el = page.query_selector(sel)
                if el:
                    search_input = el
                    print(f"  Found search input with selector: {sel}")
                    # Get input attributes for debugging
                    attrs = page.evaluate("""(el) => {
                        return {
                            placeholder: el.placeholder,
                            type: el.type,
                            name: el.name,
                            id: el.id,
                            className: el.className,
                            tagName: el.tagName,
                            parentClasses: el.parentElement ? el.parentElement.className : '',
                        }
                    }""", el)
                    print(f"  Input attributes: {json.dumps(attrs, indent=2)}")
                    break
            except Exception as e:
                pass

        if not search_input:
            # Fallback: list all inputs on the page
            print("  Could not find search input. Listing all inputs on page:")
            all_inputs = page.evaluate("""() => {
                const inputs = document.querySelectorAll('input');
                return Array.from(inputs).map((el, i) => ({
                    index: i,
                    placeholder: el.placeholder,
                    type: el.type,
                    name: el.name,
                    id: el.id,
                    className: el.className,
                    visible: el.offsetParent !== null,
                    rect: el.getBoundingClientRect(),
                }));
            }""")
            for inp in all_inputs:
                print(f"  Input #{inp['index']}: placeholder='{inp['placeholder']}' type='{inp['type']}' name='{inp['name']}' class='{inp['className']}' visible={inp['visible']} rect={inp['rect']}")

            # Try the first visible text/search input
            for inp in all_inputs:
                if inp['visible'] and inp['type'] in ('text', 'search', ''):
                    sel_fallback = f"input[name='{inp['name']}']" if inp['name'] else f"input[placeholder='{inp['placeholder']}']"
                    search_input = page.query_selector(sel_fallback)
                    if search_input:
                        print(f"  Using fallback input: {sel_fallback}")
                        break

        if not search_input:
            print("  ERROR: No search input found on the page!")
            page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-ERROR-no-input.png", full_page=True)
            browser.close()
            return

        # Step 5: Click on the search input
        print("=== Step 5: Clicking on search input")
        search_input.click()
        time.sleep(0.5)

        # Step 6: Type "zd220" slowly
        print("=== Step 6: Typing 'zd220' slowly")
        network_requests.clear()  # Clear to track only search-related requests
        search_input.type("zd220", delay=100)

        # Step 7: Wait for API response
        print("=== Step 7: Waiting 2 seconds for API response...")
        time.sleep(2)

        # Step 8: Screenshot of autocomplete result
        print("=== Step 8: Taking screenshot of autocomplete dropdown")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-02-zd220-result.png", full_page=False)
        # Also take full page for context
        page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-02-zd220-result-full.png", full_page=True)

        # Check if dropdown appeared
        print("=== Checking for dropdown/autocomplete elements...")
        dropdown_info = page.evaluate("""() => {
            // Look for common dropdown patterns
            const candidates = [
                ...document.querySelectorAll('[class*="dropdown"]'),
                ...document.querySelectorAll('[class*="autocomplete"]'),
                ...document.querySelectorAll('[class*="suggest"]'),
                ...document.querySelectorAll('[class*="search-result"]'),
                ...document.querySelectorAll('[class*="SearchResult"]'),
                ...document.querySelectorAll('[class*="search-dropdown"]'),
                ...document.querySelectorAll('[role="listbox"]'),
                ...document.querySelectorAll('[role="option"]'),
                ...document.querySelectorAll('ul[class*="search"]'),
                ...document.querySelectorAll('div[class*="search"] ul'),
                ...document.querySelectorAll('div[class*="search"] li'),
            ];

            const visible = candidates.filter(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
            });

            return {
                total_candidates: candidates.length,
                visible_candidates: visible.length,
                visible_details: visible.slice(0, 10).map(el => ({
                    tag: el.tagName,
                    className: el.className,
                    text: el.textContent?.substring(0, 200),
                    rect: el.getBoundingClientRect(),
                }))
            };
        }""")
        print(f"  Dropdown candidates found: {dropdown_info['total_candidates']}")
        print(f"  Visible candidates: {dropdown_info['visible_candidates']}")
        for detail in dropdown_info.get('visible_details', []):
            print(f"    - <{detail['tag']}> class='{detail['className']}' text='{detail['text'][:100]}'")

        # Print network requests
        print(f"\n=== Network requests related to search ({len(network_requests)}):")
        for req in network_requests:
            print(f"  {json.dumps(req, indent=2)}")

        # Step 9: Console errors
        print(f"\n=== Step 9: Console errors ({len(console_errors)}):")
        for err in console_errors:
            print(f"  [{err['type']}] {err['text'][:300]}")

        # Step 10: Clear and type "zd22"
        print("\n=== Step 10: Clearing input and typing 'zd22'")
        network_requests.clear()

        # Triple-click to select all, then delete
        search_input.click(click_count=3)
        time.sleep(0.2)
        page.keyboard.press("Backspace")
        time.sleep(0.3)

        # Verify input is cleared
        val = search_input.input_value()
        print(f"  Input value after clear: '{val}'")

        # Type "zd22"
        search_input.type("zd22", delay=100)
        print("  Typed 'zd22', waiting 2 seconds...")
        time.sleep(2)

        # Screenshot
        page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-03-zd22-result.png", full_page=False)
        page.screenshot(path=f"{SCREENSHOTS_DIR}/autocomplete-03-zd22-result-full.png", full_page=True)

        # Check dropdown again
        dropdown_info_2 = page.evaluate("""() => {
            const candidates = [
                ...document.querySelectorAll('[class*="dropdown"]'),
                ...document.querySelectorAll('[class*="autocomplete"]'),
                ...document.querySelectorAll('[class*="suggest"]'),
                ...document.querySelectorAll('[class*="search-result"]'),
                ...document.querySelectorAll('[class*="SearchResult"]'),
                ...document.querySelectorAll('[class*="search-dropdown"]'),
                ...document.querySelectorAll('[role="listbox"]'),
                ...document.querySelectorAll('[role="option"]'),
                ...document.querySelectorAll('ul[class*="search"]'),
                ...document.querySelectorAll('div[class*="search"] ul'),
                ...document.querySelectorAll('div[class*="search"] li'),
            ];

            const visible = candidates.filter(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
            });

            return {
                total_candidates: candidates.length,
                visible_candidates: visible.length,
                visible_details: visible.slice(0, 10).map(el => ({
                    tag: el.tagName,
                    className: el.className,
                    text: el.textContent?.substring(0, 200),
                    rect: el.getBoundingClientRect(),
                }))
            };
        }""")
        print(f"\n  Dropdown candidates for 'zd22': {dropdown_info_2['total_candidates']}")
        print(f"  Visible candidates: {dropdown_info_2['visible_candidates']}")
        for detail in dropdown_info_2.get('visible_details', []):
            print(f"    - <{detail['tag']}> class='{detail['className']}' text='{detail['text'][:100]}'")

        print(f"\n  Network requests for 'zd22' ({len(network_requests)}):")
        for req in network_requests:
            print(f"  {json.dumps(req, indent=2)}")

        # Final console errors summary
        print(f"\n=== Final console errors summary ({len(console_errors)}):")
        for err in console_errors:
            print(f"  [{err['type']}] {err['text'][:300]}")

        browser.close()

    print("\n=== TEST COMPLETE ===")
    print(f"Screenshots saved to: {SCREENSHOTS_DIR}/")
    print("Files: autocomplete-01-page-loaded.png, autocomplete-02-zd220-result.png, autocomplete-02-zd220-result-full.png, autocomplete-03-zd22-result.png, autocomplete-03-zd22-result-full.png")


if __name__ == "__main__":
    run_test()
