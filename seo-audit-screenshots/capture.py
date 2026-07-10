from playwright.sync_api import sync_playwright
import json, os

OUTPUT_DIR = "/Users/jakubtiuchty/Desktop/serwiszebra/seo-audit-screenshots"

pages = [
    {
        "name": "sklep",
        "url": "https://www.serwis-zebry.pl/sklep",
    },
    {
        "name": "product",
        "url": "https://www.serwis-zebry.pl/sklep/glowice/drukarki-biurkowe/zebra-zd421t/glowica-203-dpi-zebra-zd421t",
    },
]

viewports = [
    {"label": "mobile", "width": 375, "height": 812},
    {"label": "desktop", "width": 1280, "height": 800},
]

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for page_info in pages:
            for vp in viewports:
                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=1,
                    user_agent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" if vp["label"] == "mobile" else None,
                )
                page = context.new_page()

                try:
                    page.goto(page_info["url"], wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(2000)  # extra settle time
                except Exception as e:
                    print(f"Warning loading {page_info['name']} @ {vp['label']}: {e}")

                # Above-the-fold screenshot
                atf_path = os.path.join(OUTPUT_DIR, f"{page_info['name']}_{vp['label']}_atf.png")
                page.screenshot(path=atf_path, full_page=False)
                print(f"Saved: {atf_path}")

                # Full page screenshot
                full_path = os.path.join(OUTPUT_DIR, f"{page_info['name']}_{vp['label']}_full.png")
                page.screenshot(path=full_path, full_page=True)
                print(f"Saved: {full_path}")

                # Gather metrics
                metrics = page.evaluate("""() => {
                    const results = {};

                    // Font sizes
                    const allText = document.querySelectorAll('p, span, a, li, td, th, label, button, h1, h2, h3, h4, h5, h6');
                    const fontSizes = {};
                    allText.forEach(el => {
                        const size = window.getComputedStyle(el).fontSize;
                        if (!fontSizes[size]) fontSizes[size] = 0;
                        fontSizes[size]++;
                    });
                    results.fontSizes = fontSizes;

                    // Touch targets (links and buttons)
                    const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
                    const smallTargets = [];
                    interactives.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && (rect.width < 48 || rect.height < 48)) {
                            smallTargets.push({
                                tag: el.tagName,
                                text: (el.textContent || '').trim().substring(0, 50),
                                width: Math.round(rect.width),
                                height: Math.round(rect.height),
                                top: Math.round(rect.top),
                            });
                        }
                    });
                    results.smallTouchTargets = smallTargets.slice(0, 20);
                    results.totalSmallTargets = smallTargets.length;
                    results.totalInteractives = interactives.length;

                    // CLS risk: images without dimensions
                    const images = document.querySelectorAll('img');
                    const imgIssues = [];
                    images.forEach(img => {
                        const hasWidth = img.hasAttribute('width') || img.style.width;
                        const hasHeight = img.hasAttribute('height') || img.style.height;
                        if (!hasWidth || !hasHeight) {
                            imgIssues.push({
                                src: (img.src || '').substring(0, 80),
                                hasWidth,
                                hasHeight,
                                rendered: {w: img.clientWidth, h: img.clientHeight},
                            });
                        }
                    });
                    results.imagesWithoutDimensions = imgIssues.slice(0, 10);
                    results.totalImages = images.length;

                    // Above the fold: H1 and CTA visibility
                    const h1 = document.querySelector('h1');
                    if (h1) {
                        const h1Rect = h1.getBoundingClientRect();
                        results.h1 = {
                            text: h1.textContent.trim().substring(0, 100),
                            top: Math.round(h1Rect.top),
                            visible: h1Rect.top < window.innerHeight,
                        };
                    }

                    // Check for horizontal overflow
                    results.bodyScrollWidth = document.body.scrollWidth;
                    results.viewportWidth = window.innerWidth;
                    results.hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;

                    // Page height
                    results.pageHeight = document.body.scrollHeight;

                    return results;
                }""")

                metrics_path = os.path.join(OUTPUT_DIR, f"{page_info['name']}_{vp['label']}_metrics.json")
                with open(metrics_path, "w") as f:
                    json.dump(metrics, f, indent=2, ensure_ascii=False)
                print(f"Saved: {metrics_path}")

                context.close()

        browser.close()

if __name__ == "__main__":
    capture_all()
    print("\nDone!")
