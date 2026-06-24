import { searchProfession, getTopCandidates, fuseScoreToConfidence } from "./src/lib/profession-search";

const query = "sals marketing";
const results = searchProfession(query);
console.log("Search Profession Results (threshold 0.3):");
if (results.length > 0) {
  const bestMatch = results[0];
  console.log("Best match:", bestMatch.item.name, "Score:", bestMatch.score, "Confidence:", fuseScoreToConfidence(bestMatch.score));
} else {
  console.log("No results");
}

const top = getTopCandidates(query);
console.log("\nTop Candidates (threshold 0.6):");
console.log(top.map(t => t.name).join(", ") || "No candidates");
