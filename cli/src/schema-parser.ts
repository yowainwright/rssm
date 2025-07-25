import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

interface ParsedSchema {
  zodSchema: string;
  typeName: string;
}

export async function parseJsonSchema(input: string, name: string): Promise<ParsedSchema> {
  let jsonSchema: any;

  // Check if input is a file path
  if (input.endsWith('.json')) {
    try {
      const filePath = path.resolve(process.cwd(), input);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      jsonSchema = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(`Failed to read schema file: ${error instanceof Error ? error.message : error}`);
    }
  } else {
    // Parse as JSON string
    try {
      jsonSchema = JSON.parse(input);
    } catch (error) {
      throw new Error(`Invalid JSON schema: ${error instanceof Error ? error.message : error}`);
    }
  }

  const typeName = `${name}Data`;
  const zodSchema = jsonToZod(jsonSchema, typeName);

  return { zodSchema, typeName };
}

function jsonToZod(schema: any, rootName: string): string {
  const schemas: string[] = [];
  const mainSchema = convertToZod(schema, rootName, schemas);
  
  // Build the complete schema string
  let result = '';
  
  // Add any nested schemas first
  if (schemas.length > 0) {
    result = schemas.join('\n\n') + '\n\n';
  }
  
  // Add the main schema
  result += `const ${rootName.toLowerCase()}Schema = ${mainSchema};\n\n`;
  result += `type ${rootName} = z.infer<typeof ${rootName.toLowerCase()}Schema>;`;
  
  return result;
}

function convertToZod(value: any, name: string, schemas: string[]): string {
  if (value === null || value === undefined) {
    return 'z.unknown()';
  }

  // Handle primitive type strings
  if (typeof value === 'string') {
    switch (value.toLowerCase()) {
      case 'string':
        return 'z.string()';
      case 'number':
        return 'z.number()';
      case 'boolean':
        return 'z.boolean()';
      case 'date':
        return 'z.string().datetime()';
      default:
        return 'z.string()';
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'z.array(z.unknown())';
    }
    const itemSchema = convertToZod(value[0], `${name}Item`, schemas);
    return `z.array(${itemSchema})`;
  }

  // Handle objects
  if (typeof value === 'object') {
    const properties: string[] = [];
    
    for (const [key, val] of Object.entries(value)) {
      const fieldName = key;
      const fieldSchema = convertToZod(val, `${name}${capitalize(key)}`, schemas);
      properties.push(`  ${fieldName}: ${fieldSchema},`);
    }
    
    return `z.object({\n${properties.join('\n')}\n})`;
  }

  // Default fallback
  return 'z.unknown()';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}