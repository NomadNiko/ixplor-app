#!/bin/bash
echo "Creating combined source file..."

# Function to clean a file of empty lines and comments
clean_file() {
  grep -v "^$" "$1" | grep -v "^[[:space:]]*\/\/" | grep -v "^[[:space:]]*\/\*" | grep -v "^[[:space:]]*\*"
}

# Create output file with date
output_file="combined_source_$(date +%Y_%m_%d).txt"
rm -f "$output_file"
touch "$output_file"

# Root directories for both frontend and backend
declare -a root_dirs=(
  "./*"
)

# Important directories to include
declare -a include_patterns=(
  "/src/**/*"
  "/docs/**/*"
  "/config/**/*"
  "package.json"
  "tsconfig.json"
  ".env.example"
)

# Patterns to exclude
declare -a exclude_patterns=(
  "node_modules"
  ".git"
  ".vscode"
  ".idea"
  "dist"
  "build"
  ".next"
  "coverage"
  "*.test.*"
  "*.spec.*"
  "*.d.ts"
  "*.map"
  "*.log"
  ".env"
  ".env.*"
  "!.env.example"
  ".DS_Store"
  "*.lock"
  "package-lock.json"
  "yarn.lock"
  "*.min.*"
)

# File extensions to include
declare -a extensions=(
  "ts"
  "tsx"
  "js"
  "jsx"
  "json"
  "md"
  "yaml"
  "yml"
)

# Build exclude pattern
exclude_pattern=""
for pattern in "${exclude_patterns[@]}"; do
  exclude_pattern="$exclude_pattern -not -path '*/$pattern/*' -not -name '$pattern'"
done

# Find and process files
for root in "${root_dirs[@]}"; do
  if [ -d "$root" ]; then
    echo "Processing $root..."
    echo "// Files from $root" >> "$output_file"
    echo "----------------------------------------" >> "$output_file"
    
    # Process each include pattern
    for pattern in "${include_patterns[@]}"; do
      # Process each extension
      for ext in "${extensions[@]}"; do
        # Find matching files
        while IFS= read -r -d $'\0' file; do
          if [ -f "$file" ]; then
            echo "Processing: $file"
            echo -e "\n// $file" >> "$output_file"
            echo "----------------------------------------" >> "$output_file"
            clean_file "$file" >> "$output_file"
            echo "----------------------------------------" >> "$output_file"
          fi
        done < <(eval "find \"$root\" -type f -name \"*.$ext\" $exclude_pattern -path \"$root$pattern\" -print0" 2>/dev/null)
      done
    done
  fi
done

echo "Combined source file created as $output_file"