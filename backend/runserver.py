from watchgod import run_process
import os

def start():
    os.system("daphne -b 0.0.0.0 -p 8000 backend.asgi:application")

if __name__ == "__main__":
    run_process('.', start)
