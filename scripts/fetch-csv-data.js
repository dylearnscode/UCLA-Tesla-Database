// Script to fetch and parse the CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tesla%20Resume%20Database%20for%20UCLA%20Engineering%20%28Responses%29%20-%20Form%20Responses%201-oDlT0zcwqAb5Zrn39uDNLVruItoyGC.csv"

async function fetchAndParseCsv() {
  try {
    console.log("Fetching CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("CSV Content:")
    console.log(csvText)

    // Parse CSV manually
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("\nHeaders:", headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Handle CSV parsing with quoted fields
        const values = []
        let current = ""
        let inQuotes = false

        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        const entry = {}
        headers.forEach((header, index) => {
          entry[header] = values[index] || ""
        })
        data.push(entry)
      }
    }

    console.log("\nParsed Data:")
    console.log(JSON.stringify(data, null, 2))

    return data
  } catch (error) {
    console.error("Error fetching CSV:", error)
  }
}

fetchAndParseCsv()
