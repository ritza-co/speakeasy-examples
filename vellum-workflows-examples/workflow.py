"""Vellum Workflow with Agent Node configured to use CanIPushToProd MCP server."""

from vellum import ChatMessagePromptBlock, PlainTextPromptBlock, PromptParameters, RichTextPromptBlock
from vellum.workflows.constants import AuthorizationType
from vellum.workflows.inputs.base import BaseInputs
from vellum.workflows.nodes.displayable.final_output_node import FinalOutputNode
from vellum.workflows.nodes.displayable.tool_calling_node import ToolCallingNode
from vellum.workflows.references import EnvironmentVariableReference
from vellum.workflows.state.base import BaseState
from vellum.workflows.types.definition import MCPServer
from vellum.workflows.workflows.base import BaseWorkflow


class Inputs(BaseInputs):
    """Workflow input variables."""
    query: str


class Agent(ToolCallingNode):
    """Agent node that uses the CanIPushToProd MCP server as a tool."""
    
    ml_model = "gpt-5-responses"
    prompt_inputs = {"query": Inputs.query}
    max_prompt_iterations = 25
    
    blocks = [
        ChatMessagePromptBlock(
            chat_role="SYSTEM",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="You are a helpful assistant with access to the CanIPushToProd MCP server. When users ask questions about pushing to production, you must actively use the available MCP tools to check the current status and provide a direct, clear answer. Do not ask the user what they want - instead, automatically use the appropriate tools and provide a helpful response based on the tool results. Always give a definitive answer when possible."
                        )
                    ]
                )
            ],
        ),
        ChatMessagePromptBlock(
            chat_role="USER",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(text="{{ query }}")
                    ]
                )
            ],
        ),
    ]
    
    parameters = PromptParameters(
        temperature=0,
        max_tokens=1000,
        custom_parameters={"json_mode": False},
    )
    
    settings = {"stream_enabled": False}
    
    functions = [
        MCPServer(
            name="CanIPushToProd",
            url="https://app.getgram.ai/mcp/ritza-rzx-2cav1",
            authorization_type=AuthorizationType.API_KEY,
            api_key_header_key="Authorization",
            api_key_header_value=EnvironmentVariableReference(name="GRAM_KEY"),
        )
    ]


class FinalOutput(FinalOutputNode[BaseState, str]):
    """Final output node that returns the agent's text response."""
    
    class Outputs(FinalOutputNode.Outputs):
        value = Agent.Outputs.text


class Workflow(BaseWorkflow[Inputs, BaseState]):
    """Vellum workflow with Agent node configured to use CanIPushToProd MCP server."""

    graph = Agent >> FinalOutput

    class Outputs(BaseWorkflow.Outputs):
        final_output = FinalOutput.Outputs.value
