from app.ai.graph import graph

text = """
During manufacturing of API batch B24091 on 27 September 2026,
the reactor temperature increased to 82°C for approximately
18 minutes.

The approved operating range for the process step is
75°C to 80°C.

The deviation was detected by the production operator during
routine monitoring.

No equipment failure was observed.

The batch was placed on hold pending Quality review.
"""

result = graph.invoke({
    "input_text": text,
    "deviation": None,
    "assessment": None
})

print("\nFINAL GRAPH RESULT:")
print(result)