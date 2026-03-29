"""Script to run the Vellum workflow."""

import os
import sys
from dotenv import load_dotenv
from workflow import Workflow, Inputs

load_dotenv()


def main():
    """Execute the workflow with the provided query."""
    if not os.getenv("VELLUM_API_KEY"):
        print("Error: VELLUM_API_KEY environment variable is not set")
        print("Please set it in your .env file or export it")
        sys.exit(1)

    query = sys.argv[1] if len(sys.argv) > 1 else "Can I push to production?"
    workflow = Workflow()
    
    print(f"Executing workflow with query: {query}")
    print("-" * 60)

    result = workflow.run(inputs=Inputs(query=query))

    if result.name == "workflow.execution.fulfilled":
        print("\n✓ Workflow completed successfully!")
        print("-" * 60)
        
        for output_descriptor, output_value in result.outputs:
            if output_descriptor.name == "final_output":
                print(f"\nOutput: {output_value}")
                return
        
        print("\nWarning: Could not find output. Full result:")
        print(result.outputs)
    else:
        print(f"\n✗ Workflow execution failed: {result.name}")
        if hasattr(result, "body") and hasattr(result.body, "error"):
            error = result.body.error
            print(f"Error: {error.message if hasattr(error, 'message') else str(error)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

