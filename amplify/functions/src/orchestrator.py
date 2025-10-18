import json
import os
import boto3
from typing import Dict, Any
from strands import Agent, tool
from strands.models import BedrockModel
from strands_tools import (
    handoff_to_user,
    journal,
    use_aws,
    nova_reels,
    generate_image,
    image_reader,
)
from strands.agent.conversation_manager import SlidingWindowConversationManager


dynamodb = boto3.resource("dynamodb")

weddings_table = dynamodb.Table(os.environ["WEDDINGS_TABLE_NAME"])
vendors_table = dynamodb.Table(os.environ["VENDORS_TABLE_NAME"])
vendor_communications_table = dynamodb.Table(os.environ["VENDOR_COMMUNICATIONS_TABLE_NAME"])
transactions_table = dynamodb.Table(os.environ["TRANSACTIONS_TABLE_NAME"])
budget_categories_table = dynamodb.Table(os.environ["BUDGET_CATEGORIES_TABLE_NAME"])
transactions_table = dynamodb.Table(os.environ["TRANSACTIONS_TABLE_NAME"])
budget_phases_table = dynamodb.Table(os.environ["BUDGET_PHASES_TABLE_NAME"])
overall_budgets_table = dynamodb.Table(os.environ["OVERALL_BUDGETS_TABLE_NAME"])
plus_ones_table = dynamodb.Table(os.environ["PLUS_ONES_TABLE_NAME"])
guests_table = dynamodb.Table(os.environ["GUESTS_TABLE_NAME"])
communications_table = dynamodb.Table(os.environ["COMMUNICATIONS_TABLE_NAME"])
moodboards_table = dynamodb.Table(os.environ["MOODBOARDS_TABLE_NAME"])
milestones_table = dynamodb.Table(os.environ["MILESTONES_TABLE_NAME"])
project_deadlines_table = dynamodb.Table(os.environ["PROJECT_DEADLINES_TABLE_NAME"])
contingency_plans_table = dynamodb.Table(os.environ["CONTINGENCY_PLANS_TABLE_NAME"])
activities_table = dynamodb.Table(os.environ["ACTIVITIES_TABLE_NAME"])
tasks_table = dynamodb.Table(os.environ["TASKS_TABLE_NAME"])


media_bucket = os.environ["S3_BUCKET"]
event_bus_name = os.environ["EVENT_BUS_NAME"]

@tool
def wedding_repository_assistant(query: str) -> str:
    """
    Tool for querying and updating wedding-related data in DynamoDB.

    Args:
        query: Natural language request regarding wedding data

    Returns:
        Information or updates related to weddings
    """
    try:
        wedding_agent = Agent(
            system_prompt="""You are a wedding data repository assistant.
            Handle queries and updates related to wedding information in DynamoDB.""",
            tools=[
                weddings_table,
                vendors_table,
                vendor_communications_table,
                transactions_table,
                budget_categories_table,
                budget_phases_table,
                overall_budgets_table,
                plus_ones_table,
                guests_table,
                communications_table,
                moodboards_table,
                milestones_table,
                project_deadlines_table,
                contingency_plans_table,
                activities_table,
                tasks_table,
            ],
        )
        response = wedding_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in wedding repository: {str(e)}"

ORCHESTRATOR_SYSTEM_PROMPT = """You are the Wedding Orchestrator Agent for EnchantedDay AI Wedding Planner. You coordinate all wedding planning activities and manage other specialized agents.

Your capabilities include:
1. Coordinating vendor management, guest services, budget tracking, timeline management, and crisis response
2. Making HTTP requests to external wedding services APIs
3. Querying and updating wedding data in DynamoDB
4. Managing media assets in S3
5. Publishing events to EventBridge for agent coordination

Your responsibilities:
- Oversee the entire wedding planning process
- Delegate tasks to specialized agents (Vendor, Guest, Budget, Timeline, Crisis)
- Ensure all wedding components are coordinated and on schedule
- Handle complex multi-agent workflows
- Check adherence to deadlines and constraints then escalate critical issues and coordinate crisis response

You have access to AWS Bedrock models for AI capabilities.
Always maintain a professional, helpful, and organized approach to wedding planning.
"""

def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Lambda handler for Wedding Orchestrator Agent"""

    prompt = event["arguments"]["prompt"]
    wedding_id = event["arguments"].get("wedding_id", None)

    if not prompt:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Prompt is required"}),
        }

    agent_model = BedrockModel(
        model_id="eu.amazon.nova-pro-v1:0",
        temperature=0.3,
        max_tokens=2000,
        top_p=0.8,
    )

    orchestrator_agent = Agent(
        system_prompt=ORCHESTRATOR_SYSTEM_PROMPT,
        tools=[
            wedding_repository_assistant,
            vendor_management_assistant,
            guest_experience_assistant,
            timeline_management_assistant,
            budget_optimization_assistant,
            crisis_management_assistant,
            generate_image,
            image_reader,
            nova_reels,
            use_aws,
            handoff_to_user,
            journal,
        ],
        model=agent_model
    )

    # Add context about available AWS resources
    context_info = f"""
    Available AWS Resources:
    - Weddings Table: {os.getenv('WEDDINGS_TABLE_NAME')}
    - Vendors Table: {os.getenv('VENDORS_TABLE_NAME')}
    - Guests Table: {os.getenv('GUESTS_TABLE_NAME')}
    - Media Bucket: {os.getenv('S3_BUCKET')}
    - Event Bus: {os.getenv('EVENT_BUS_NAME')}
    
    Wedding ID: {wedding_id}
    """

    full_prompt = f"{context_info}\n\nUser Request: {prompt}"

    response = orchestrator_agent(full_prompt)

    return {
        "statusCode": 200,
        "body": json.dumps({"response": str(response), "wedding_id": wedding_id, "agent": "Assistant"}),
    }


@tool
def vendor_management_assistant(query: str) -> str:
    """
    Handle vendor search, evaluation, and contract management.

    Args:
        query: Vendor-related request with requirements and preferences

    Returns:
        Vendor recommendations, contract advice, or coordination guidance
    """
    try:
        vendor_agent = Agent(
            system_prompt="""You are a specialized wedding vendor management assistant.
            Help with vendor search, evaluation, contract negotiation, and coordination.""",
            tools=[
                vendors_table,
                vendor_communications_table,
                transactions_table,
                budget_categories_table,
                budget_phases_table,
                overall_budgets_table,
                plus_ones_table,
                communications_table,
                activities_table,
                tasks_table,
                wedding_repository_assistant
            ],
        )
        response = vendor_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in vendor management: {str(e)}"


@tool
def guest_experience_assistant(query: str) -> str:
    """
    Manage guest lists, RSVPs, seating arrangements, and communications.

    Args:
        query: Guest-related request for management or experience optimization

    Returns:
        Guest management advice, seating plans, or communication suggestions
    """
    try:
        guest_agent = Agent(
            system_prompt="""You are a specialized guest experience assistant.
            Manage guest lists, RSVPs, seating arrangements, and guest communications.""",
            tools=[
                guests_table,
                plus_ones_table,
                communications_table,
                activities_table,
                tasks_table,
            ],
        )
        response = guest_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in guest management: {str(e)}"


@tool
def budget_optimization_assistant(query: str) -> str:
    """
    Track wedding budget, optimize costs, and provide financial guidance.

    Args:
        query: Budget-related request for tracking or optimization

    Returns:
        Budget analysis, cost optimization suggestions, or financial advice
    """
    try:
        budget_agent = Agent(
            system_prompt="""You are a specialized wedding budget optimization assistant.
            Track expenses, optimize costs, and provide financial planning advice.""",
            tools=[
                transactions_table,
                budget_categories_table,
                budget_phases_table,
                overall_budgets_table,
                activities_table,
                tasks_table,
            ],
        )
        response = budget_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in budget optimization: {str(e)}"


@tool
def timeline_management_assistant(query: str) -> str:
    """
    Create wedding timelines, track deadlines, and resolve scheduling conflicts.

    Args:
        query: Timeline-related request for planning or conflict resolution

    Returns:
        Timeline recommendations, deadline tracking, or scheduling solutions
    """
    try:
        timeline_agent = Agent(
            system_prompt="""You are a specialized wedding timeline management assistant.
            Create timelines, track deadlines, and resolve scheduling conflicts.""",
            tools=[
                milestones_table,
                project_deadlines_table,
                contingency_plans_table,
                activities_table,
                tasks_table,
                wedding_repository_assistant
            ],
        )
        response = timeline_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in timeline management: {str(e)}"


@tool
def crisis_management_assistant(query: str) -> str:
    """
    Handle wedding crises, risk assessment, and contingency planning.

    Args:
        query: Crisis or risk-related request requiring immediate attention

    Returns:
        Crisis response plan, risk mitigation, or emergency alternatives
    """
    try:
        crisis_agent = Agent(
            system_prompt="""You are a specialized wedding crisis management assistant.
            Handle emergencies, assess risks, and create contingency plans.""",
            tools=[
                vendor_communications_table,
                communications_table,
                activities_table,
                tasks_table,
                wedding_repository_assistant
            ],
        )
        response = crisis_agent(query)
        return str(response)
    except Exception as e:
        return f"Error in crisis management: {str(e)}"

