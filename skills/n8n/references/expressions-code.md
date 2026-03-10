# n8n Expressions and Code Reference

## Expressions Overview

Expressions allow dynamic data access and transformation in n8n nodes using `{{ }}` syntax.

## Expression Syntax

### Basic Access

```
{{ $json.field }}                    # Current item field
{{ $json.nested.field }}             # Nested field access
{{ $json.array[0] }}                 # Array index
{{ $json.array[0].name }}            # Array item field
```

### Node References

```
{{ $node["NodeName"].json }}         # All data from named node
{{ $node["NodeName"].json.field }}   # Specific field from node
{{ $node["HTTP Request"].json.data }} # Example with space in name
```

### Input References

```
{{ $input.item() }}                  # Current item
{{ $input.all() }}                   # All items array
{{ $input.first() }}                 # First item
{{ $input.last() }}                  # Last item
{{ $input.item(2) }}                 # Item at index 2
```

## Built-in Variables

### Execution Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$execution.id` | Execution ID | `"123"` |
| `$execution.mode` | Execution mode | `"manual"`, `"trigger"` |
| `$execution.url` | Execution URL | `"https://..."` |
| `$execution.resumeUrl` | Resume URL (Wait node) | `"https://..."` |

### Workflow Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$workflow.id` | Workflow ID | `"1"` |
| `$workflow.name` | Workflow name | `"My Workflow"` |
| `$workflow.active` | Is workflow active | `true` |

### Date/Time Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$now` | Current datetime | `2024-01-15T10:30:00.000Z` |
| `$today` | Today's date | `2024-01-15` |
| `$formatDate($now, 'yyyy-MM-dd')` | Formatted date | `"2024-01-15"` |

### Custom Variables

```
{{ $vars.myVariable }}               # Custom workflow variable
```

### Item Context

| Variable | Description |
|----------|-------------|
| `$itemIndex` | Index of current item in array |
| `$runIndex` | Run index for loops |

## Data Transformation Functions

### Array Functions

```
{{ $json.items.length() }}                    # Array length
{{ $json.items.first() }}                     # First element
{{ $json.items.last() }}                      # Last element
{{ $json.items.map(item => item.name) }}      # Map to names
{{ $json.items.filter(item => item.active) }} # Filter active
{{ $json.items.find(item => item.id === 1) }} # Find by condition
{{ $json.items.includes(value) }}             # Contains check
{{ $json.items.join(", ") }}                  # Join to string
{{ $json.items.slice(0, 5) }}                 # Slice array
{{ $json.items.sort() }}                      # Sort array
{{ $json.items.reverse() }}                   # Reverse array
{{ $json.items.reduce((sum, n) => sum + n, 0) }} # Reduce
{{ $json.items.flat() }}                      # Flatten nested
{{ $json.items.unique() }}                    # Remove duplicates
```

### String Functions

```
{{ $json.text.upper() }}                      # Uppercase
{{ $json.text.lower() }}                      # Lowercase
{{ $json.text.capitalize() }}                 # Capitalize first
{{ $json.text.trim() }}                       # Remove whitespace
{{ $json.text.trimStart() }}                  # Trim start
{{ $json.text.trimEnd() }}                    # Trim end
{{ $json.text.replace("old", "new") }}        # Replace
{{ $json.text.replaceAll("a", "b") }}         # Replace all
{{ $json.text.split(",") }}                   # Split to array
{{ $json.text.substring(0, 5) }}              # Substring
{{ $json.text.includes("search") }}           # Contains check
{{ $json.text.startsWith("prefix") }}         # Starts with
{{ $json.text.endsWith("suffix") }}           # Ends with
{{ $json.text.length() }}                     # String length
{{ $json.text.isEmpty() }}                    # Is empty check
{{ $json.text.encodeUrl() }}                  # URL encode
{{ $json.text.decodeUrl() }}                  # URL decode
{{ $json.text.toNumber() }}                   # Convert to number
{{ $json.text.extractEmail() }}               # Extract email
{{ $json.text.extractUrl() }}                 # Extract URL
```

### Number Functions

```
{{ $json.value.toFixed(2) }}                  # Fixed decimals
{{ $json.value.round() }}                     # Round
{{ $json.value.floor() }}                     # Floor
{{ $json.value.ceil() }}                      # Ceiling
{{ $json.value.abs() }}                       # Absolute value
{{ $json.value.format() }}                    # Format with commas
{{ $json.value.toFixed(2).format() }}         # Formatted decimals
```

### Object Functions

```
{{ $json.object.keys() }}                     # Get keys
{{ $json.object.values() }}                   # Get values
{{ $json.object.entries() }}                  # Key-value pairs
{{ $json.object.hasProperty("key") }}         # Has key check
{{ $json.object.size() }}                     # Number of keys
```

### Date Functions (Luxon)

```
{{ $now.toFormat('yyyy-MM-dd') }}             # Format date
{{ $now.toFormat('HH:mm:ss') }}               # Format time
{{ $now.plus({ days: 7 }).toISO() }}          # Add 7 days
{{ $now.minus({ hours: 1 }).toISO() }}        # Subtract 1 hour
{{ DateTime.fromISO($json.date) }}            # Parse ISO date
{{ DateTime.fromFormat('2024-01-15', 'yyyy-MM-dd') }} # Parse custom
{{ $now.startOf('day').toISO() }}             # Start of day
{{ $now.endOf('month').toISO() }}             # End of month
{{ $now.weekday }}                            # Day of week (1-7)
{{ $now.month }}                              # Month (1-12)
{{ $now.year }}                               # Year
```

### Boolean Functions

```
{{ $json.value.toBoolean() }}                 # Convert to boolean
{{ $json.value.not() }}                       # Negate
```

## Conditional Expressions

### Ternary Operator

```
{{ $json.active ? "Active" : "Inactive" }}
{{ $json.score > 80 ? "Pass" : "Fail" }}
{{ $json.items.length() > 0 ? "Has items" : "Empty" }}
```

### Logical Operators

```
{{ $json.a && $json.b }}                      # AND
{{ $json.a || $json.b }}                      # OR
{{ !$json.a }}                                # NOT
```

### Comparison Operators

```
{{ $json.a === $json.b }}                     # Strict equal
{{ $json.a !== $json.b }}                     # Not equal
{{ $json.a > $json.b }}                       # Greater than
{{ $json.a >= $json.b }}                      # Greater or equal
{{ $json.a < $json.b }}                       # Less than
{{ $json.a <= $json.b }}                      # Less or equal
```

## JMESPath Queries

Query JSON with JMESPath syntax:

```
{{ $jmespath($json, "users[*].name") }}       # All user names
{{ $jmespath($json, "users[?age > `18`].name") }} # Filter by age
{{ $jmespath($json, "sort_by(users, &age)[0]") }} # Sort and get first
{{ $jmespath($json, "items[].{name: name, price: price}") }} # Project
```

## Code Node

### JavaScript Code Node

**Basic Structure:**
```javascript
// Input data
const items = $input.all();

// Process items
const result = items.map(item => ({
  json: {
    original: item.json.value,
    processed: item.json.value * 2
  }
}));

// Return items array
return result;
```

**Single Item Return:**
```javascript
return {
  json: {
    message: "Success",
    count: $input.all().length
  }
};
```

**Access Previous Nodes:**
```javascript
// Get data from specific node
const httpData = $node["HTTP Request"].json;

// Get first item from node
const firstItem = $node["HTTP Request"].first();

// Get all items from node
const allItems = $node["HTTP Request"].all();
```

**Binary Data:**
```javascript
// Access binary data
const binaryData = $input.item().binary;

// Check if binary exists
if (binaryData && binaryData.data) {
  // Process binary
}

// Return binary data
return {
  json: { processed: true },
  binary: binaryData
};
```

**Error Handling:**
```javascript
try {
  // Risky operation
  const result = someOperation();
  return { json: { success: true, result } };
} catch (error) {
  return {
    json: {
      success: false,
      error: error.message
    }
  };
}
```

**Using Luxon (Dates):**
```javascript
const { DateTime } = require('luxon');

const now = DateTime.now();
const formatted = now.toFormat('yyyy-MM-dd HH:mm:ss');
const future = now.plus({ days: 7 });

return {
  json: {
    current: formatted,
    future: future.toISO()
  }
};
```

**Console Logging:**
```javascript
// Log to browser console (visible in dev tools)
console.log('Processing item:', $input.item().json);

// Log all items
console.log('All items:', $input.all());

return $input.all();
```

### Python Code Node

**Basic Structure:**
```python
# Input data
items = _input.all()

# Process items
result = []
for item in items:
    result.append({
        "json": {
            "original": item.json["value"],
            "processed": item.json["value"] * 2
        }
    })

# Return items
return result
```

**Single Item Return:**
```python
return {
    "json": {
        "message": "Success",
        "count": len(_input.all())
    }
}
```

## Common Expression Patterns

### Extract Email Domain
```
{{ $json.email.split('@')[1] }}
```

### Generate Unique ID
```
{{ $randomUUID() }}
```

### Format Currency
```
{{ $json.amount.toFixed(2) }} {{ $json.currency }}
```

### Create Date Range
```
{{ $now.minus({ days: 7 }).toFormat('yyyy-MM-dd') }} to {{ $now.toFormat('yyyy-MM-dd') }}
```

### Combine Fields
```
{{ $json.firstName }} {{ $json.lastName }}
```

### Conditional Default
```
{{ $json.name || "Unknown" }}
```

### Nested Object Access
```
{{ $json.user.profile.settings.theme || "light" }}
```

### Parse JSON String
```
{{ JSON.parse($json.jsonString) }}
```

### Get Query Parameter
```
{{ $json.query.param || $json.params.param }}
```

### Safe Array Access
```
{{ ($json.items || [])[0] || "default" }}
```

### Calculate Percentage
```
{{ (($json.part / $json.total) * 100).toFixed(1) }}%
```

### Flatten Nested Arrays
```
{{ $json.departments.map(d => d.employees).flat() }}
```

### Group and Count
```
{{ $json.items.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {}) }}
```

## Item Linking

### Understanding Item Linking

Items maintain links to their source items through the workflow:

```
[Node A] → [Node B] → [Node C]
   ↓           ↓           ↓
 Item 1 ──→ Modified ──→ Further
           Item 1      Modified
```

### Accessing Linked Items

In the Code node:
```javascript
// Get linked item from previous node
const linkedItem = $input.item().linkedItem('Previous Node Name');

// Get all linked items
const linkedItems = $input.item().linkedItems();
```

### Preserve Linking

When transforming in Code node:
```javascript
// Preserve linking by including pairedItem
return items.map((item, index) => ({
  json: {
    ...item.json,
    processed: true
  },
  pairedItem: { item: index }  // Preserve link
}));
```
