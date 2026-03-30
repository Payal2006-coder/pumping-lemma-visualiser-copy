import { useState } from "react";

export default function App() {
  const [inputString, setInputString] = useState("");
  const [p, setP] = useState(3);
  const [splits, setSplits] = useState([]);
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [k, setK] = useState(1);
  const [proofResult, setProofResult] = useState(null);
  const [language, setLanguage] = useState("anbn");
  const blockStyle = {
  padding: "8px",
  borderRadius: "6px",
  display: "inline-block",
  animation: "pop 0.6s ease-in-out",
};

  // Generate splits
  function generateSplits(w, p) {
    let result = [];

    for (let i = 0; i <= p; i++) {
      for (let j = i + 1; j <= p; j++) {
        result.push({
          x: w.slice(0, i),
          y: w.slice(i, j),
          z: w.slice(j),
        });
      }
    }

    return result;
  }

  // Pump string
  function pumpString(x, y, z, k) {
    return x + y.repeat(k) + z;
  }

  // Multi-language validation
  function isValid(str) {
    if (language === "anbn") {
      let i = 0;
      while (i < str.length && str[i] === "a") i++;
      let aCount = i;

      let bCount = 0;
      while (i < str.length && str[i] === "b") {
        bCount++;
        i++;
      }

      return i === str.length && aCount === bCount;
    }

    else if (language === "anb2n") {
      let i = 0;
      while (i < str.length && str[i] === "a") i++;
      let aCount = i;

      let bCount = 0;
      while (i < str.length && str[i] === "b") {
        bCount++;
        i++;
      }

      return i === str.length && bCount === 2 * aCount;
    }

    else if (language === "astar") {
      for (let c of str) {
        if (c !== "a") return false;
      }
      return true;
    }
    // a^n b^n c^n
else if (language === "anbncn") {
  let i = 0;

  while (i < str.length && str[i] === "a") i++;
  let a = i;

  let b = 0;
  while (i < str.length && str[i] === "b") {
    b++;
    i++;
  }

  let c = 0;
  while (i < str.length && str[i] === "c") {
    c++;
    i++;
  }

  return i === str.length && a === b && b === c;
}

// a^n b^m (regular)
else if (language === "anbm") {
  let i = 0;

  while (i < str.length && str[i] === "a") i++;
  while (i < str.length && str[i] === "b") i++;

  return i === str.length;
}

// equal 0s and 1s
else if (language === "equal01") {
  let zero = 0, one = 0;

  for (let c of str) {
    if (c === "0") zero++;
    else if (c === "1") one++;
    else return false;
  }

  return zero === one;
}

// palindrome
else if (language === "palindrome") {
  return str === str.split("").reverse().join("");
}

    return false;
  }

  // Auto proof
  function checkAllSplits() {
    let allFail = true;

    for (let s of splits) {
      let failed = false;

      for (let testK of [0, 1, 2, 3]) {
        let pumpedStr = pumpString(s.x, s.y, s.z, testK);

        if (!isValid(pumpedStr)) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        allFail = false;
        break;
      }
    }

    return allFail;
  }

  const pumped = selectedSplit
    ? pumpString(selectedSplit.x, selectedSplit.y, selectedSplit.z, k)
    : "";

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
      }}
    >
      <style>
{`
@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`}
</style>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        Pumping Lemma Visualizer 🚀
      </h1>

      {/* Language Dropdown */}
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          setSelectedSplit(null);
          setProofResult(null);
        }}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "15px",
          borderRadius: "8px",
        }}
      >
        <option value="anbn">L = aⁿ bⁿ</option>
        <option value="anb2n">L = aⁿ b²ⁿ</option>
        <option value="astar">L = a*</option>
      

        {/* NEW */}
        <option value="anbncn">L = aⁿ bⁿ cⁿ</option>
        <option value="anbm">L = aⁿ bᵐ</option>
        <option value="equal01">L = equal 0s & 1s</option>
        <option value="palindrome">L = palindrome</option>
      </select>
      

      {/* Input string */}
      <input
        type="text"
        placeholder="Enter string"
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        style={{
          padding: "12px",
          width: "300px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "none",
        }}
      />

      {/* Input p */}
      <input
        type="number"
        value={p}
        onChange={(e) => setP(Number(e.target.value))}
        style={{
          padding: "12px",
          width: "300px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "none",
        }}
      />

      {/* Buttons */}
      <button
        onClick={() => {
          setSplits(generateSplits(inputString, p));
          setSelectedSplit(null);
          setProofResult(null);
        }}
        style={{
          padding: "12px 25px",
          backgroundColor: "#3b82f6",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Generate Splits
      </button>

      <button
        onClick={() => setProofResult(checkAllSplits())}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#22c55e",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Auto Prove
      </button>

      {/* Proof Result */}
      {proofResult !== null && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {proofResult
            ? "✅ Language is NOT Regular"
            : "⚠ Could not prove non-regular"}
        </div>
      )}

      {/* Selected Split */}
      {selectedSplit && (
        <>
          <div
            style={{
              marginTop: "30px",
              padding: "15px",
              backgroundColor: "#020617",
              borderRadius: "10px",
              border: "2px solid #3b82f6",
              width: "300px",
              textAlign: "center",
            }}
          >
            <div>
              x: <span style={{ color: "#60a5fa" }}>{selectedSplit.x || "ε"}</span>
            </div>
            <div>
              y: <span style={{ color: "#4ade80" }}>{selectedSplit.y}</span>
            </div>
            <div>
              z: <span style={{ color: "#f87171" }}>{selectedSplit.z || "ε"}</span>
            </div>
          </div>

          {/* Slider */}
          <div style={{ marginTop: "20px", width: "300px" }}>
            <input
              type="range"
              min="0"
              max="5"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <p style={{ textAlign: "center" }}>k = {k}</p>
          </div>

          {/* Result */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            Result: {pumped}

            <div
              style={{
                marginTop: "10px",
                color: isValid(pumped) ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
              }}
            >
              {isValid(pumped) ? "✅ Valid" : "❌ Not Valid"}
            </div>
          </div>

          {/* Visual Blocks */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {selectedSplit.x.split("").map((c, i) => (
              <span key={"x" + i}
               style={{ ...blockStyle, backgroundColor: "#1d4ed8" }}>
                {c}
              </span>
            ))}

            {Array.from({ length: k }).map((_, i) =>
              selectedSplit.y.split("").map((c, j) => (
                <span key={"y" + i + j} 
                style={{ ...blockStyle, backgroundColor: "#16a34a" }}>

                  {c}
                </span>
              ))
            )}

            {selectedSplit.z.split("").map((c, i) => (
              <span key={"z" + i} 
              style={{ ...blockStyle, backgroundColor: "#dc2626" }}>
                {c}
              </span>
            ))}
          </div>
        </>
      )}

      {/* All Splits */}
      <div
  style={{
    marginTop: "40px",
    width: "90%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    padding: "020px",

  }}
>
        {splits.map((s, index) => (
          <div
            key={index}
            onClick={() => setSelectedSplit(s)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
          }}
            style={{
           padding: "12px",
          borderRadius: "10px",
           cursor: "pointer",
           boxSpacing: "border-box",
           backgroundColor:
           selectedSplit === s ? "#334155" : "#1e293b",
          border:
         selectedSplit === s
      ? "2px solid #22c55e"
      : "1px solid #334155",
          boxShadow:
      selectedSplit === s
        ? "0 0 15px rgba(34,197,94,0.6)"
        : "0 4px 15px rgba(0,0,0,0.3)",
        width: "100%",
        minHeight: "110px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      }}
          >
            <div>
              x: <span style={{ color: "#60a5fa" }}>{s.x || "ε"}</span>
            </div>
            <div>
              y: <span style={{ color: "#4ade80" }}>{s.y}</span>
            </div>
            <div>
              z: <span style={{ color: "#f87171" }}>{s.z || "ε"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
