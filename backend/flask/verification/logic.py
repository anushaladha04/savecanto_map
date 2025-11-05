import requests

def check_site(url: str) -> str:
    if not url or not url.startswith(("http://", "https://")):
        return "needs_review"
    try:
        r = requests.get(url, timeout=5, allow_redirects=True)
        if r.status_code == 200:
            return "verified"
        elif r.status_code in (404, 500):
            return "inactive"
        else:
            return "needs_review"
    except Exception:
        return "needs_review"
