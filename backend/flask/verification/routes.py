from flask import Blueprint, request, jsonify
from .logic import check_site

bp = Blueprint("verify", __name__)

@bp.post("/verify")
def verify():
    data = request.get_json(force=True) or {}
    url = data.get("url", "")
    status = check_site(url)
    return jsonify({"status": status})

@bp.get("/health")
def health():
    return {"ok": True}
