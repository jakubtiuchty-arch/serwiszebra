"""
Test search autocomplete on serwis-zebry.pl/sklep
Mobile (iPhone 375x812) and Tablet (iPad 768x1024) viewports.
"""

import time
import json
from playwright.sync_api import sync_playwright

URL = "https://www.serwis-zebry.pl/sklep"
SCREENSHOTS_DIR = "/Users/jakubtiuchty/Desktop/serwiszebra/screenshots"
SEARCH_QUERY = "zd220"


def test_mobile_viewport(page, console_logs, search_query=SEARCH_QUERY):
    """Test on iPhone viewport 375x812."""
    prefix = "mobile"
    print(f"\n{'='*60}")
    print(f"MOBILE VIEWPORT TEST (375x812)")
    print(f"{'='*60}")

    # Step 1: Navigate
    print("\n[Step 1] Navigating to", URL)
    page.goto(URL, wait_until="networkidle")

    # Step 2: Wait 3 seconds for full load
    print("[Step 2] Waiting 3 seconds for full load...")
    time.sleep(3)

    # Step 3: Full page screenshot
    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-01-page-loaded-full.png"
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"[Step 3] Full page screenshot saved: {screenshot_path}")

    # Also take above-the-fold screenshot
    screenshot_path_atf = f"{SCREENSHOTS_DIR}/{prefix}-01-page-loaded-above-fold.png"
    page.screenshot(path=screenshot_path_atf, full_page=False)
    print(f"  Above-the-fold screenshot saved: {screenshot_path_atf}")

    # Step 4: Find search input
    print("\n[Step 4] Looking for search input elements...")

    # Check all input elements and their visibility
    search_inputs = page.query_selector_all('input[type="text"], input[type="search"], input[placeholder*="szukaj" i], input[placeholder*="search" i], input[name*="search" i], input[name*="query" i]')
    print(f"  Found {len(search_inputs)} potential search inputs")

    for i, inp in enumerate(search_inputs):
        visible = inp.is_visible()
        placeholder = inp.get_attribute("placeholder") or ""
        name = inp.get_attribute("name") or ""
        input_id = inp.get_attribute("id") or ""
        parent_classes = page.evaluate("(el) => { let p = el.parentElement; let classes = []; while(p && classes.length < 5) { if(p.className) classes.push(p.className.toString().substring(0,80)); p = p.parentElement; } return classes; }", inp)
        print(f"  Input #{i}: visible={visible}, placeholder='{placeholder}', name='{name}', id='{input_id}'")
        print(f"    Parent classes: {parent_classes[:3]}")

    # Try to find the mobile search input specifically
    # Look for input inside lg:hidden or mobile-specific containers
    mobile_search = None

    # Strategy 1: Find visible search input
    for inp in search_inputs:
        if inp.is_visible():
            mobile_search = inp
            print(f"\n  --> Using visible search input: placeholder='{inp.get_attribute('placeholder')}'")
            break

    if not mobile_search:
        # Strategy 2: Check for a search button/icon that might reveal the input
        print("  No visible search input found. Looking for search toggle button...")
        search_buttons = page.query_selector_all('button[aria-label*="search" i], button[aria-label*="szukaj" i], [class*="search"] button, [class*="search"] svg')
        for btn in search_buttons:
            if btn.is_visible():
                print(f"  Found search toggle button, clicking it...")
                btn.click()
                time.sleep(1)
                # Re-check for visible inputs
                for inp in search_inputs:
                    if inp.is_visible():
                        mobile_search = inp
                        break
                if mobile_search:
                    break

    if not mobile_search:
        # Strategy 3: Try all inputs
        print("  Still no visible search. Trying to find ANY input on the page...")
        all_inputs = page.query_selector_all('input')
        for inp in all_inputs:
            if inp.is_visible():
                t = inp.get_attribute("type") or "text"
                if t in ("text", "search", ""):
                    mobile_search = inp
                    print(f"  --> Found input: type='{t}', placeholder='{inp.get_attribute('placeholder')}'")
                    break

    if not mobile_search:
        print("  ERROR: No search input found on mobile viewport!")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/{prefix}-ERROR-no-search-input.png", full_page=False)
        return

    # Step 5: Click on search input
    print("\n[Step 5] Clicking on search input...")
    mobile_search.click()
    time.sleep(0.5)
    page.screenshot(path=f"{SCREENSHOTS_DIR}/{prefix}-02-search-focused.png", full_page=False)
    print(f"  Screenshot after focus saved")

    # Step 6: Type "zd220" slowly
    print(f"\n[Step 6] Typing '{search_query}' slowly (100ms between chars)...")
    mobile_search.type(search_query, delay=100)

    # Step 7: Wait 2 seconds
    print("[Step 7] Waiting 2 seconds for autocomplete...")
    time.sleep(2)

    # Step 8: Screenshot to see autocomplete dropdown
    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-03-autocomplete-result.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"[Step 8] Autocomplete screenshot saved: {screenshot_path}")

    # Also take full page to see if dropdown is elsewhere
    screenshot_path_full = f"{SCREENSHOTS_DIR}/{prefix}-03-autocomplete-result-full.png"
    page.screenshot(path=screenshot_path_full, full_page=True)
    print(f"  Full page autocomplete screenshot saved: {screenshot_path_full}")

    # Step 9: Check console errors
    print(f"\n[Step 9] Console messages collected: {len(console_logs)}")
    errors = [log for log in console_logs if log["type"] in ("error", "warning")]
    print(f"  Errors: {len([l for l in errors if l['type'] == 'error'])}")
    print(f"  Warnings: {len([l for l in errors if l['type'] == 'warning'])}")
    for log in errors:
        print(f"  [{log['type'].upper()}] {log['text'][:200]}")

    # Step 10: Check z-index conflicts / overlapping elements
    print(f"\n[Step 10] Checking for z-index conflicts and overlapping elements...")

    # Check if there's an autocomplete dropdown visible
    z_index_analysis = page.evaluate("""() => {
        const results = [];

        // Find elements that might be autocomplete dropdowns
        const dropdowns = document.querySelectorAll('[class*="dropdown"], [class*="autocomplete"], [class*="suggest"], [class*="result"], [class*="listbox"], [role="listbox"], [role="menu"], ul[class*="search"], div[class*="search-result"]');
        results.push({type: 'dropdowns_found', count: dropdowns.length});

        dropdowns.forEach((el, i) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            results.push({
                type: 'dropdown',
                index: i,
                classes: el.className.toString().substring(0, 100),
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                zIndex: style.zIndex,
                position: style.position,
                overflow: style.overflow,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                childCount: el.children.length,
                textContent: el.textContent.substring(0, 200)
            });
        });

        // Check for elements with high z-index near the search area
        const allElements = document.querySelectorAll('*');
        const highZElements = [];
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const z = parseInt(style.zIndex);
            if (z > 10) {
                const rect = el.getBoundingClientRect();
                if (rect.top < 400) {  // Only elements in upper portion of page
                    highZElements.push({
                        tag: el.tagName,
                        classes: el.className.toString().substring(0, 80),
                        zIndex: z,
                        position: style.position,
                        rect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) }
                    });
                }
            }
        });
        results.push({type: 'high_z_elements', elements: highZElements});

        // Check the search input's container for overflow issues
        const searchInput = document.querySelector('input[type="text"]:not([hidden]), input[type="search"]:not([hidden])');
        if (searchInput) {
            let parent = searchInput.parentElement;
            const overflowChain = [];
            while (parent && overflowChain.length < 10) {
                const style = window.getComputedStyle(parent);
                if (style.overflow !== 'visible' || style.overflowY !== 'visible' || style.overflowX !== 'visible') {
                    overflowChain.push({
                        tag: parent.tagName,
                        classes: parent.className.toString().substring(0, 80),
                        overflow: style.overflow,
                        overflowX: style.overflowX,
                        overflowY: style.overflowY,
                        position: style.position,
                        zIndex: style.zIndex
                    });
                }
                parent = parent.parentElement;
            }
            results.push({type: 'overflow_chain', elements: overflowChain});
        }

        return results;
    }""")

    for item in z_index_analysis:
        if item["type"] == "dropdowns_found":
            print(f"  Dropdown-like elements found: {item['count']}")
        elif item["type"] == "dropdown":
            print(f"  Dropdown #{item['index']}: display={item['display']}, visibility={item['visibility']}, opacity={item['opacity']}, z-index={item['zIndex']}")
            print(f"    Classes: {item['classes']}")
            print(f"    Position: {item['position']}, Rect: {item['rect']}")
            print(f"    Children: {item['childCount']}, Text: {item['textContent'][:100]}")
        elif item["type"] == "high_z_elements":
            print(f"  High z-index elements in top 400px: {len(item['elements'])}")
            for el in item["elements"]:
                print(f"    <{el['tag']}> z={el['zIndex']} pos={el['position']} classes='{el['classes'][:60]}' rect={el['rect']}")
        elif item["type"] == "overflow_chain":
            if item["elements"]:
                print(f"  Overflow clipping ancestors of search input: {len(item['elements'])}")
                for el in item["elements"]:
                    print(f"    <{el['tag']}> overflow={el['overflow']} overflowY={el['overflowY']} pos={el['position']} z={el['zIndex']} classes='{el['classes'][:60]}'")
            else:
                print(f"  No overflow clipping ancestors found (good)")

    # Step 11: Press Enter and take screenshot
    print(f"\n[Step 11] Pressing Enter after typing '{search_query}'...")
    page.keyboard.press("Enter")
    time.sleep(3)  # Wait for navigation/results
    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-04-after-enter.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"  Screenshot after Enter saved: {screenshot_path}")

    # Full page after enter
    screenshot_path_full = f"{SCREENSHOTS_DIR}/{prefix}-04-after-enter-full.png"
    page.screenshot(path=screenshot_path_full, full_page=True)
    print(f"  Full page after Enter saved: {screenshot_path_full}")

    # Check final URL
    print(f"  Current URL after Enter: {page.url}")


def test_tablet_viewport(page, console_logs, search_query=SEARCH_QUERY):
    """Test on iPad viewport 768x1024."""
    prefix = "tablet"
    print(f"\n{'='*60}")
    print(f"TABLET VIEWPORT TEST (768x1024)")
    print(f"{'='*60}")

    # Step 12: Navigate
    print("\n[Step 12] Navigating to", URL)
    page.goto(URL, wait_until="networkidle")
    time.sleep(3)

    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-01-page-loaded.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"  Page loaded screenshot saved: {screenshot_path}")

    # Find search input
    print("\n[Step 13] Looking for search input on tablet...")
    search_inputs = page.query_selector_all('input[type="text"], input[type="search"], input[placeholder*="szukaj" i], input[placeholder*="search" i]')
    print(f"  Found {len(search_inputs)} search inputs")

    tablet_search = None
    for inp in search_inputs:
        if inp.is_visible():
            tablet_search = inp
            placeholder = inp.get_attribute("placeholder") or ""
            print(f"  --> Using visible input: placeholder='{placeholder}'")
            break

    if not tablet_search:
        # Try clicking a search icon
        search_buttons = page.query_selector_all('button[aria-label*="search" i], button[aria-label*="szukaj" i], [class*="search"] button')
        for btn in search_buttons:
            if btn.is_visible():
                btn.click()
                time.sleep(1)
                for inp in search_inputs:
                    if inp.is_visible():
                        tablet_search = inp
                        break
                if tablet_search:
                    break

    if not tablet_search:
        # Try finding any visible text input
        all_inputs = page.query_selector_all('input')
        for inp in all_inputs:
            if inp.is_visible():
                t = inp.get_attribute("type") or "text"
                if t in ("text", "search", ""):
                    tablet_search = inp
                    break

    if not tablet_search:
        print("  ERROR: No search input found on tablet viewport!")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/{prefix}-ERROR-no-search-input.png", full_page=False)
        return

    # Type search query
    tablet_search.click()
    time.sleep(0.5)
    print(f"  Typing '{search_query}' slowly...")
    tablet_search.type(search_query, delay=100)

    # Step 14: Wait 2 seconds
    print("[Step 14] Waiting 2 seconds for autocomplete...")
    time.sleep(2)

    # Step 15: Screenshot
    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-02-autocomplete-result.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"[Step 15] Autocomplete screenshot saved: {screenshot_path}")

    screenshot_path_full = f"{SCREENSHOTS_DIR}/{prefix}-02-autocomplete-result-full.png"
    page.screenshot(path=screenshot_path_full, full_page=True)
    print(f"  Full page autocomplete screenshot saved: {screenshot_path_full}")

    # Check what's visible
    dropdown_check = page.evaluate("""() => {
        const dropdowns = document.querySelectorAll('[class*="dropdown"], [class*="autocomplete"], [class*="suggest"], [class*="result"], [class*="listbox"], [role="listbox"]');
        const results = [];
        dropdowns.forEach((el, i) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (rect.height > 0 && style.display !== 'none') {
                results.push({
                    classes: el.className.toString().substring(0, 100),
                    display: style.display,
                    zIndex: style.zIndex,
                    rect: { top: Math.round(rect.top), height: Math.round(rect.height), width: Math.round(rect.width) },
                    textPreview: el.textContent.substring(0, 150)
                });
            }
        });
        return results;
    }""")

    print(f"\n  Visible dropdown elements on tablet: {len(dropdown_check)}")
    for d in dropdown_check:
        print(f"    classes='{d['classes'][:60]}' z={d['zIndex']} rect={d['rect']}")
        print(f"    text: {d['textPreview'][:100]}")

    # Also check console errors for tablet
    tablet_errors = [log for log in console_logs if log["type"] == "error"]
    print(f"\n  Console errors during tablet test: {len(tablet_errors)}")
    for log in tablet_errors:
        print(f"  [ERROR] {log['text'][:200]}")

    # Press Enter too
    print(f"\n  Pressing Enter...")
    page.keyboard.press("Enter")
    time.sleep(3)
    screenshot_path = f"{SCREENSHOTS_DIR}/{prefix}-03-after-enter.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"  Screenshot after Enter saved: {screenshot_path}")
    print(f"  Current URL: {page.url}")


def main():
    with sync_playwright() as p:
        # ============ MOBILE TEST ============
        console_logs_mobile = []
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()
        page.on("console", lambda msg: console_logs_mobile.append({"type": msg.type, "text": msg.text}))

        test_mobile_viewport(page, console_logs_mobile)

        browser.close()

        # ============ TABLET TEST ============
        console_logs_tablet = []
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 768, "height": 1024},
            user_agent="Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()
        page.on("console", lambda msg: console_logs_tablet.append({"type": msg.type, "text": msg.text}))

        test_tablet_viewport(page, console_logs_tablet)

        browser.close()

    print(f"\n{'='*60}")
    print("ALL TESTS COMPLETE")
    print(f"{'='*60}")
    print(f"Screenshots saved to: {SCREENSHOTS_DIR}/")


if __name__ == "__main__":
    main()
