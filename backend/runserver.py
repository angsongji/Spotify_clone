from watchgod import run_process
import os

def start():
    os.system("daphne backend.asgi:application")

if __name__ == "__main__":
    run_process('.', start)
