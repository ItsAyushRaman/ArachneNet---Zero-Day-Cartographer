import json
import re

import httpx

from config import LLM_BASE_URL, LLM_MODEL, LLM_PROVIDER, LLM_TEMPERATURE, LLM_TIMEOUT_SECONDS, USE_MOCK_DATA


def _normalized_base_url() -> str:
    base_url = LLM_BASE_URL.rstrip("/")
    if base_url.endswith("/v1"):
        base_url = base_url[:-3]
    return base_url


def _extract_json(text: str) -> dict:
    clean = text.strip()
    clean = re.sub(r"^```(?:json)?", "", clean, flags=re.IGNORECASE).strip()
    clean = re.sub(r"```$", "", clean).strip()

    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", clean, re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


async def call_local_llm_json(*, system_prompt: str, user_prompt: str, fallback=None, max_tokens: int = 1200, temperature: float | None = None):
    """Call a local OpenAI-compatible LLM endpoint and parse JSON output."""
    if USE_MOCK_DATA or LLM_PROVIDER == "mock":
        if fallback is not None:
            return await fallback() if callable(fallback) else fallback
        return {}

    payload = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature if temperature is not None else LLM_TEMPERATURE,
        "max_tokens": max_tokens,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=LLM_TIMEOUT_SECONDS) as client:
            response = await client.post(f"{_normalized_base_url()}/v1/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()

        choices = data.get("choices", [])
        content = ""
        if choices:
            choice = choices[0]
            content = choice.get("message", {}).get("content", "") or choice.get("text", "")

        if not content:
            raise ValueError("LLM response did not include content")

        return _extract_json(content)
    except Exception:
        if fallback is not None:
            return await fallback() if callable(fallback) else fallback
        raise