import google.genai as genai
import os
from dotenv import load_dotenv
from app.agents.task_agent import task_agent

load_dotenv()

def get_client():
    """Lazy initialization of Gemini client to avoid startup delays"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set")
    return genai.Client(api_key=api_key)

def planning_agent(user_input: str):
    try:
        prompt = f"""
        Break this goal into smaller actionable tasks:

        "{user_input}"

        Return simple short task sentences.
        """

        client = get_client()
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # 🔥 Pass to task agent (2-step AI flow)
        return task_agent(res.text)

    except Exception as e:
        return {
            "error": "Planning agent failed (quota issue)",
            "details": str(e)
        }