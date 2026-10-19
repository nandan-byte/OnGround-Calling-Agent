# Import os library for operating system and file operations
import os
# Import Path utility from pathlib library
from pathlib import Path
# Import load_dotenv to read variables from .env file
from dotenv import load_dotenv

# Calculate the path to the root .env file
env_file = Path(__file__).resolve().parent.parent / ".env"
# Load environment variables from the root .env file
load_dotenv(dotenv_path=env_file)

# Import LiveKit agents core framework classes
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    cli,
    inference,
)

# Create an instance of the agent server
server = AgentServer()

# Decorate the session entrypoint to handle incoming RTC room connections
@server.rtc_session()
async def entrypoint(ctx: JobContext):
    # Create the agent session using LiveKit Cloud hosted inference models
    session = AgentSession(
        # Set voice activity detection to detect when user speaks
        vad=inference.VAD(),
        # Use LiveKit cloud speech-to-text without external API keys
        stt=inference.STT("deepgram/nova-3", language="multi"),
        # Use LiveKit cloud LLM optimized for fast voice conversation
        llm=inference.LLM("google/gemma-4-31b-it"),
        # Use LiveKit cloud text-to-speech for realistic voice synthesis
        tts=inference.TTS("cartesia/sonic-3"),
    )

    # Define the callback persona and instructions for The Sleep Company
    agent = Agent(
        instructions=(
            "You are a friendly call centre agent for The Sleep Company. "
            "You are calling back a customer who missed our call. "
            "Greet them, ask how you can help, and ask when they are free for a follow-up. "
            "Keep replies short."
        ),
    )

    # Start the session and join the LiveKit room
    await session.start(agent=agent, room=ctx.room)

    # Trigger initial greeting when the customer connects
    await session.generate_reply(
        instructions="Greet the customer warmly as an agent from The Sleep Company returning their call."
    )

# Standard Python entrypoint check
if __name__ == "__main__":
    # Run the agent server using the LiveKit command-line interface
    cli.run_app(server)
