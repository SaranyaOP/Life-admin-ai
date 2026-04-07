from google import genai
import os
from app.agents.task_agent import task_agent

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def planning_agent(user_input: str):
    try:
        prompt = f"""
        Break this goal into smaller actionable tasks:

        "{user_input}"

        Return simple short task sentences.
        """

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