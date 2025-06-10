import logging

from flask import Flask, render_template

app: Flask = Flask(__name__)
log: logging.Logger = logging.getLogger(__name__)


@app.route("/")
def home():
    log.info("rendering 3D models")
    return render_template("index.html")
