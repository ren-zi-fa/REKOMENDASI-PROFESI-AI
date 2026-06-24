import fs from "fs";
import path from "path";

export interface ProfessionData {
  code: string;
  name: string;
  aliases: string[];
}

let globalProfessionContext: ProfessionData[] | null = null;
let rawContextString: string | null = null;

export function getProfessionContext(): ProfessionData[] {
  if (globalProfessionContext) {
    return globalProfessionContext;
  }

  const contextPath = path.join(process.cwd(), "context.md");
  try {
    const fileContent = fs.readFileSync(contextPath, "utf-8");
    rawContextString = fileContent;

    const dataMap = new Map<string, ProfessionData>();

    // Parse main table
    const lines = fileContent.split('\n');
    let isParsingMainTable = false;
    let isParsingExamples = false;

    for (const line of lines) {
      if (line.startsWith('## Daftar Kode Profesi')) {
        isParsingMainTable = true;
        isParsingExamples = false;
        continue;
      }
      if (line.startsWith('## Contoh Pemetaan')) {
        isParsingMainTable = false;
        isParsingExamples = true;
        continue;
      }

      // Parse table rows
      if (line.trim().startsWith('|') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        
        if (isParsingMainTable && parts.length === 2 && parts[0] !== 'Kode') {
          const code = parts[0];
          const name = parts[1];
          if (!dataMap.has(code)) {
            dataMap.set(code, {
              code,
              name,
              aliases: [name.toLowerCase()] // name is a natural alias
            });
          }
        }

        if (isParsingExamples && parts.length === 3 && parts[0] !== 'Input Pengguna') {
          const input = parts[0].toLowerCase();
          const code = parts[1];
          // const name = parts[2];
          
          if (dataMap.has(code)) {
            const entry = dataMap.get(code)!;
            if (!entry.aliases.includes(input)) {
              entry.aliases.push(input);
            }
          }
        }
      }
    }

    globalProfessionContext = Array.from(dataMap.values());
    return globalProfessionContext;
  } catch (error) {
    console.error("Failed to load context.md", error);
    return [];
  }
}

export function getRawContextString(): string {
  if (!rawContextString) {
    getProfessionContext(); // this sets rawContextString
  }
  return rawContextString || "";
}
