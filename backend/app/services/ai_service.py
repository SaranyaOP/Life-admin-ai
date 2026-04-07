from dotenv import load_dotenv
import os
from google import genai
from datetime import datetime
import json

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-2.5-flash"


def extract_tasks_from_text(user_input: str):
    today = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")

    prompt = f"""
    You are a task extraction system.

    Today's date is: {today}
    Current time is: {current_time}
    Timezone: Asia/Kolkata

    Convert input into structured tasks.

    RULES:
    - Return ONLY JSON
    - No explanation
    - Always include all fields
    - Convert relative dates
    - Use ISO datetime format

    PRIORITY RULE:
    - Urgent / important → high
    - Normal tasks → medium
    - Optional / casual → low

    DESCRIPTION RULE:
    - Expand the task slightly for clarity
    - Keep it short (1 sentence)

    SCHEMA:
    {{
    "tasks": [
        {{
        "title": "string",
        "description": "short helpful explanation",
        "priority": "low | medium | high",
        "due_date": "ISO datetime",
        "completed": false
        }}
    ]
    }}

    INPUT:
    "{user_input}"
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(raw)

        return parsed["tasks"]

    except Exception as e:
        return {
            "error": "AI parsing failed",
            "details": str(e),
            "raw_output": raw if 'raw' in locals() else None
        }